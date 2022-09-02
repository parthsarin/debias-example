const modelVariables = [
  'Gender',
  'Married',
  'Education',
  'Self_Employed',
  'Property_Area',
  'ApplicantIncome',
  'CoapplicantIncome',
  'LoanAmount',
  'Loan_Amount_Term',
  'Credit_History'
];

type ModelVariables = typeof modelVariables[number];

interface ModelSelectionParameters {
  MODEL_CHOICE: 'LogisticRegression' | 'MLPClassifier' | 'KNeighborsClassifier',
  VARIABLE_CHOICE: ModelVariables[],
  MODEL_OPTIONS: { [k: string]: any }
}

export type { ModelSelectionParameters, ModelVariables };
export { modelVariables };