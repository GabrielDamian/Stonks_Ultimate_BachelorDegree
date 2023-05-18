

export default function OverviewSpanShoRow ({keyValue, stringValue}){
    
    return(
        <div className='overview-panel-container-content-row'>
            <div className='overview-panel-container-content-row-left'>
                <span>{keyValue}</span>
            </div>
            <div className='overview-panel-container-content-row-right'>
                <span>{stringValue}</span>
            </div>
        </div>
    )
}
