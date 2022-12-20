class LogManager():
    
    logs = []
    lastConsumed = 0

    def __init__(self) -> None:
        pass

    def createLog(self,content):
        
        print("create log:", content)
        self.logs.append(content)

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


