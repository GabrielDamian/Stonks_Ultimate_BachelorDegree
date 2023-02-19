import React, { useState } from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";
import { ClockLoader as Loader } from "react-spinners";
import TestIcon from '../../Media/Icons/menu/user-light.png';
import CircularProgress from '@mui/material/CircularProgress';
// import examples from "./examples";

let code = `print("Hello world")`

export default function CustomMonaco({editorValue,setEditorValue}) {
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("python");
  const [isEditorReady, setIsEditorReady] = useState(false);

  return (
    <>
      <Editor
        height="100%" // By default, it fully fits with its parent
        width="100%"
        theme={theme}
        language={language}
        loading={<TestLoader />}
        value={editorValue}
        onChange={setEditorValue}
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
