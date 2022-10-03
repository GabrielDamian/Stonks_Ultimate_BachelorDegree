import React, { useState } from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";
import { ClockLoader as Loader } from "react-spinners";

// import examples from "./examples";

let code = `print("Hello world")`

export default function CustomMonaco() {
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("python");
  const [isEditorReady, setIsEditorReady] = useState(false);

  const [value,setValue] = useState(code);
  const handleValueChange = (newValue)=>{
    setValue(newValue)
  }

  return (
    <>
      <Editor
        height="100%" // By default, it fully fits with its parent
        width="100%"
        theme={theme}
        language={language}
        loading={<Loader />}
        value={value}
        onChange={handleValueChange}
      />
    </>
  );
}
