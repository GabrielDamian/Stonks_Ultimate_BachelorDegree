import React from 'react';
import CodeEditorNodeDisplay from './CodeEditorNodeDisplay';

export default function  TempDisplayNodeItem ({keyItem,content}){
    return (
            keyItem === 'Code'? <CodeEditorNodeDisplay codeSource={content}/>:
            <div className='node-info-temp-item'>
                <div className='node-info-temp-item-key'>
                <span>{keyItem}:</span>
                </div>
                <div className='node-info-temp-item-content'>
                    <span>{content}</span>
                </div>
            </div>
    )
}