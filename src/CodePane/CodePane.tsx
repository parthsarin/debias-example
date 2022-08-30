import Editor from "@monaco-editor/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRef } from "react";

import './CodePane.css';

function CodePane() {
  const editorRef = useRef(null);

  const height = Math.round(window.innerHeight - 100);
  const width = Math.round(window.innerWidth * 0.48);

  return (
    <div className="h-100 p-2 flex flex-col">
      <div className="flex flex-row mb-2 justify-around ">
        <button className="btn btn-purple flex self-center">
          <FontAwesomeIcon icon={faPlay} className="mr-2" /> Run
        </button>
        <button className="btn btn-red flex self-center">
          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Reset
        </button>
      </div>
      <Editor
        height={`${height}px`}
        width={`${width}px`}

        defaultLanguage="python"
        defaultValue="# hello, world!"
        options={{
          fontSize: 14
        }}

        onMount={(editor, monaco) => editorRef.current = editor}
      />
    </div>
  )
}

export default CodePane;