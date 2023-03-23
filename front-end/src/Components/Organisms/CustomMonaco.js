import React, { useState, useEffect} from "react";
import Editor from "@monaco-editor/react";
import CircularProgress from '@mui/material/CircularProgress';


export default function CustomMonaco({editorValue,setEditorValue, options}) {
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("python");
  const [handleOptions, setHandleOptions] = useState(null);

  useEffect(()=>{
    if(options !== undefined)
    {
      setHandleOptions(options);
    }
  },[options])


  return (
    <>
      <Editor
        height="100%" 
        width="100%"
        theme={theme}
        language={language}
        loading={<TestLoader />}
        value={editorValue !== undefined ? editorValue : null }
        onChange={setEditorValue}
        options={handleOptions}
      />
    </>
  );
}

const TestLoader = ()=>{
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
