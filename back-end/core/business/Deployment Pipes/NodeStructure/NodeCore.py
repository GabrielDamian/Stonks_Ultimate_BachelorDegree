import time

class Pipe_Node:
    def __init__(self, name, nextTopic, resources):
        self.name = name
        self.nextTopic = nextTopic
        self.resources = resources
    def nodeTask(self):
        result = {
            'pipe': self.resources['pipe'],
            'payload': self.resources['payload'] +"_"+ self.name
        }
        print("nodeTask return:", result)
        return result


