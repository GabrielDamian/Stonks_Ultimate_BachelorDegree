import React, { useState, useEffect} from "react";
import Editor from "@monaco-editor/react";
import TestLoader from "../Atoms/TestLoader";

export default function CustomMonaco({triggerCustomUserCode, editorValue,setEditorValue, options}) {
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
        loading={<TestLoader/> }
        value={editorValue !== undefined ? editorValue : null }
        onChange={(newValue)=>{
          triggerCustomUserCode()  
          setEditorValue(newValue)
        }}
        options={handleOptions}
      />
    </>
  );
}


