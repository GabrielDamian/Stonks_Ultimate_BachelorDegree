
import React from 'react';
import Modal from '@mui/material/Modal';
import CustomButton from '../Atoms/CustomButton';
import Box from '@mui/material/Box';
import CustomMonaco from '../Organisms/CustomMonaco';

export const extractLayers = (sourceData)=>{
    if(sourceData !== undefined)
    {
        const firstWord = "___ModelSeparatorStart___";
        const secondWord = "#___ModelSeparatorEnd___";
        const startPos = sourceData.indexOf(firstWord) + firstWord.length;
        const endPos = sourceData.indexOf(secondWord);
        const extractedText = sourceData    .substring(startPos, endPos);

        return extractedText
    }
    else {
        return sourceData
    }
}
export default function CodeEditorNodeDisplay ({codeSource}){
    
    const style = {
        width: '70vw',
        height: '70vh',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        margin:0,
        padding:0
      };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div 
            style={{
                padding: '10px',
            }}
            className='node-info-temp-item-code'>
            <CustomButton onClick={handleOpen} text="Code"/>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CustomMonaco  editorValue={(extractLayers(codeSource))} setEditorValue={()=>{}} options={{readOnly: true}}/>
                </Box>
            </Modal>
        </div>
    )
}