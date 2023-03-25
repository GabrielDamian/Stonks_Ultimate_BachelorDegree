import React,{useState} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/IDE.css';
import CustomMonaco from '../Components/Organisms/CustomMonaco';
import DocsSection from '../Components/Organisms/DocsSection';
import DeployArea from '../Components/Organisms/DeployArea';
import TopBar from '../Components/Organisms/TopBar';


const code =`
        #Code Example
        model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  
        model.add(Dropout(0.2))
        model.add(LSTM(units=50, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(LSTM(units=50))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
`

export default function IDE({tabIndex,setTabs,tabs,userId})
{
    const [editorValue, setEditorValue] = useState(code)

    return (
        <div className='ide-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='ide-content'>
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