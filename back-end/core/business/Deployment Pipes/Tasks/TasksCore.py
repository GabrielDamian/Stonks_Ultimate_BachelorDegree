

def Stage_1_Task(packetSource):
    # TO DO - code structure
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_1'
    return localPacket


def Stage_2_Task(packetSource):
    localPacket = packetSource.copy()
    localPacket['history'] = localPacket['history'] + "_" + 'stage_2'
    return localPacket


tasksCore = {
    'stage_1': Stage_1_Task,
    'stage_2': Stage_2_Task
}