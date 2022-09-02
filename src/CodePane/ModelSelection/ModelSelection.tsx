import KNeighborsClassifierOptions from "./ModelOptions/KNeighborsClassifierOptions";
import LogisticRegressionOptions from "./ModelOptions/LogisticRegressionOptions";
import MLPClassifierOptions from "./ModelOptions/MLPClassifierOptions";
import { ModelSelectionParameters, modelVariables } from "./ModelParameters";

interface ModelSelectionComponentParams {
  modelSelectionParams: ModelSelectionParameters;
  updateModelSelectionParams: (params: ModelSelectionParameters) => void;
}

const ModelSelection = ({ modelSelectionParams, updateModelSelectionParams }: ModelSelectionComponentParams) => {
  const handleCheckboxChange = (v: string) => () => {
    const checked = modelSelectionParams.VARIABLE_CHOICE.includes(v);
    const newParams = {...modelSelectionParams};

    if (checked) {
      newParams.VARIABLE_CHOICE = newParams.VARIABLE_CHOICE.filter((x) => x !== v);
    } else {
      newParams.VARIABLE_CHOICE.push(v);
    }

    updateModelSelectionParams(newParams);
  }

  return (
    <>
      <div className="flex flex-col flex-grow px-4">
        <h2 className="text-xl mb-2">What can the model see?</h2>
        {
          modelVariables
            .map((v: string) => ((
              <div key={v} className="flex flex-row items-center mb-1">
                <input 
                  id={v}
                  name={v}
                  type='checkbox' 
                  checked={modelSelectionParams.VARIABLE_CHOICE.includes(v)} 
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={handleCheckboxChange(v)}
                />
                <label 
                  htmlFor={v}
                  className="ml-2"
                >{v}</label>
              </div>
            )))
        }
      </div>
      <div className="flex flex-col grow-[3] px-4">
        <h2 className="text-xl mb-2">Model type</h2>
        <select 
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={
            (e) => updateModelSelectionParams({
              ...modelSelectionParams, 
              MODEL_CHOICE: e.target.value as 'LogisticRegression' | 'MLPClassifier' | 'KNeighborsClassifier',
              MODEL_OPTIONS: {}
            })
        }
        >
          <option 
            value="LogisticRegression"
            selected={modelSelectionParams.MODEL_CHOICE === "LogisticRegression"}
          >Logistic Regression</option>
          <option 
            value="MLPClassifier"
            selected={modelSelectionParams.MODEL_CHOICE === "MLPClassifier"}
          >Neural Network</option>
          <option 
            value="KNeighborsClassifier"
            selected={modelSelectionParams.MODEL_CHOICE === "KNeighborsClassifier"}
          >K Nearest Neighbors</option>
        </select>
        <h2 className="text-xl mb-2 mt-4">Model parameters</h2>
        {
          modelSelectionParams.MODEL_CHOICE === "LogisticRegression"
          && (<LogisticRegressionOptions options={modelSelectionParams.MODEL_OPTIONS} updateOptions={(options) => updateModelSelectionParams({...modelSelectionParams, MODEL_OPTIONS: options})} />)
        }
        {
          modelSelectionParams.MODEL_CHOICE === "MLPClassifier"
          && (<MLPClassifierOptions options={modelSelectionParams.MODEL_OPTIONS} updateOptions={(options) => updateModelSelectionParams({...modelSelectionParams, MODEL_OPTIONS: options})} />)
        }
        {
          modelSelectionParams.MODEL_CHOICE === "KNeighborsClassifier"
          && (<KNeighborsClassifierOptions options={modelSelectionParams.MODEL_OPTIONS} updateOptions={(options) => updateModelSelectionParams({...modelSelectionParams, MODEL_OPTIONS: options})} />)
        }
      </div>
    </>
  );
}

export default ModelSelection;