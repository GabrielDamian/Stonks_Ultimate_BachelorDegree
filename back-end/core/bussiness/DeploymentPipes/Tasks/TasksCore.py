import json
import os
import random
import shlex
import time
import subprocess
import json
import requests

# utils
def createFile(fileName, content):
    fp = open(fileName, 'w')
    fp.write(content)
    fp.close()

dockerFileTemplate = """
# syntax=docker/dockerfile:1

FROM python:3.10-alpine

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "./app.py"]
"""
requirementsTemplate = """
Flask==2.1.2
Flask-SocketIO==5.2.0
Flask-Cors==3.0.10
eventlet==0.33.1
gevent
"""


def Stage_1_Task(packetSource):
    # decorate front-end code
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_1'

    localPacket['payload']['code'] += "\n#decorate code_"+ localPacket['payload']['id'] +" ->>>\n"
    return localPacket


def Stage_2_Task(packetSource):
    # create docker file
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_2'

    print("Start createDockerFile")
    cwd = os.getcwd()
    print("cwd:", cwd)
    buildName = packetSource['payload']['id']
    newPath = cwd + "/images/" + buildName
    print("newPath:", newPath)

    print("creating folder for dockerfile")
    if not os.path.exists(newPath):
        os.makedirs(newPath)

    # Create index.py
    createFile(newPath + "/" + "app.py", localPacket['payload']['code'])

    # Create requirements.txt
    createFile(newPath + "/" + "dockerfile", dockerFileTemplate)

    # Create dockerfile
    createFile(newPath + "/" + "requirements.txt", requirementsTemplate)
    localPacket['payload']['dockerPath'] = newPath
    localPacket['payload']['buildName'] = buildName


    print("\nstage 2 localPacket")
    print(localPacket)
    return localPacket


def Stage_3_Task(packetSource):
    # create container based on prev stage image
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_3'
    buildName = localPacket['payload']['buildName']
    dockerPath = localPacket['payload']['dockerPath']

    print("Stage 3 payload:", localPacket)
    print("final docker command:", ["docker", "build", "--no-cache", "--tag", f"{buildName}", dockerPath])
    test = subprocess.Popen(["docker", "build", "--tag", f"{buildName}", dockerPath], stdout=subprocess.PIPE)
    output = test.communicate()[0]
    print("out:", output)
    print("\n\n\nReturn from task 3")
    return localPacket


def Stage_4_Task(packetSource):
    print("Stage 4:")
    # create docker container
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_4'
    buildName = localPacket['payload']['buildName']

    imageRunOutput = subprocess.Popen(["docker", "run", "-d",buildName], stdout=subprocess.PIPE)

    output = imageRunOutput.communicate()[0]
    decodedOutput = output.decode().rstrip() #remove '\n'
    imageInspect = subprocess.Popen(["docker", "inspect", decodedOutput], stdout=subprocess.PIPE)
    imageInspectOut = imageInspect.communicate()[0]
    objParsed = json.loads(imageInspectOut.decode())

    containerId = objParsed[0]['Config']['Hostname']
    localPacket['payload']['containerId'] = containerId

    # start container
    startContainer = subprocess.Popen(["docker", "start", containerId], stdout=subprocess.PIPE)
    resultStartContainer = startContainer.communicate()[0]
    print("Result start container:",resultStartContainer)


    # Persis node info
    # url = 'http://localhost:3005/populate-node'
    #docId, code, imageId, containerId
    # docId_persist = localPacket['payload']['buildName']
    # code_persist = localPacket['payload']['code']
    # imageId_persist = localPacket['payload']['id']
    # containerId_persist = localPacket['payload']['containerId']

    # bodyPersistNode = {
    #     'docId': docId_persist,
    #     'code': code_persist,
    #     'imageId': imageId_persist,
    #     'containerId': containerId_persist
    # }

    # response = requests.post(url, json=bodyPersistNode)
    # decodedResponse = response.content.decode()
    # print("decodedResp:", decodedResponse)  

    return localPacket

def Stage_5_Task(packetSource):
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_5'


    docId_persist = localPacket['payload']['buildName']
    code_persist = localPacket['payload']['code']
    imageId_persist = localPacket['payload']['id']
    containerId_persist = localPacket['payload']['containerId']

    bodyPersistNode = {
        'docId': docId_persist,
        'code': code_persist,
        'imageId': imageId_persist,
        'containerId': containerId_persist
    }

    url = 'http://localhost:3005/populate-node'
    response = requests.post(url, json=bodyPersistNode)
    decodedResponse = response.content.decode()
    print("decodedResp:", decodedResponse)  
    
    return localPacket


tasksCore = {
    'stage_1': Stage_1_Task,
    'stage_2': Stage_2_Task,
    'stage_3': Stage_3_Task,
    'stage_4': Stage_4_Task,
    'stage_5': Stage_5_Task
}