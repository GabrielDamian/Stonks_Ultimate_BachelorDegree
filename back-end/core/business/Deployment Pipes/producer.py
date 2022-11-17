from time import sleep
from json import dumps
from kafka import KafkaProducer

if __name__ == '__main__':
    my_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )

    for n in range(500):
        print("new")
        my_data = {'num' : n}
        my_producer.send('testnum', value = my_data)
        sleep(5)
