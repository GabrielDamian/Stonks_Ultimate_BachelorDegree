import threading
import time
from json import loads
from kafka import KafkaAdminClient, KafkaConsumer,KafkaProducer
from json import dumps
from NodeStructure import NodeCore
from threading import Thread, Lock

class NodesMap:
    def __init__(self):
        self.dict = {
            'pipe_1_stage_1': True,
        }
        self.lock = Lock()
    def lockNode(self,id):
        with self.lock:
            self.dict[id] = False
    def releaseNode(self,id):
        with self.lock:
            self.dict[id] = True

    def giveMeSlot(self):
        for a in self.dict:
            if(self.dict[a]):
                self.lockNode(a)
                return a
        return None


def releasePipe(nodesMapEl):
    print("Release thread started:")
    releaser_consumer = KafkaConsumer(
        'balancer-releaser',
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        # value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    print("release before FOR")
    for message in releaser_consumer:
        print("BALANCER RELEASER---")
        decodedMsg = message.value
        print("msg:",decodedMsg)
        nodesMapEl.releaseNode(decodedMsg)

if __name__ == '__main__':
    nodesMapEl = NodesMap()
    KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['to-balancer'])
    front_end_consumer = KafkaConsumer(
        'to-balancer',
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        # value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    my_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        # value_serializer=lambda x: dumps(x).encode('utf-8')
    )
    releaserThread = threading.Thread(target=releasePipe,args=(nodesMapEl,))
    releaserThread.start()
    for message in front_end_consumer:
        print("balancer received from front end:", message.value)
        emptySlot = False
        while emptySlot == False:
            nodeId = nodesMapEl.giveMeSlot()
            emptySlot = False if nodeId is None else nodeId
            print("All pipes busy, retrying in 2 seconds")
            time.sleep(2)

        node = NodeCore.Pipe_Node(emptySlot,'pipe_1_stage_1',message.value.decode())
        node.node_core(emptySlot)
        # message = message.value
        print("Node result:",node.result)
        to_send = node.result
        try:
            to_send = node.result.decode()
        except (UnicodeDecodeError, AttributeError):
            pass

        my_producer.send(node.nextTopic, value=to_send.encode())


