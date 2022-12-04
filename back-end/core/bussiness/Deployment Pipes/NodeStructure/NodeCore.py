import time

class Pipe_Node:
    def __init__(self, name, resources,task):
        self.name = name
        self.resources = resources
        self.task = task
    def executeTask(self):
        return self.task(self.resources)
