import { ModelSelectionParameters } from "./ModelParameters";

export function generateCodeFromParameters(
  scaffold: string, 
  modelSelectionParams: ModelSelectionParameters
) {
  scaffold = scaffold.replace(
    /{VARIABLE_CHOICE}/g, 
    modelSelectionParams.VARIABLE_CHOICE
      .map(v => `'${v}'`)
      .join(",\n\t")
  )

  scaffold = scaffold.replace(
    /{MODEL_CHOICE}/,
    modelSelectionParams.MODEL_CHOICE
  )

  scaffold = scaffold.replace(
    /{MODEL_OPTIONS}/,
    Object
      .entries(modelSelectionParams.MODEL_OPTIONS)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")
  )

  return scaffold;
}

export function updateModelSelectionParams(
  scaffold: string,
  modelSelectionParams: ModelSelectionParameters,
  updateState: (params: ModelSelectionParameters) => void,
  updateEditor: (code: string) => void
) {
  const code = generateCodeFromParameters(scaffold, modelSelectionParams);
  updateEditor(code);
  updateState(modelSelectionParams);
}