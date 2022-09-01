import Editor from "@monaco-editor/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";

import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { getEditorDefaultValue, persistChanges, resetEditor, runCode } from "./CodeUtils";
import UserContext from "../App/UserContext";


import './CodePane.css';

interface CodePaneProps {
  setOutput: (o: string) => void,
  setNarrativeLoading: (lg: boolean) => void
}

function CodePane({ setOutput, setNarrativeLoading }: CodePaneProps) {
  const [fsDownloaded, setFSDownloaded] = useState(false);
  const [scaffold, setScaffold] = useState('');
  const editorRef = useRef<any>(null);
  const typeSubj$ = useMemo(() => new Subject<string>(), []);
  const uid = useContext(UserContext)?.uid;

  // Periodically log to firebase
  useEffect(() => {
    const syncSubscriber = typeSubj$.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((val: string) => persistChanges(val, uid))

    return () => syncSubscriber.unsubscribe();
  }, [typeSubj$, uid]);

  // Load the file system from firebase
  useEffect(() => {
    if (fsDownloaded) return;
    
    (async () => {
      const storage = getStorage();
      const reqURL = await getDownloadURL(ref(storage, 'scaffold/fs.zip'));
      const zipResponse = await fetch(reqURL);
      const zipBinary = await zipResponse.arrayBuffer();
      // @ts-ignore
      pyodide.unpackArchive(zipBinary, "zip");

      setFSDownloaded(true);
    })();
  }, [fsDownloaded]);

  // Load the scaffold from firebase
  useEffect(() => {
    if (scaffold) return;
    
    (async () => {
      const storage = getStorage();
      const reqURL = await getDownloadURL(ref(storage, 'scaffold/scaffold.py'));
      const resp = await fetch(reqURL);

      setScaffold(await resp.text());
    })();
  }, [scaffold]);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex flex-row mb-4 justify-around ">
        <button 
          className="btn btn-purple flex self-center"
          onClick={() => runCode(editorRef, setOutput, setNarrativeLoading)}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" /> Run
        </button>
        <button 
          className="btn btn-red flex self-center"
          onClick={() => resetEditor(editorRef, scaffold, uid)}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Reset
        </button>
      </div>
      <Editor
        height={`100%`}
        width={`100%`}

        defaultLanguage="python"
        defaultValue={getEditorDefaultValue()}
        options={{
          fontSize: 16
        }}

        onMount={(editor, monaco) => editorRef.current = editor}
        onChange={(v) => typeSubj$.next(v!)}
      />
    </div>
  )
}

export default CodePane;