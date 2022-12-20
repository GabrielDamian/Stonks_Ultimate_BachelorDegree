from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
import time
import eventlet
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.url_map.strict_slashes = False
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*",async_mode='eventlet')

class NodeCore:
    tempIncrement = 0
    def __init__(self, logManagerOperator, nodeManagerLock) -> None:
        self.logManagerOperator = logManagerOperator
        self.nodeManagerLock = nodeManagerLock
        pass
    
    def fetchMarketData(self):
        print('fetch market data:', self.tempIncrement)

        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('fetch market data'+str(self.tempIncrement))
        self.nodeManagerLock.release()
        self.tempIncrement +=1

    
    def buildModel(self):
        print('build model')
        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('build model')
        self.nodeManagerLock.release()

    def trainModel(self):
        print('train model')
        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('train model')
        self.nodeManagerLock.release()
    
    def predict(self):
        print("predict")

        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('predict')
        self.nodeManagerLock.release()
    
    def persistPredictions(self):
        print("persist prediction")
    
        self.nodeManagerLock.acquire()
        self.logManagerOperator.createLog('persist prediction')
        self.nodeManagerLock.release()
    
    def run(self):
        self.fetchMarketData()
        # self.buildModel()
        # self.trainModel()
        # self.predict()
        # self.persistPredictions()
class LogManager():
    
    logs = []
    lastConsumed = 0

    def __init__(self) -> None:
        pass

    def createLog(self,content):
        e = datetime.datetime.now()
        
        separator = "__//__"
        finalContent = str(e) + separator + content
        
        self.logs.append(finalContent)

    def consumeLogs(self):
        
        print("consume logs:")
        print("last consumed:", self.lastConsumed)
        print("logs:", self.logs)

        #from last consumed to the end of logs
        #update last consumed to the last existing inted

        lastConsumedCopy = self.lastConsumed
        self.lastConsumed = len(self.logs)
        print("update last consumed:", self.lastConsumed)
        
        return self.logs[lastConsumedCopy:]
  

# GLOBALS
lock = threading.Lock()
increment = 0
connected_users = {}

nodeCoreInterval = 5
logsEmitInterval = 2
logsLock = threading.Lock()

logManager = LogManager()
nodeCore = NodeCore(logManager,logsLock)

class Worker(object):

    max = 10
    unit_of_work = 0

    def __init__(self,):
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
    """event listener when client disconnects to the server"""
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


if __name__ == '__main__':
    set_interval(NodeAppRun, nodeCoreInterval)
    socketio.run(app, debug=False, port=5000, host='0.0.0.0')


#decorate code_63a0b558d4e5161f4fc19185 ->>>
