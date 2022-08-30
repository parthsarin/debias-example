import Editor from "@monaco-editor/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRef } from "react";

import './CodePane.css';
import { resetEditor, runCode } from "./CodeUtils";

interface CodePaneProps {
  setOutput: (o: string) => void
}

function CodePane({ setOutput }: CodePaneProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex flex-row mb-4 justify-around ">
        <button 
          className="btn btn-purple flex self-center"
          onClick={() => runCode(editorRef, setOutput)}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" /> Run
        </button>
        <button 
          className="btn btn-red flex self-center"
          onClick={() => resetEditor(editorRef)}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Reset
        </button>
      </div>
      <Editor
        height={`100%`}
        width={`100%`}

        defaultLanguage="python"
        defaultValue="# hello, world!"
        options={{
          fontSize: 16
        }}

        onMount={(editor, monaco) => editorRef.current = editor}
      />
    </div>
  )
}

export default CodePane;