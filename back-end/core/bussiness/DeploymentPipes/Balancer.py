import threading
import time
import requests
import json
from json import loads
from kafka import KafkaAdminClient, KafkaConsumer, KafkaProducer
from json import dumps
from NodeStructure import NodeCore
from threading import Thread, Lock
import json


class NodesMap:
    def __init__(self):
        self.dict = {
            'pipe_1_stage_1': True,
        }
        self.lock = Lock()

    def lockNode(self, id):
        with self.lock:
            self.dict[id] = False

    def releaseNode(self, id):
        with self.lock:
            self.dict[id] = True

    def giveMeSlot(self):
        for a in self.dict:
            if (self.dict[a]):
                self.lockNode(a)
                return a
        return None


def releasePipe(nodesMapEl):
    # KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['balancer-releaser'])

    releaser_consumer = KafkaConsumer(
        'balancer-releaser',
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        # value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    for message in releaser_consumer:
        print("--Balancer Releaser received:", message.value)
        bytes = message.value
        bytesDecoded = bytes.decode()
        objectEl = json.loads(bytesDecoded)
        nodesMapEl.releaseNode(objectEl['pipe'])


def balancerTask(packetSource):
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'balancer'
    return localPacket


def persistNodeEntity(sourcePacket):
    print("Create Node Entity-> Persist into db:", sourcePacket)

    # Nodes Persitence Service
    url = 'http://localhost:3005/create-node'

    bodyPersistNode = {
        'buildName': sourcePacket['payload']['buildName'],
        'owner': sourcePacket['payload']['owner'],
        'description': sourcePacket['payload']['description'],
        'market': sourcePacket['payload']['market']
    }
    print("bodyPersistNode:", bodyPersistNode)

    response = requests.post(url, json=bodyPersistNode)

    # nodeID
    decodedResponse = response.content.decode()
    return json.loads(decodedResponse)['id']


if __name__ == '__main__':

    my_node_name = 'balancer'
    receive_from = 'to-balancer'
    send_to = 'pipe_1_stage_1'

    print("Balancer listening")
    nodesMapEl = NodesMap()
    # KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['to-balancer'])
    balancer_consumer = KafkaConsumer(
        receive_from,
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='latest',
        enable_auto_commit=True,
    )
    balancer_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        # value_serializer=lambda x: dumps(x).encode('utf-8')
    )
    releaserThread = threading.Thread(target=releasePipe, args=(nodesMapEl,))
    releaserThread.start()

    for message in balancer_consumer:

        emptySlot = False
        while emptySlot == False:
            nodeId = nodesMapEl.giveMeSlot()
            emptySlot = False if nodeId is None else nodeId
            time.sleep(2)

        decodeObject = json.loads(message.value.decode())

        initPacket = {
            'pipe': emptySlot,
            'payload': decodeObject.copy(),
            'history': ''
        }

        mongoId = persistNodeEntity(initPacket)
        initPacket['payload']['id'] = mongoId

        print("initPacket:", initPacket)

        node = NodeCore.Pipe_Node(
            name='balancer',
            resources=initPacket,
            task=balancerTask
        )

        to_send = json.dumps(node.executeTask())
        balancer_producer.send(send_to, value=to_send.encode())
