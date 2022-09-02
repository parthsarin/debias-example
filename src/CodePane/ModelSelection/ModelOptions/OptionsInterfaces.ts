import { ModelSelectionParameters } from "../ModelParameters";

interface OptionSelectorProps {
  options: ModelSelectionParameters["MODEL_OPTIONS"];
  updateOptions: (options: ModelSelectionParameters["MODEL_OPTIONS"]) => void;
}

export type { OptionSelectorProps };