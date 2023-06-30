import React,{useEffect, useState} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/IDE.css';
import CustomMonaco from '../Components/Organisms/CustomMonaco';
import DocsSection from '../Components/Organisms/DocsSection';
import DeployArea from '../Components/Organisms/DeployArea';
import TopBar from '../Components/Organisms/TopBar';
import PresetIDEValues from '../Components/Organisms/PresetIDEValues';

const presetValues = [
    {
        title: 'Custom',
        code: '#custom code'
    },
    {
        title: 'Model 1',
        code: `
        #Model 1
        model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))  
        model.add(Dropout(0.2))
        model.add(LSTM(units=50, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(LSTM(units=50))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
`
    },
    {
        title: 'Model 2',
        code: `
        #Model 2
        model.add(Bidirectional(LSTM(units=50, return_sequences=True), input_shape=(x_train.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(Bidirectional(LSTM(units=50, return_sequences=True)))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
    `
    },
    {
        title: 'Model 3',
        code: `
        #Model 3
        model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
        model.add(MaxPooling1D(pool_size=2))
        model.add(LSTM(units=50, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))

    `
    },
    {
        title: 'Model 4',
        code: `
        #Model 4
        model.add(GRU(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(GRU(units=50, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
    `
    },
    {
        title: 'Model 5',
        code: `
        #Model 5
        model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
        model.add(Conv1D(filters=32, kernel_size=3, activation='relu'))
        model.add(MaxPooling1D(pool_size=2))
        model.add(LSTM(units=32, return_sequences=True))
        model.add(LSTM(units=16, return_sequences=False))
        model.add(Dense(units=32, activation='relu'))
        model.add(Dense(units=1))
    `
    },
    {
        title: 'Model 6',
        code: `
        #Model 6
        model.add(LSTM(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        model.add(LSTM(units=32, return_sequences=True))
        model.add(LSTM(units=16, return_sequences=False))
        model.add(Dense(units=32, activation='relu'))
        model.add(Dense(units=1))
    `
    },
    {
        title: 'Model 7',
        code: `
        #Model 7
        model.add(Bidirectional(LSTM(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1))))
        model.add(Bidirectional(LSTM(units=32, return_sequences=True)))
        model.add(Bidirectional(LSTM(units=16, return_sequences=False)))
        model.add(Dense(units=32, activation='relu'))
        model.add(Dense(units=1))
    `
    },
    {
        title: 'Model 8',
        code: `
        #Model 8
        model.add(Conv1D(filters=32, kernel_size=3, activation='relu', input_shape=(x_train.shape[1], 1)))
        model.add(MaxPooling1D(pool_size=2))
        model.add(Conv1D(filters=64, kernel_size=3, activation='relu'))
        model.add(MaxPooling1D(pool_size=2))
        model.add(Conv1D(filters=128, kernel_size=3, activation='relu'))
        model.add(LSTM(units=64, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(LSTM(units=32, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
    `
    },
    {
        title: 'Model 9',
        code: `
        #9
        model.add(LSTM(units=64, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(LayerNormalization(epsilon=1e-6))
        model.add(LSTM(units=64, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(LayerNormalization())
        model.add(Dense(units=1))
    `
    },
]
export default function IDE({tabIndex,setTabs,tabs,userId})
{
    const [editorValue, setEditorValue] = useState(presetValues[1].code)

    const [presetSelected, setPresetSelected] = useState(1);

    const triggerSetSelected = (indexNewValue)=>{
        setPresetSelected(indexNewValue)
        setEditorValue(presetValues[indexNewValue].code)
    }
    const triggerCustomUserCode = ()=>{
        setPresetSelected(0)
    }
    
    return (
        <div className='ide-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='ide-content'>
                    <div className='ide-core'>
                        <div className='ide-core-docs'>
                            <PresetIDEValues 
                                presetSelected={presetSelected} 
                                presetValues={presetValues} 
                                triggerSetSelected={triggerSetSelected}/>
                            <DocsSection/>
                        </div>
                        <div className='ide-core-editor'>
                            <CustomMonaco
                                triggerCustomUserCode={triggerCustomUserCode}
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
