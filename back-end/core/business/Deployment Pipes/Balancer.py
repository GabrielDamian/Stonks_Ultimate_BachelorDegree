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
            1: True,
            2: True
        }
        self.lock = Lock()
    def lockNode(self,id):
        with self.lock:
            self.dict[id] = False
    def releaseNode(self,id):
        with self.lock:
            self.dict[id] = True

    def giveMeSlot(self):
        with self.lock:
            for a in self.dict:
                if(self.dict[a]):
                    self.dict[a] = False
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
    for message in releaser_consumer:
        decodedMsg = message.value.decode('utf-8')
        nodesMapEl.releaseNode(decodedMsg)



if __name__ == '__main__':

    nodesMapEl = NodesMap()
    KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['to-balancer'])
    front_end_consumer = KafkaConsumer(
        'to-stage-1',
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        # value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    my_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )
    releaserThread = threading.Thread(target=releasePipe,args=(nodesMapEl,))
    for message in front_end_consumer:
        print("balancer received from front end:", message.value)
        emptySlot = False
        while not emptySlot:
            emptySlot = False if nodesMapEl.giveMeSlot() == None else True
            print("All pipes busy, retrying in 2 seconds")
            time.sleep(2)

        node = NodeCore.Pipe_Node('Stage 1','to-stage-2',message.value.decode('utf-8'))
        node.node_core()
        # message = message.value
        print("out stage 1:", node.result)
        my_producer.send(node.nextTopic, value=node.result)


