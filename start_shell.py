import subprocess
import time

def startZookeper():
    subprocess.Popen(["bash", "./Scripts/start_zookeper.sh"], stdout=subprocess.PIPE,)
    zookeperStarted = False
    expectedOutString = "imok"
    maxTryings = 30
    currentTrying = 0

    while not zookeperStarted and  currentTrying < maxTryings:
        currentTrying +=1
        time.sleep(0.1)
        p = subprocess.Popen(["bash", "./Scripts/check_zookeper.sh"], stdout=subprocess.PIPE)
        returnString = ""
        for line in p.stdout:
            returnString = line.decode()
        p.wait()
        
        if returnString[:-1] == expectedOutString:
            print("Zookeeper started")
            break

def startKafka():
    subprocess.Popen(["bash", "./Scripts/start_kafka.sh"], stdout=subprocess.PIPE)
    kafkaStarted = False
    expectedOutString = "/brokers/ids/0"
    maxTryings = 30
    currentTrying = 0

    while not kafkaStarted and  currentTrying < maxTryings:
        currentTrying +=1
        time.sleep(0.1)
        p = subprocess.Popen(["bash", "./Scripts/check_kafka.sh"], stdout=subprocess.PIPE)
        returnString = ""
        for line in p.stdout:
            returnString = line.decode()
        p.wait()
        
        if returnString[:-1] == expectedOutString:
            print("Kafka Started")
            break

def main():
    startZookeper()
    startKafka()
    return 0
    
main()