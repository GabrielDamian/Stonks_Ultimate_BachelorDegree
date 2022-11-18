import time

class Pipe_Node:
    def __init__(self, name, nextTopic, resources):
        self.name = name
        self.nextTopic = nextTopic
        self.resources = resources
        self.result = None

    def node_core(self,param):
        time.sleep(2)
        self.result = param