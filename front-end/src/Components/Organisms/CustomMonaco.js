import React, { useState, useEffect} from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";
import { ClockLoader as Loader } from "react-spinners";
import TestIcon from '../../Media/Icons/menu/user-light.png';
import CircularProgress from '@mui/material/CircularProgress';
// import examples from "./examples";

let code = `print("Hello world")`

export default function CustomMonaco({editorValue,setEditorValue, options}) {
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("python");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [handleOptions, setHandleOptions] = useState(null);

  useEffect(()=>{
    console.log("options xxx:",options)
    if(options !== undefined)
    {
      console.log("options ok:",options)
      setHandleOptions(options);
    }
  },[options])

  useEffect(()=>{
    console.log("ultmate check:",handleOptions)
  },[handleOptions])


  return (
    <>
      <Editor
        height="100%" // By default, it fully fits with its parent
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
