import { OptionSelectorProps } from "./OptionsInterfaces";

const numNeighbors = [5, 1, 10, 20, 50, 100]

const KNeighborsClassifierOptions = ({ options, updateOptions }: OptionSelectorProps) => (
  <div className="w-full">
    <h3 className="text-lg mb-2">Number of neighbors</h3>
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      onChange={(e) => updateOptions({ ...options, n_neighbors: e.target.value })}
    >
      {
        numNeighbors.map((p) => (
          <option
            value={p}
            selected={options.n_neighbors === p}
          >{p}</option>
        ))
      }
    </select>
  </div>
);

export default KNeighborsClassifierOptions;