from flask import Flask
from flask_apscheduler import APScheduler
import datetime

app = Flask(__name__)

def my_job(text):
    print(text, str(datetime.datetime.now()))

@app.route('/')
def index():
    #
    #
    return 'Web App with Python Flask!'

if (__name__ == "__main__"):
    scheduler = APScheduler()
    scheduler.add_job(func=my_job, args=['job run'], trigger='interval', id='job', seconds=5)
    scheduler.start()
    app.run(host='0.0.0.0', port=81)
  
#decorate code_637a770cd18cb368046dc8bf ->>>
