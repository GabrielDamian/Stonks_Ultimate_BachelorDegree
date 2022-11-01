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
    return 'Deployment Presentation is alive!'


@app.route('/node-deployment-endpoint',methods = ['POST'])
def deployCode():
    data = request.get_json()
    print("datA:",data)

    
    return "OK deloyment presentation"



if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=81, debug=True)


