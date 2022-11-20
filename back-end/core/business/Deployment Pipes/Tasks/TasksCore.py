import os
import random
import time
import subprocess
# utils
def createFile(fileName,content):
    fp = open(fileName, 'w')
    fp.write(content)
    fp.close()
dockerFileTemplate = """
# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
"""
requirementsTemplate = """
flask==2.0.1
Flask-APScheduler===1.12.4
"""
def Stage_1_Task(packetSource):
    #decorate front-end code
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_1'

    localPacket['payload']['code'] += "\n#decorate code ->>>\n"
    return localPacket


def Stage_2_Task(packetSource):
    #create docker file
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_2'

    print("Start createDockerFile")
    cwd = os.getcwd()
    print("cwd:", cwd)
    buildName = str(random.randint(1000, 9999))
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

    time.sleep(2)

    print("\nstage 2 localPacket")
    print(localPacket)
    return localPacket

def Stage_3_Task(packetSource):
    # build docker image
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_3'
    buildName = localPacket['payload']['buildName']
    dockerPath = localPacket['payload']['dockerPath']

    print("Stage 3 payload:",localPacket)
    print("final docker command:",["docker","build", "--tag",f"{buildName}", dockerPath])
    test = subprocess.Popen(["docker","build", "--tag",f"{buildName}", dockerPath], stdout=subprocess.PIPE)
    output = test.communicate()[0]
    print("out:", output)
    time.sleep(2)
    return localPacket

def Stage_4_Task(packetSource):
    #create docker container
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_4'
    buildName = localPacket['payload']['buildName']

    imageRunOutput = subprocess.Popen(["docker", "run", buildName], stdout=subprocess.PIPE)
    output = imageRunOutput.communicate()[0]
    print("output images:", output)
    time.sleep(2)

    return localPacket

tasksCore = {
    'stage_1': Stage_1_Task,
    'stage_2': Stage_2_Task,
    'stage_3': Stage_3_Task,
    'stage_4': Stage_4_Task
}