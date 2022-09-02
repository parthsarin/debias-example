import Editor from "@monaco-editor/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";

import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { defaultModelSelectionParams, persistChanges, resetEditor, runCode } from "./CodeUtils";
import UserContext from "../App/UserContext";


import './CodePane.css';
import { ModelSelectionParameters } from "./ModelSelection/ModelParameters";
import ModelSelection from "./ModelSelection";
import { generateCodeFromParameters, updateModelSelectionParams } from "./ModelSelection/ModelParametersUtils";

interface CodePaneProps {
  setOutput: (o: string) => void
}

function CodePane({ setOutput }: CodePaneProps) {
  const [fsDownloaded, setFSDownloaded] = useState(false);
  const [scaffold, setScaffold] = useState('');
  const [modelSelectionParams, setModelSelectionParams] = useState<ModelSelectionParameters>(defaultModelSelectionParams);

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
      const scaffold = await resp.text();

      setScaffold(scaffold);
      editorRef.current?.setValue(
        generateCodeFromParameters(scaffold, modelSelectionParams)
      );
    })();
  }, [scaffold]);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex flex-row mb-4 justify-between">
        <ModelSelection
          modelSelectionParams={modelSelectionParams}
          updateModelSelectionParams={
            (params: ModelSelectionParameters) => updateModelSelectionParams(
              scaffold, 
              params,
              setModelSelectionParams,
              (val: string) => editorRef.current.setValue(val)
            )
          }
        />
      </div>
      <div className="flex flex-row mb-4 justify-around ">
        <button
          className="btn btn-purple flex self-center"
          onClick={() => runCode(editorRef, setOutput)}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" /> Run
        </button>
        <button
          className="btn btn-red flex self-center"
          onClick={() => {
            setModelSelectionParams(defaultModelSelectionParams)
            resetEditor(editorRef, scaffold, defaultModelSelectionParams, uid)
          }}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Reset
        </button>
      </div>
      <div className="flex flex-grow">
        <Editor
          height={`100%`}
          width={`100%`}

          defaultLanguage="python"
          defaultValue={'# loading scaffold...'}
          options={{
            fontSize: 16
          }}

          onMount={(editor, monaco) => editorRef.current = editor}
          onChange={(v) => typeSubj$.next(v!)}
        />
      </div>
    </div>
  )
}

export default CodePane;