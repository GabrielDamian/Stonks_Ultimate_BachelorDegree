from logManager import *
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
        self.buildModel()
        self.trainModel()
        self.predict()
        self.persistPredictions()
    
