from json import loads
from kafka import KafkaAdminClient, KafkaConsumer,KafkaProducer
from json import dumps
from NodeStructure import NodeCore

if __name__ == '__main__':

    # KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['to-stage-1'])
    my_consumer = KafkaConsumer(
        'pipe_1_stage_1',
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
    print("waiting in stage 1")
    for message in my_consumer:

        print("entry stage 1:", message.value)
        node = NodeCore.Pipe_Node('Stage 1','pipe_1_stage_2',message.value.decode())
        node.node_core(message.value)
        # message = message.value
        print("out stage 1:", node.result)
        my_producer.send(node.nextTopic, value=node.result)


