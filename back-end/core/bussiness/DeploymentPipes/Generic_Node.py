import time
from json import loads
from kafka import KafkaAdminClient, KafkaConsumer, KafkaProducer
from json import dumps
from NodeStructure import NodeCore
import json
from Tasks import TasksCore
import sys

if __name__ == '__main__':
    print("TEST:", sys.argv)
    
    my_node_name = sys.argv[1]
    receive_from = sys.argv[2]
    send_to = sys.argv[3]
    my_node_task = sys.argv[4]
    releaser_adr = sys.argv[5]

    print("Node " + my_node_name + " is listening!")

    my_consumer = KafkaConsumer(
        receive_from,
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='latest',
        enable_auto_commit=True,
    )
    my_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
    )
    for message in my_consumer:
        bytes = message.value
        bytesDecoded = bytes.decode()
        objectEl = json.loads(bytesDecoded)
        node = NodeCore.Pipe_Node(
            name='Stage 1',
            resources=objectEl,
            task=TasksCore.tasksCore[my_node_task]
        )

        # berfore
        # nodeExecution = node.executeTask()
        # print("Node execution:", nodeExecution)
        # to_send = json.dumps(nodeExecution)
        # my_producer.send(send_to, value=to_send.encode())

        nodeExecution = None
        nodeExecution = node.executeTask()

        if nodeExecution == None:
            print("Failed to executed node task!")
            fake_release_object = {
                'pipe': objectEl['pipe']
            }

            to_send = json.dumps(fake_release_object).encode()
            print("Send release pipe signal to balancer for pipe:" +
                  objectEl['pipe'])
            my_producer.send(releaser_adr, value=to_send)
            time.sleep(1)

        else:
            print("Successfully executed node task!")
            to_send = json.dumps(nodeExecution)
            my_producer.send(send_to, value=to_send.encode())
            time.sleep(1)
