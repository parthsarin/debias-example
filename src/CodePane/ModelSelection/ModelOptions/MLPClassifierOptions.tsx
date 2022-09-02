import { OptionSelectorProps } from "./OptionsInterfaces";

const hiddenLayers = ['(50,)', '(50, 50,)', '(50, 50, 50,)', '(100,)']

const MLPClassifierOptions = ({ options, updateOptions }: OptionSelectorProps) => (
  <div className="w-full">
    <h3 className="text-lg mb-2">Hidden layer architecture</h3>
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      onChange={(e) => updateOptions({ ...options, hidden_layer_sizes: e.target.value })}
    >
      {
        hiddenLayers.map((p) => (
          <option
            value={p}
            selected={options.hidden_layer_sizes === p}
          >{p}</option>
        ))
      }
    </select>
  </div>
);

export default MLPClassifierOptions;