import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { MutableRefObject } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ModelSelectionParameters, modelVariables } from "./ModelSelection/ModelParameters";
import { generateCodeFromParameters } from "./ModelSelection/ModelParametersUtils";

const MySwal = withReactContent(Swal)
const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', MySwal.stopTimer)
    toast.addEventListener('mouseleave', MySwal.resumeTimer)
  }
});

const defaultModelSelectionParams = {
  MODEL_CHOICE: 'LogisticRegression',
  MODEL_OPTIONS: {'penalty': "'l2'"},
  VARIABLE_CHOICE: modelVariables
} as ModelSelectionParameters;


function runCode(
  editor: MutableRefObject<any>, 
  setOutput: (o: string) => void
) {
  // @ts-ignore
  const pyodide = window.pyodide as any;
  if (!editor.current || !pyodide) return;

  let resp: string;
  try {
    // @ts-ignore
    window.py_outputs = [];

    const code = editor.current.getValue();
    pyodide.runPython(code);

    // @ts-ignore
    resp = window.py_outputs.join('\n');
  } catch (e: any) {
    resp = e.toString();
  }

  setOutput(resp);
  Toast.fire({
    icon: 'success',
    title: 'Execution complete'
  })
}

function resetEditor(
  editor: MutableRefObject<any>, 
  scaffold: string, 
  defaultModelSelectionParams: ModelSelectionParameters,
  uid: string | undefined
) {
  if (!editor.current) return;

  editor.current.setValue(generateCodeFromParameters(scaffold, defaultModelSelectionParams));
  
  if (!uid) return;
  const db = getFirestore();
  addDoc(collection(db, 'logs'), {
    uid, editorContent: scaffold,
    event: 'RESET_SCAFFOLD',
    time: serverTimestamp()
  });
}

function persistChanges(editorContent: string, uid: string | undefined) {
  if (!uid) return;

  const db = getFirestore();
  addDoc(collection(db, 'logs'), { 
    uid, editorContent, 
    event: 'TYPE',
    time: serverTimestamp()
  });
}

export { runCode, resetEditor, persistChanges, defaultModelSelectionParams };