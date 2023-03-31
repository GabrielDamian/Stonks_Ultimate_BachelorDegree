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
import yfinance as yfin
import matplotlib.pyplot as plt

yfin.pdr_override()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.url_map.strict_slashes = False
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

node_id = 'ceva'

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

        # !!!!! REPLACE BEFORE DOCKER MODE
        # company = '""" + code_template_replace_company + """'\n
        company = 'AAPL'
        data = pdr.get_data_yahoo(company, start="2019-10-10", end="2020-10-10")
        print("data:",data)

        # scale all data between [0,1]
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column
        print("scaled_data:",scaled_data)

        # how many days we look into the past to predict the next day
        prediction_days = 60

        # training data
        x_train = []
        y_train = []

        for x in range(prediction_days, len(scaled_data)):
            print("x:",x)
            x_train.append(scaled_data[x - prediction_days:x, 0])
            y_train.append(scaled_data[x, 0])

        print(" 1 x_train:",x_train)
        print("1 y_train:",y_train)


        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

        print("2 x_train:",x_train)
        print("2 y_train:",y_train)

        model = Sequential()


        # model 1
        # model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  # units = neurons
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=50, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=50))
        # model.add(Dropout(0.2))
        # model.add(Dense(units=1))

        # model 2
        # model.add(Bidirectional(LSTM(units=50, return_sequences=True), input_shape=(x_train.shape[1], 1)))
        # model.add(Dropout(0.2))
        # model.add(Bidirectional(LSTM(units=50, return_sequences=True)))
        # model.add(Dropout(0.2))
        # model.add(Dense(units=1))

        #model 3
        # model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
        # model.add(MaxPooling1D(pool_size=2))
        # model.add(LSTM(units=50, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(Dense(units=1))

        #model 4
        model.add(GRU(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(GRU(units=50, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))

        # model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
        # model.add(Conv1D(filters=32, kernel_size=3, activation='relu'))
        # model.add(MaxPooling1D(pool_size=2))
        # model.add(LSTM(units=32, return_sequences=True))
        # model.add(LSTM(units=16, return_sequences=False))
        # model.add(Dense(units=32, activation='relu'))
        # model.add(Dense(units=1))

        # model.add(LSTM(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        # model.add(LSTM(units=32, return_sequences=True))
        # model.add(LSTM(units=16, return_sequences=False))
        # model.add(Dense(units=32, activation='relu'))
        # model.add(Dense(units=1))

        # model.add(Bidirectional(LSTM(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1))))
        # model.add(Bidirectional(LSTM(units=32, return_sequences=True)))
        # model.add(Bidirectional(LSTM(units=16, return_sequences=False)))
        # model.add(Dense(units=32, activation='relu'))
        # model.add(Dense(units=1))

        # model.add(Conv1D(filters=32, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
        # model.add(MaxPooling1D(pool_size=2))
        # model.add(Conv1D(filters=64, kernel_size=3, activation='relu'))
        # model.add(MaxPooling1D(pool_size=2))
        # model.add(Conv1D(filters=128, kernel_size=3, activation='relu'))
        # model.add(LSTM(units=64, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(LSTM(units=32, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(Dense(units=1))

        # model.add(LSTM(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        # model.add(Dropout(0.2))
        # model.add(LayerNormalization(epsilon=1e-6))
        # model.add(LSTM(units=64, return_sequences=True))
        # model.add(Dropout(0.2))
        # model.add(LayerNormalization())
        # model.add(Dense(units=1))


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
        print("predictNextDay:")

        # --->> Dev Mode
        # company = "IBM"
        company = 'AAPL'

        prediction_days = 60

        test_start = datetime.datetime(2015, 1, 1)
        test_end = datetime.datetime.now()

        data = pdr.get_data_yahoo(company, start=test_start, end=test_end)
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaler.fit_transform(data['Close'].values.reshape(-1, 1))  # keep only 'close' column

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

        # FIX 1: working for first example
        # predicted_prices = scaler.inverse_transform(predicted_prices)

        # FIX 2: working for the rest of the examples
        # predicted_prices = [[a[0][-1]] for a in predicted_prices]
        # predicted_prices = scaler.inverse_transform(predicted_prices)

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
        return [[tommorow_price]]  # weird format, needs fix

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

        tomorrowPrice = self.nodeModelHandler.predictNextDay(self.model)
        print("tomorrowPrice:",tomorrowPrice)

        # REMOVE FOR DOCKER VERSION: TODO: add try catch wrapper
        # self.apiPersistPrediction(str(tomorrowPrice[0][0]))

        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('__tomorrow-price__:' + str(tomorrowPrice[0][0]))
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
    print("Create new prediction")
    nodeCore.run()

def nodeHeartBeat():
    print("Node Heart Beat")
    logManager.createLog('__Alive__')


if __name__ == '__main__':
    NodeAppRun()
    # set_interval(NodeAppRun, 43200)  # real use
    set_interval(NodeAppRun, 3)  #dev mode
    set_interval(nodeHeartBeat, 1)

    socketio.run(app, debug=False, port=5000, host='0.0.0.0')