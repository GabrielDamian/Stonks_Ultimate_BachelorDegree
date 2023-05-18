import CircularProgress from '@mui/material/CircularProgress';

export default function TestLoader  (){
    return(
      <div style={{
        height:'100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#131517'
      }}>
        <CircularProgress sx={{
          color: '#bcfe2f'
        }} />
      </div>
    )
  }