from flask import Flask
from flask import request
import os 
import subprocess
from deployArea import *

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.after_request
def set_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

@app.route('/')
def index():
    return 'Docker Master is alive!'


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

def createFile(fileName,content):
    fp = open(fileName, 'w')
    fp.write(content)
    fp.close()

def createImageContaiener():
    pass

def runImage(nodeName):
    imageRunOutput = subprocess.Popen(["docker", "run", nodeName], stdout=subprocess.PIPE)
    output = imageRunOutput.communicate()[0]
    print("output images:", output)

def createDockerFile(code,name):
    print("Start createDockerFile")
    cwd = os.getcwd()
    print("cwd:",cwd)

    newPath = cwd + "/images/" + name
    print("newPath:",newPath)

    print("creating folder for dockerfile")
    if not os.path.exists(newPath):
        os.makedirs(newPath)
    
    # Create index.py 
    createFile(newPath + "/"+"app.py", code)
    
    # Create requirements.txt
    createFile(newPath + "/"+"dockerfile", dockerFileTemplate)
    
    # Create dockerfile
    createFile(newPath + "/"+"requirements.txt", requirementsTemplate)

    return newPath

def createDockerImage(dockerFilePath, nodeName):
    print("create docker image from:", dockerFilePath)
    print("node name:", nodeName)
    print("final docker command:",["docker","build", "--tag",f"{nodeName}", dockerFilePath])
    test = subprocess.Popen(["docker","build", "--tag",f"{nodeName}", dockerFilePath], stdout=subprocess.PIPE)
    output = test.communicate()[0]
    print("out:", output)


@app.route('/deploy-code',methods = ['POST'])
def deployCode():
    data = request.get_json()
    print("datA:",data)

    codeRaw = data.get('code')
    name = data.get('name')

    # #add unique code 
    code = f"#Code node ${name}\n\n" + codeRaw

    th = threading.Thread(target=deployNode, args=(name, code))
    th.start()

    # dockerFilePath = createDockerFile(code,name)
    # createDockerImage(dockerFilePath,name)
    # runImage(name)
    
    return "OK"



if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=81, debug=True)


