from flask import Flask
from flask import request
import os 

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

def runImage():
    pass

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







@app.route('/deploy-code',methods = ['POST'])
def deployCode():
    data = request.get_json()
    print("datA:",data)

    code = data.get('code')
    name = data.get('name')


    createDockerFile(code,name)


    return "OK"



if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=81)


