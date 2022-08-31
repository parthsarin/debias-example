import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { MutableRefObject } from "react";

function runCode(editor: MutableRefObject<any>, setOutput: (o: string) => void) {
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
}

function resetEditor(editor: MutableRefObject<any>) {
  if (!editor.current) return;

  editor.current.setValue('# hello, world!');
}

function persistChanges(editorContent: string, uid: string | undefined) {
  localStorage.setItem('debiasEditorVal', editorContent);
  if (!uid) return;

  const db = getFirestore();
  addDoc(collection(db, 'logs'), { 
    uid, editorContent, 
    event: 'TYPE',
    time: serverTimestamp()
  });
}

function getEditorDefaultValue() {
  const editorContent = localStorage.getItem('debiasEditorVal');
  if (editorContent) return editorContent;
  return '# hello world!';
}

export { runCode, resetEditor, persistChanges, getEditorDefaultValue };