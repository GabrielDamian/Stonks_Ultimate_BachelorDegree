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

FROM tensorflow/tensorflow

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
numpy==1.24.0
pandas==1.5.2
pandas-datareader==0.9.0
tensorflow==2.11.0
scikit-learn==1.2.0
yfinance
"""


code_template_replace_layers = '<< Replace_code_layers >>'
code_template_replace_company = '<< Replace_code_company >>'
code_template_node_id = '<< Replace_node_id >>'

code_template_node = """
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
import time
import eventlet
import numpy as np
from os.path import exists
import pandas as pd
# import pandas_datareader as web
import datetime
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM
from keras.models import load_model
from pandas_datareader import data as pdr
import requests
import yfinance as yfin

yfin.pdr_override()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.url_map.strict_slashes = False
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

node_id = '""" + code_template_node_id + """'\n

class NodeModelHandler:
    modelControllerPath = './saved_model/my_model/modelControler.txt'
    modelPath = './saved_model/my_model'

    def __init__(self):
        pass

    def checkLocalModel(self):
        print("--> Check Local model")
        existence = exists(self.modelControllerPath)
        # TODO: check on file content (status 1 or 0)
        return existence

    def createModel(self):

        # create and init train model with x years data
        print("Action: ->>> create model")

        company = '""" + code_template_replace_company + """'\n

        # start = dt.datetime(2012, 1, 1)
        # end = dt.datetime(2020, 1, 1)

        data = pdr.get_data_yahoo(company, start="2018-10-10", end="2020-10-10")
        # data = pdr.DataReader(company, 'yahoo', start, end)
        # data = pdr.get_data_yahoo("IBM", start="2018-10-10", end="2020-10-10")

        # ----->Prepare data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column

        prediction_days = 60

        x_train = []
        y_train = []

        for x in range(prediction_days, len(scaled_data)):
            x_train.append(scaled_data[x - prediction_days:x, 0])
            y_train.append(scaled_data[x, 0])

        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

        # model = Sequential()
        # model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  # units = neurons
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=50, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=50))
        # model.add(Dropout(0.2))
        # model.add(Dense(units=1))

        \n""" + code_template_replace_layers + """\n

        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(x_train, y_train, epochs=25, batch_size=32)
        # save the new created model
        model.save(self.modelPath)

        # attach controller
        f = open(self.modelControllerPath, "x")
        f.write('1')
        f.close()

        print("---> Model created and saved succesfully")
        return model

    def loadModel(self):
        print("Load model from local files")
        model = load_model(self.modelPath)
        print("-->check model arhitecture")
        model.summary()

        print("Model loaded succesfully")
        return model

    def initializeModel(self):
        # load or create a new model
        modelExists = self.checkLocalModel()
        initializedModel = None

        if modelExists == True:
            print("Model exists")
            initializedModel = self.loadModel()
        else:
            print("No existing model, create a new one")
            initializedModel = self.createModel()

        return initializedModel

    def predictNextDay(self, modelParam):
        company = "IBM"
        data = pdr.get_data_yahoo(company, start="2018-10-10", end="2020-10-10")

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column
        prediction_days = 60

        test_data = pdr.get_data_yahoo("TSLA", start="2020-10-10", end="2021-10-10")
        actual_prices = test_data['Close'].values

        total_dataset = pd.concat((data['Close'], test_data['Close']), axis=0)

        model_inputs = total_dataset[len(total_dataset) - len(test_data) - prediction_days:].values
        model_inputs = model_inputs.reshape(-1, 1)
        model_inputs = scaler.transform(model_inputs)

        x_test = []

        for x in range(prediction_days, len(model_inputs)):
            x_test.append(model_inputs[x - prediction_days:x, 0])

        x_test = np.array((x_test))
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

        predicted_prices = modelParam.predict(x_test)
        predicted_prices = scaler.inverse_transform(predicted_prices)

        # plt.plot(actual_prices, color="black", label=f"Actual {company} Price")
        # plt.plot(predicted_prices, color="green", label=f"Predicted {company} Price")
        # plt.title(f"{company} Share Price")
        # plt.xlabel('Time')
        # plt.ylabel(f'{company} Share Price')
        # plt.legend()
        # plt.show()

        # Predict next day
        real_data = [model_inputs[len(model_inputs) + 1 - prediction_days:len(model_inputs + 1), 0]]
        real_data = np.array(real_data)
        real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))

        prediction = modelParam.predict(real_data)
        prediction = scaler.inverse_transform(prediction)
        # print(f"Prediction: {prediction}")
        return prediction


class NodeCore:

    def __init__(self, logManagerOperator, nodeManagerLock) -> None:
        self.logManagerOperator = logManagerOperator
        self.nodeManagerLock = nodeManagerLock
        pass

    # initTasks is runned once when the container starts
    def initTasks(self):
        print("-----> init Tasks")
        self.nodeModelHandler = NodeModelHandler()
        model = self.nodeModelHandler.initializeModel()
        self.model = model

    # below functions run in setIntervals, managed by .run()
    def predictTomorrow(self):

        print("fetch market data recurent")
        tomorrowPrice = self.nodeModelHandler.predictNextDay(self.model)
        print("tomorrowPrice:",tomorrowPrice)

        self.apiPersistPrediction(str(tomorrowPrice[0][0]))

        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('tomorrow price:' + str(tomorrowPrice[0][0]))
        self.nodeManagerLock.release()

        # TODO: check is model != None (initialized properly)

    def apiPersistPrediction(self, valueToPersist):
        url = 'http://172.17.0.1:3006/push-node-stats'
        myobj = {
            'node_id': node_id,
            'new_prediction': valueToPersist
        }
        x = requests.post(url, json=myobj)


    def run(self):
        self.predictTomorrow()


class LogManager():
    logs = []
    lastConsumed = 0

    def __init__(self) -> None:
        pass

    def createLog(self, content):
        e = datetime.datetime.now()

        separator = "__//__"
        finalContent = str(e) + separator + content

        self.logs.append(finalContent)

    def consumeLogs(self):
        print("consume logs:")
        print("last consumed:", self.lastConsumed)
        print("logs:", self.logs)

        # from last consumed to the end of logs
        # update last consumed to the last existing inted

        lastConsumedCopy = self.lastConsumed
        self.lastConsumed = len(self.logs)
        print("update last consumed:", self.lastConsumed)

        return self.logs[lastConsumedCopy:]


# GLOBALS
lock = threading.Lock()
increment = 0
connected_users = {}

nodeCoreInterval = 86400
logsEmitInterval = 1
logsLock = threading.Lock()

logManager = LogManager()
nodeCore = NodeCore(logManager, logsLock)
nodeCore.initTasks()


class Worker(object):
    max = 10
    unit_of_work = 0

    def __init__(self, ):
        pass

    def do_work(self):

        while len(connected_users.keys()) > 0:
            logsLock.acquire()
            currentLogsCopy = logManager.consumeLogs()
            logsLock.release()

            if len(currentLogsCopy) > 0:
                lock.acquire()
                for key in connected_users:
                    connected_users[key].emit("connect", currentLogsCopy)
                    break
                lock.release()
            else:
                print("No fresh logs, ignore socket push this time")

            eventlet.sleep(logsEmitInterval)

@socketio.on("connect")
def connected():
    connected_users_len = connected_users.keys()
    if len(connected_users_len) == 0:

        lock.acquire()
        connected_users[request.sid] = socketio
        lock.release()

        global worker
        worker = Worker()
        socketio.start_background_task(target=worker.do_work)
    else:
        lock.acquire()
        connected_users[request.sid] = socketio
        lock.release()

    emit("connect", "test payload")


# @socketio.on('data')
# def handle_message(data):
#     global increment
#     lock.acquire()
#     print("DATA:", increment)
#     lock.release()
#     print("data from the front end: ", str(data))
#     emit("data", {'data': increment, 'id': request.sid}, broadcast=True)


@socketio.on("disconnect")
def disconnected():
    print("user disconnected:", request.sid)

    lock.acquire()
    del connected_users[request.sid]
    lock.release()

    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)


@app.route('/')
def index():
    print("test ////")
    return 'Web App with Python Flask!'


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()

    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


def NodeAppRun():
    # global increment
    # lock.acquire()
    # increment += 1
    # print("new increment:", increment)
    # lock.release()
    print("---> Node app new run")
    nodeCore.run()

def nodeHeartBeat():
    print("heart beat")
    logManager.createLog('__Alive__')

if __name__ == '__main__':
    set_interval(NodeAppRun, nodeCoreInterval)
    set_interval(nodeHeartBeat, 1)

    socketio.run(app, debug=False, port=5000, host='0.0.0.0')
"""


def Stage_1_Task(packetSource):

    global code_template_node

    try:
        print("paket source init:",packetSource)

        marketPayload = packetSource['payload']['market']
        print("Extracted market:", marketPayload)
        
        # decorate front-end code
        localPacket = packetSource.copy()
        localPacket['history'] = localPacket['history'] + "_" + 'stage_1'

        frontEndCode = localPacket['payload']['code']
        nodeId = localPacket['payload']['id']

        print("node id extracted:", nodeId)

        print("Extract market:", packetSource['payload'])
        print("Front end code:", frontEndCode)

        #replace company symbol
        # extractedCompany = '"IBM"'
        code_template_code_copy = code_template_node[:] #make a copy
        print("copy here:",code_template_code_copy)

        print("find test company:",code_template_code_copy.find(code_template_replace_company))

        #Populate node_id
        #TO DO: extract from payload
        # fake_node_id = "63af35ba73282a4138d7f44e"
        code_template_code_copy = code_template_code_copy.replace(code_template_node_id, nodeId)

        #Populate market
        code_template_code_copy = code_template_code_copy.replace(code_template_replace_company, marketPayload)
        
        #Populate tensor flow layers
        code_template_code_copy = code_template_code_copy.replace(code_template_replace_layers, frontEndCode)

        code_template_code_copy +=  "\n#decorate code_"+ localPacket['payload']['id'] +" ->>>\n"
        # localPacket['payload']['code'] += "\n#decorate code_"+ localPacket['payload']['id'] +" ->>>\n"
        localPacket['payload']['code'] = code_template_code_copy

        print("final code:", code_template_code_copy)
        return localPacket

    except Exception as bomb:
        print("An exception occurred:", bomb) 


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
    # print("final docker command:", ["docker", "build", "--no-cache", "--tag", f"{buildName}", dockerPath])
    # !!!!!! NO CACHE IS A MUST !!!!!!!!
    # test = subprocess.Popen(["docker", "build", "--no-cache", "--tag", f"{buildName}", dockerPath], stdout=subprocess.PIPE)
    test = subprocess.Popen(["docker", "build", "--tag", f"{buildName}", dockerPath], stdout=subprocess.PIPE)
    output = test.communicate()[0]
    print("out:", output)
    print("\n\n\nReturn from task 3")
    return localPacket


def Stage_4_Task(packetSource):
    try:
        print("Stage 4:")
        # create docker container
        localPacket = packetSource.copy()
        localPacket['history'] = localPacket['history'] + "_" + 'stage_4'
        buildName = localPacket['payload']['buildName']

        # imageRunOutput = subprocess.Popen(["docker", "run", "-d",'--network=host',buildName], stdout=subprocess.PIPE)
        imageRunOutput = subprocess.Popen(["docker", "run", "-d",buildName], stdout=subprocess.PIPE)
        print("imageRunOutput:",imageRunOutput)

        output = imageRunOutput.communicate()[0]
        print("output:",output)

        decodedOutput = output.decode().rstrip() #remove '\n'
        print("decodedOutput:",decodedOutput)

        imageInspect = subprocess.Popen(["docker", "inspect", decodedOutput], stdout=subprocess.PIPE)
        imageInspectOut = imageInspect.communicate()[0]
        objParsed = json.loads(imageInspectOut.decode())
        print("obj parsed:",objParsed)

        containerId = objParsed[0]['Config']['Hostname']
        localPacket['payload']['containerId'] = containerId

        # start container
        startContainer = subprocess.Popen(["docker", "start", containerId], stdout=subprocess.PIPE)
        resultStartContainer = startContainer.communicate()[0]
        print("Result start container:",resultStartContainer)

        return localPacket

    except Exception as bomb:
        
        print("An exception occurred in stage 4:", bomb) 


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