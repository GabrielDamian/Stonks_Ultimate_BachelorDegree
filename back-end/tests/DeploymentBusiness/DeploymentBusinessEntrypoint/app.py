from flask import Flask
from flask import request
import os 
import subprocess
from mq_communication import RabbitMq

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
rabbitQueue = RabbitMq()

@app.after_request
def set_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

@app.route('/')
def index():
    return 'Deployment Entry Point!'

@app.route('/deploy-code',methods = ['POST'])
def deployCode():
    data = request.get_json()

    # TODO: check and update user balance
    
    testContact = "data~data~data"
    rabbitQueue.send_message(testContact)
    responseRabbit = rabbitQueue.receive_message()
    if(responseRabbit == 'pipeline started'):
        return "Pipeline Starded OK"
    else:
        return "Error while starting pipeline"


if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=81, debug=True)

