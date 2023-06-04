import json
import os
import random
import shlex
import time
import subprocess
import json
import requests
from datetime import datetime
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
dnspython==2.2.1
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
import eventlet
import numpy as np
from os.path import exists
import pandas as pd
import datetime
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, MultiHeadAttention, LayerNormalization, Conv1D, MaxPooling1D, Bidirectional, GRU
from keras.models import load_model
from pandas_datareader import data as pdr
import requests
import math
import yfinance as yfin
#--->> DevMode Only
#import matplotlib.pyplot as plt
yfin.pdr_override()
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.url_map.strict_slashes = False
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

node_id = '""" + code_template_node_id + """'\n


def calculate_mae(actual_prices, predicted_prices):
    n = len(actual_prices)
    error = 0
    for i in range(n):
        error += abs(actual_prices[i] - predicted_prices[i])
    mae = error / n
    return mae

def calculate_mse(actual_prices, predicted_prices):
    n = len(actual_prices)
    error = 0
    for i in range(n):
        error += (actual_prices[i] - predicted_prices[i]) ** 2
    mse = error / n
    return mse

def calculate_rmse(actual_prices, predicted_prices):
    n = len(actual_prices)
    error = 0
    for i in range(n):
        error += (actual_prices[i] - predicted_prices[i]) ** 2
    mse = error / n
    rmse = math.sqrt(mse)
    return rmse

def failedSignal(docId, status):

    print("Failed signal:")
    print(docId)
    print(status)

    now = datetime.datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H-%M-%S")

    url = 'http://localhost:3005/populate-node'
    bodyPersistNode = {
        'docId': docId,
        'status': status + ', Date: ' + dt_string
    }

    response = requests.post(url, json=bodyPersistNode)
    decodedResponse = response.content.decode()
    print("decodedResponse failed signal:", decodedResponse)

class NodeModelHandler:
    modelControllerPath = './saved_model/my_model/modelControler.txt'
    modelPath = './saved_model/my_model'
    def __init__(self):
        pass
    def checkLocalModel(self):
        print("--> Check Local model")
        existence = exists(self.modelControllerPath)
        return existence
    def createModel(self):
        print("Action: ->>> create model")

        #--->> Dev Mode
        # company = 'IBM'
        company = '""" + code_template_replace_company + """'\n

        #--->> Dev Mode
        # data = pdr.get_data_yahoo(company, start="2019-10-10", end="2021-10-10")
        data = pdr.get_data_yahoo(
            company, start="2015-10-10", end="2021-10-10")

        # scale all data between [0,1]
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(
            data['Close'].values.reshape(-1, 1))  # keep only 'close' column

        # how many days we look into the past to predict the next day
        prediction_days = 60
        # training data
        x_train = []
        y_train = []
        for x in range(prediction_days, len(scaled_data)):
            x_train.append(scaled_data[x - prediction_days:x, 0])
            y_train.append(scaled_data[x, 0])
        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

        # --->> Dev Mode
        # model = Sequential()
        # model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  # units = neurons
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=50, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=50))
        # model.add(Dropout(0.2))
        # model.add(Dense(units=1))

        #___ModelSeparatorStart___

        model = Sequential()
        \n""" + code_template_replace_layers + """\n
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(x_train, y_train, epochs=25, batch_size=32)


        #___ModelSeparatorEnd___

        # save the new created model
        model.save(self.modelPath)

        # attach controller
        f = open(self.modelControllerPath, "x")
        f.write('1')
        f.close()
        print("---> Model created and saved succesfully")
        self.collectStats(model)
        return model

    def loadModel(self):
        print("Action: ->>> load model from local files")
        model = load_model(self.modelPath)
        model.summary()
        return model

    def initializeModel(self):
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
        # --->> Dev Mode
        # company = "IBM"
        # company = 'AAPL'

        company = '""" + code_template_replace_company + """'\n

        prediction_days = 60
        test_start = datetime.datetime(2015, 1, 1)
        test_end = datetime.datetime.now()
        data = pdr.get_data_yahoo(company, start=test_start, end=test_end)
        scaler = MinMaxScaler(feature_range=(0, 1))
        # keep only 'close' column
        scaler.fit_transform(data['Close'].values.reshape(-1, 1))
        model_inputs = data['Close'].values
        model_inputs = model_inputs.reshape(-1, 1)
        model_inputs = scaler.transform(model_inputs)

        x_test = []
        for x in range(prediction_days, len(model_inputs)):
            x_test.append(model_inputs[x - prediction_days:x, 0])
        x_test = np.array((x_test))
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

        predicted_prices = modelParam.predict(x_test)
        print("predicted_prices:",predicted_prices)
        simpleFormat = True
        # True - case 1 (first model)
        # False - case 2 (rest of the model)

        try:
            testFormat = predicted_prices[0][0][0]
            # if the item x[0][0][0] exits => there is no simple format
            simpleFormat = False
        except:
            print("Simple format case")

        if simpleFormat:
            print("case 1")
            predicted_prices = scaler.inverse_transform(predicted_prices)
        else:
            print("case 2")
            predicted_prices = [[a[0][-1]] for a in predicted_prices]
            predicted_prices = scaler.inverse_transform(predicted_prices)
        offsetItem = [0] * prediction_days
        predictedWithOffset = offsetItem + [a[0] for a in predicted_prices]
        real_data_final = data['Close'].values

        for a in range(prediction_days):
            real_data_final = real_data_final[1:]
            predictedWithOffset = predictedWithOffset[1:]
        # plt.plot(real_data_final, color="black")
        # plt.plot(predictedWithOffset,color="red")
        # plt.show()
        tommorow_price = predictedWithOffset[len(predictedWithOffset) - 1]
        print("TM price:",tommorow_price)
        return [[tommorow_price]]

    def persistInitialStats(self, mae_test, mse_test, rmse_test):
        url = 'http://172.17.0.1:3006/push-node-training'
        myobj = {
            'node_id': node_id,
            'mae_test': mae_test,
            'mse_test': mse_test,
            'rmse_test': rmse_test
        }
        x = requests.post(url, json=myobj)

    def collectStats(self, modelParam):
        company = '""" + code_template_replace_company + """'\n
        # company = "IBM"
        prediction_days = 60
        test_start = datetime.datetime(2015, 1, 1)
        test_end = datetime.datetime(2022, 1, 1)
        data = pdr.get_data_yahoo(company, start=test_start, end=test_end)

        # data = pdr.get_data_yahoo(company, start="2015-10-10", end="2020-10-10")
        print("DATA LEN:",len(data))
        scaler = MinMaxScaler(feature_range=(0, 1))
        # keep only 'close' column
        scaler.fit_transform(data['Close'].values.reshape(-1, 1))

        model_inputs = data['Close'].values
        model_inputs = model_inputs.reshape(-1, 1)
        model_inputs = scaler.transform(model_inputs)

        x_test = []
        for x in range(prediction_days, len(model_inputs)):
            x_test.append(model_inputs[x - prediction_days:x, 0])
        x_test = np.array((x_test))
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

        predicted_prices = modelParam.predict(x_test)
        simpleFormat = True

        try:
            testFormat = predicted_prices[0][0][0]
            simpleFormat = False
        except:
            print("Simple format case")
        if simpleFormat:
            print("case 1")
            predicted_prices = scaler.inverse_transform(predicted_prices)
        else:
            print("case 2")
            predicted_prices = [[a[0][-1]] for a in predicted_prices]
            predicted_prices = scaler.inverse_transform(predicted_prices)

        offsetItem = [0] * prediction_days
        predictedWithOffset = offsetItem + [a[0] for a in predicted_prices]

        real_data_final = data['Close'].values
        for a in range(prediction_days):
            real_data_final = real_data_final[1:]
            predictedWithOffset = predictedWithOffset[1:]

        total_dif = 0
        differences = []
        
        print("lens:", len(real_data_final), len(predictedWithOffset))
        
        mae_test = calculate_mae(real_data_final, predictedWithOffset)
        mse_test = calculate_mse(real_data_final, predictedWithOffset)
        rmse_test = calculate_rmse(real_data_final, predictedWithOffset)
        
        print("mae:",mae_test)
        print("mse:",mse_test)
        print("rmse:",rmse_test)

        for index, a in enumerate(real_data_final):
            print("/n elements:", a, predictedWithOffset[index])    
            dif = a - predictedWithOffset[index]
            differences.append(dif)
            total_dif = total_dif + abs(dif)

        average_dif_per_day = total_dif / len(real_data_final)
        print("average_dif_per_day:",average_dif_per_day)

        def createBarCharStats(sourceArr):
            ranges = []
            lastValue = -10
            for a in range(-9,11,1):
                objItem = {
                    'min': lastValue,
                    'max': a,
                    'items': []
                }
                ranges.append(objItem)
                lastValue = a
            for a in sourceArr:
                for index_b,b in enumerate(ranges):
                    if a > b['min'] and a < b['max']:
                        ranges[index_b]['items'].append(a)
            barChartY = []
            barChartX = []
            for a in ranges:
                barChartY.append(str(a['min'])+ " "+ str(a['max']))
                barChartX.append(len(a['items']))
            return barChartY,barChartX

        barchartValues = createBarCharStats(differences)
        self.persistInitialStats(mae_test, mse_test, rmse_test)

        return barchartValues

class NodeCore:
    def __init__(self, logManagerOperator, nodeManagerLock) -> None:
        self.logManagerOperator = logManagerOperator
        self.nodeManagerLock = nodeManagerLock
        pass


    def initTasks(self):
        # initTasks is runned once when the container starts
        self.nodeModelHandler = NodeModelHandler()
        model = self.nodeModelHandler.initializeModel()
        self.model = model

    # below functions run in setIntervals, managed by .run()
    def predictTomorrow(self):
        tomorrowPrice = self.nodeModelHandler.predictNextDay(self.model)
        self.apiPersistPrediction(str(tomorrowPrice[0][0]))
        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog(
            '__tomorrow-price__:' + str(tomorrowPrice[0][0]))
        self.nodeManagerLock.release()

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
        lastConsumedCopy = self.lastConsumed
        self.lastConsumed = len(self.logs)
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

#nodeCore.initTasks()

try:
    nodeCore.initTasks()
except Exception as e:
    print("Exception, can't create prediction")
    failedSignal(node_id, 'Status: Crash, Message: Can t ini tasks')

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

# def NodeAppRun():
#     print("Create new prediction")
#     nodeCore.run()

def NodeAppRun():
    print("Create new prediction")
    try:
        nodeCore.run()
    except Exception as e:
        print("Exception, can't create prediction")
        failedSignal(
            node_id, 'Status: Crash, Message: Can t create prediction')
    # nodeCore.run()

def nodeHeartBeat():
    print("Node Heart Beat")
    logManager.createLog('__Alive__')




if __name__ == '__main__':
    NodeAppRun()
    set_interval(NodeAppRun, 43200)
    #set_interval(NodeAppRun, 10)
    # set_interval(NodeAppRun, nodeCoreInterval)
    set_interval(nodeHeartBeat, 1)
    socketio.run(app, debug=False, port=5000, host='0.0.0.0')
"""


def failedSignal(docId, status):

    print("Failed signal:")
    print(docId)
    print(status)

    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H-%M-%S")

    url = 'http://localhost:3005/populate-node'
    bodyPersistNode = {
        'docId': docId,
        'status': 'Status: Failure, Message: ' + status + ', Date: ' + dt_string
    }

    response = requests.post(url, json=bodyPersistNode)
    decodedResponse = response.content.decode()
    print("decodedResponse failed signal:", decodedResponse)


def Stage_1_Task(packetSource):
    try:
        # DEV MODE ONLY
        # randomError = random.choice([True, False])
        # if randomError == True:
        #     raise Exception("Fake error stage 1")
        # END DEV MODE
        # raise Exception("Fake error stage 1")

        global code_template_node

        print("paket source init:", packetSource)

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

        # replace company symbol
        # extractedCompany = '"IBM"'
        code_template_code_copy = code_template_node[:]  # make a copy
        print("copy here:", code_template_code_copy)

        print("find test company:", code_template_code_copy.find(
            code_template_replace_company))

        # Populate node_id
        # TO DO: extract from payload
        # fake_node_id = "63af35ba73282a4138d7f44e"
        code_template_code_copy = code_template_code_copy.replace(
            code_template_node_id, nodeId)

        # Populate market
        code_template_code_copy = code_template_code_copy.replace(
            code_template_replace_company, marketPayload)

        # Populate tensor flow layers
        code_template_code_copy = code_template_code_copy.replace(
            code_template_replace_layers, frontEndCode)

        code_template_code_copy += "\n#decorate code_" + \
            localPacket['payload']['id'] + " ->>>\n"
        # localPacket['payload']['code'] += "\n#decorate code_"+ localPacket['payload']['id'] +" ->>>\n"
        localPacket['payload']['code'] = code_template_code_copy

        print("final code:", code_template_code_copy)
        return localPacket

    except Exception as e:
        print("Exception in Stage 1:", e)

        buildIdToFail = packetSource['payload']['id']
        failedSignal(
            buildIdToFail, "Can't create app template")
        return None


def Stage_2_Task(packetSource):
    try:

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

    except Exception as e:
        print("Exception in Stage 2:", e)
        buildIdToFail = packetSource['payload']['id']
        failedSignal(
            buildIdToFail, "Can't create docker files")
        return None


def Stage_3_Task(packetSource):

    try:
        # create container based on prev stage image
        localPacket = packetSource.copy()
        localPacket['history'] = localPacket['history'] + "_" + 'stage_3'
        buildName = localPacket['payload']['buildName']
        dockerPath = localPacket['payload']['dockerPath']

        print("Stage 3 payload:", localPacket)
        # print("final docker command:", ["docker", "build", "--no-cache", "--tag", f"{buildName}", dockerPath])
        # !!!!!! NO CACHE IS A MUST !!!!!!!!
        # test = subprocess.Popen(["docker", "build", "--no-cache", "--tag", f"{buildName}", dockerPath], stdout=subprocess.PIPE)
        test = subprocess.Popen(
            ["docker", "build", "--tag", f"{buildName}", dockerPath], stdout=subprocess.PIPE)
        output = test.communicate()[0]
        print("out:", output)
        print("\n\n\nReturn from task 3")
        return localPacket

    except Exception as e:
        print("Exception in Stage 3:", e)
        buildIdToFail = packetSource['payload']['id']
        failedSignal(
            buildIdToFail, "Can't create a docker container")
        return None


def Stage_4_Task(packetSource):
    try:
        print("Stage 4:")
        # create docker container
        localPacket = packetSource.copy()
        localPacket['history'] = localPacket['history'] + "_" + 'stage_4'
        buildName = localPacket['payload']['buildName']

        # imageRunOutput = subprocess.Popen(["docker", "run", "-d",'--network=host',buildName], stdout=subprocess.PIPE)
        imageRunOutput = subprocess.Popen(
            ["docker", "run", "-d", buildName], stdout=subprocess.PIPE)
        print("imageRunOutput:", imageRunOutput)

        output = imageRunOutput.communicate()[0]
        print("output:", output)

        decodedOutput = output.decode().rstrip()  # remove '\n'
        print("decodedOutput:", decodedOutput)

        imageInspect = subprocess.Popen(
            ["docker", "inspect", decodedOutput], stdout=subprocess.PIPE)
        imageInspectOut = imageInspect.communicate()[0]
        objParsed = json.loads(imageInspectOut.decode())
        print("obj parsed:", objParsed)

        containerId = objParsed[0]['Config']['Hostname']
        localPacket['payload']['containerId'] = containerId
        exitCode = objParsed[0]['State']['ExitCode']

        print("\n\n\n Exit code:", exitCode)
        print(type(exitCode))
        if exitCode == 1:
            raise Exception("Can t run container code")

        # start container
        startContainer = subprocess.Popen(
            ["docker", "start", containerId], stdout=subprocess.PIPE)
        resultStartContainer = startContainer.communicate()[0]
        print("Result start container:", resultStartContainer)

        return localPacket

    except Exception as e:
        print("Exception in Stage 4:", e)
        buildIdToFail = packetSource['payload']['id']
        failedSignal(
            buildIdToFail, "Can't start the docker container runnign your app")
        return None


def Stage_5_Task(packetSource):

    try:
        localPacket = packetSource.copy()
        localPacket['history'] = localPacket['history'] + "_" + 'stage_5'

        docId_persist = localPacket['payload']['buildName']
        code_persist = localPacket['payload']['code']
        imageId_persist = localPacket['payload']['id']
        containerId_persist = localPacket['payload']['containerId']

        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H-%M-%S")

        bodyPersistNode = {
            'docId': docId_persist,
            'code': code_persist,
            'imageId': imageId_persist,
            'containerId': containerId_persist,
            'status': 'Status: Success, Message: Successfully deployed, Date: ' + dt_string
        }

        url = 'http://localhost:3005/populate-node'
        response = requests.post(url, json=bodyPersistNode)
        decodedResponse = response.content.decode()
        print("decodedResp:", decodedResponse)

        return localPacket

    except Exception as e:
        print("Exception in Stage 5:", e)
        buildIdToFail = packetSource['payload']['id']
        failedSignal(
            buildIdToFail, "Can't persist node stats and close pipeline")
        return None


tasksCore = {
    'stage_1': Stage_1_Task,
    'stage_2': Stage_2_Task,
    'stage_3': Stage_3_Task,
    'stage_4': Stage_4_Task,
    'stage_5': Stage_5_Task
}
