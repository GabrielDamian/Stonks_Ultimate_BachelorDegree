import threading
import time
import os 
import subprocess

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


class Deployment:

    def __init__(self, nodeName,code):
        print("init:", nodeName,code)
        self.name = nodeName
        self.code = code

        time.sleep(2)

    def createDockerFile(self):
        print("Start createDockerFile")
        cwd = os.getcwd()
        print("cwd:",cwd)

        newPath = cwd + "/images/" + self.name
        print("newPath:",newPath)

        print("creating folder for dockerfile")
        if not os.path.exists(newPath):
            os.makedirs(newPath)
        
        # Create index.py 
        createFile(newPath + "/"+"app.py", self.code)
        
        # Create requirements.txt
        createFile(newPath + "/"+"dockerfile", dockerFileTemplate)
        
        # Create dockerfile
        createFile(newPath + "/"+"requirements.txt", requirementsTemplate)

        self.dockerFilePath = newPath
        time.sleep(2)
       
    def createDockerImage(self):
        
        print("final docker command:",["docker","build", "--tag",f"{self.name}", self.dockerFilePath])
        test = subprocess.Popen(["docker","build", "--tag",f"{self.name}", self.dockerFilePath], stdout=subprocess.PIPE)
        output = test.communicate()[0]
        print("out:", output)
        time.sleep(2)

    def createDockerContainer(self):
        imageRunOutput = subprocess.Popen(["docker", "run", self.name], stdout=subprocess.PIPE)
        output = imageRunOutput.communicate()[0]
        print("output images:", output)
        time.sleep(2)

def deployNode(nodeName, code):
   
    master = Deployment(nodeName, code)
    master.createDockerFile()
    master.createDockerImage()
    master.createDockerContainer()