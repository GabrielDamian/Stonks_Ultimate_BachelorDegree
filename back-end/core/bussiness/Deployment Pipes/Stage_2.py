from json import loads
import time
from kafka import KafkaAdminClient, KafkaConsumer,KafkaProducer
import json
from Tasks import TasksCore
from json import dumps
from NodeStructure import NodeCore

def Stage_2_Task(packetSource):
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_2'
    return localPacket

if __name__ == '__main__':
    # args
    my_node_name = 'stage_1'
    receive_from = 'pipe_1_stage_2'
    send_to = 'balancer-releaser'
    my_node_task = 'stage_2'

    KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['pipe_1_stage_2'])

    my_consumer = KafkaConsumer(
        'pipe_1_stage_2',
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='latest',
        enable_auto_commit=True,
        group_id='my-group',
        # value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    my_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        # value_serializer=lambda x: dumps(x).encode('utf-8')
    )
    print("waiting in stage 2")
    for message in my_consumer:
        print("Stage 2 received:", message.value)
        bytes = message.value
        bytesDecoded = bytes.decode()
        objectEl = json.loads(bytesDecoded)
        # node = NodeCore.Pipe_Node('Stage 2', 'balancer-releaser', objectEl)
        node = NodeCore.Pipe_Node(
            name='Stage 2',
            resources=objectEl,
            task=TasksCore.tasksCore[my_node_task]
        )
        to_send = json.dumps(node.executeTask())
        print("Packet to send:", to_send)
        time.sleep(2)
        my_producer.send(send_to, value=to_send.encode())