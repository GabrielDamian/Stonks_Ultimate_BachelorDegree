import React,{useEffect, useState} from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

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

    const handleOpen = (newFrame) => {
      setCurrentFrame(newFrame);
      setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const [currentFrame, setCurrentFrame] = useState("https://keras.io/api/layers/core_layers/dense/")

    const treeConfig = {
      'Intro':[
        ['About Keras','https://keras.io/about/'],
        ['Code Examples','https://keras.io/examples/']
      ],
      'Layers':[
        ['About Layer','https://keras.io/api/layers/base_layer/'],
        ['Activations','https://keras.io/api/layers/activations/'],
        ['Initializers','https://keras.io/api/layers/initializers/'],
        ['Regularizers','https://keras.io/api/layers/regularizers/'],
        ['Constraints','https://keras.io/api/layers/constraints/'],
        ['Core Layers','https://keras.io/api/layers/core_layers/'],
        ['Convolution','https://keras.io/api/layers/convolution_layers/'],
        ['Pooling Layers','https://keras.io/api/layers/pooling_layers/'],
        ['Recurrent Layers','https://keras.io/api/layers/recurrent_layers/'],
        ['Normalization Layers','https://keras.io/api/layers/normalization_layers/'],
        ['Regularization Layers','https://keras.io/api/layers/regularization_layers/'],
        ['Attention Layers','https://keras.io/api/layers/attention_layers/'],
        ['Reshaping Layers','https://keras.io/api/layers/reshaping_layers/'],
        ['Merging Layers','https://keras.io/api/layers/merging_layers/'],
        ['Locally Connected_layers','https://keras.io/api/layers/locally_connected_layers/'],
        ['Activation Layer','https://keras.io/api/layers/activation_layers/'],
      ],
      'Optimizers':[
        ['About Optimizers','https://keras.io/api/optimizers/'],
        ['SGD','https://keras.io/api/optimizers/sgd/'],
        ['Rmsprop','https://keras.io/api/optimizers/rmsprop/'],
        ['Adam','https://keras.io/api/optimizers/adam/'],
        ['AdamW','https://keras.io/api/optimizers/adamw/'],
        ['Adadelta','https://keras.io/api/optimizers/adadelta/'],
        ['Adagrad','https://keras.io/api/optimizers/adagrad/'],
        ['AdamaX','https://keras.io/api/optimizers/adamax/'],
        ['Adafactor','https://keras.io/api/optimizers/adafactor/'],
        ['Nadam','https://keras.io/api/optimizers/Nadam/'],
        ['Ftrl','https://keras.io/api/optimizers/ftrl/'],
        ['Learning Rate Schedules','https://keras.io/api/optimizers/learning_rate_schedules/'],
      ],
      'Metric':[
        ['About Metrics','https://keras.io/api/metrics/']
      ],
      'Losses':[
        ['About Losses','https://keras.io/api/losses/']
      ]
    }

    const generateTreeView = ()=>{
      let itemsIndex = 0;
      let giveMeIndex = ()=>{
        itemsIndex +=1
        return itemsIndex
      }
      return Object.keys(treeConfig).map((el, index)=>{
        return (<TreeItem  nodeId={{index}} label={el}>
                {
                  treeConfig[el].map((el_deep)=>{
                    return (
                      <TreeItem nodeId={()=>giveMeIndex()} label={el_deep[0]} onClick={()=>handleOpen(el_deep[1])}/>
                    )
                  })
                }
                </TreeItem>)
      })
    }

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
            src={currentFrame}
            
            style={{
              height:'100%',
              width:'100%',
              outline: 'none'
            }}
            title="Iframe Example"></iframe> 
          </Box>
        </Fade>
        </Modal>
            <div className='ide-core-docs-header'>
                <span>Read the docs</span>
            </div>
            <div style={{
              height: '70%',
              overflowY: 'scroll'
            }}>
              <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ height: 'auto', flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}
                >
                {generateTreeView()}
            </TreeView>
            </div>
            
        </>
    )
}

export default DocsSection;
