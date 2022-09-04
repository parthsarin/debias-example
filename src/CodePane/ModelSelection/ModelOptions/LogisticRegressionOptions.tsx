import { OptionSelectorProps } from "./OptionsInterfaces";

const penalties = ["none", "l2"];

const LogisticRegressionOptions = ({ options, updateOptions }: OptionSelectorProps) => {
  return (
    <div className="w-full">
      <h3 className="text-lg mb-2">Penalty</h3>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={(e) => updateOptions({ ...options, penalty: `'${e.target.value}'` })}
      >
        {
          penalties.map((p) => (
            <option
              value={p}
              selected={options.penalty.replace(/^(\'|\")+|(\'|\")+$/g, '') === p}
            >{p}</option>
          ))
        }
      </select>
    </div>
  );
};

export default LogisticRegressionOptions;