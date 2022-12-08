import React,{useState,useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/IDE.css';
import MonacoEditor from 'react-monaco-editor'
import CustomMonaco from '../Components/Organisms/CustomMonaco';

import DocsSection from '../Components/Organisms/DocsSection';
import DeployArea from '../Components/Organisms/DeployArea';
import TopBar from '../Components/Organisms/TopBar';

const code =`from flask import Flask
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
`

export default function IDE({tabIndex,setTabs,tabs,userId})
{
    console.log("tabs idex:", tabIndex)

    const [editorValue, setEditorValue] = useState(code)

    return (
        <div className='ide-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='ide-content'>
                <div className='ide-header'>
                    <span>IDE Builder</span>
                </div>
                <div className='ide-core'>
                    <div className='ide-core-docs'>
                        <DocsSection/>
                    </div>
                    <div className='ide-core-editor'>
                        <CustomMonaco
                            editorValue={editorValue}
                            setEditorValue={setEditorValue}
                        />
                    </div>
                </div>
                <div className='ide-deploy'>
                    <DeployArea editorValue={editorValue}/>
                </div>
            </div>
            </div>
        </div>
    )
}