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

export { runCode, resetEditor };