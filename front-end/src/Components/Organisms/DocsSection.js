import React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  height: '70%',
  width:'70%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display:'flex',
  justifyContent: 'center',
  alignItems: 'center'
};


function DocsSection(){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        <Fade in={open}>
          <Box sx={style}>
          <iframe 
            src="https://keras.io/api/layers/core_layers/dense/" 
            style={{
              height:'100%',
              width:'100%',
              outline: 'none'
            }}
            title="Iframe Example"></iframe> 
            {/* <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography> */}
          </Box>
        </Fade>
        </Modal>
            <div className='ide-core-docs-header'>
                <span>Docs</span>
            </div>
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                <TreeItem sx={{
                  // color:'#b0afb2',
                  // backgroundColor: '#131517'
                  
                  }} nodeId="1" label="Applications">
                    <TreeItem nodeId="2" label="Calendar" />
                </TreeItem>
                <TreeItem nodeId="5" label="Documents">
                    <TreeItem nodeId="10" label="OSS" />
                    <TreeItem nodeId="6" label="MUI">
                    <TreeItem nodeId="8" label="index.js" onClick={handleOpen}/>
                    </TreeItem>
                </TreeItem>
            </TreeView>
        </>
    )
}

export default DocsSection;
