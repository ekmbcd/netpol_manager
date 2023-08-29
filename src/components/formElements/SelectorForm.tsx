import { SelectorType } from "@/types";
import { changeSelector, useFormContext } from "@/utils/form";
import { NetworkPolicyPathExtract } from "@/utils/path";
import { Select } from "@mantine/core";
import MatchExpressions from "./MatchExpressionsForm";
import MatchLabelsForm from "./MatchLabelsForm";

type SelectorFormProps = {
  title: string;
  path: NetworkPolicyPathExtract<
    `${string}.podSelector` | `${string}.namespaceSelector`
  >;
  LabelSource?: "pod" | "namespace";
};

function SelectorForm({ title, path, LabelSource = "pod" }: SelectorFormProps) {
  const { setFieldValue, getInputProps } = useFormContext();
  const selector = getInputProps(path).value;

  let selectorType: SelectorType | undefined;
  if ("matchLabels" in selector && "matchExpressions" in selector) {
    selectorType = SelectorType.Both;
  } else if ("matchExpressions" in selector) {
    selectorType = SelectorType.MatchExpressions;
  } else if ("matchLabels" in selector) {
    selectorType = SelectorType.MatchLabels;
  } else {
    selectorType = undefined;
  }

  function onSelectorChange(newType: SelectorType) {
    // if the user selects the same option, reset the selector
    if (newType === selectorType) {
      changeSelector(path, setFieldValue, null);
    }
    changeSelector(path, setFieldValue, newType);
  }

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex items-center justify-between pb-2">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <Select
          placeholder="Choose a Selector"
          onChange={onSelectorChange}
          data={[
            SelectorType.MatchLabels,
            SelectorType.MatchExpressions,
            SelectorType.Both,
          ]}
          checkIconPosition="right"
          value={selectorType}
        />
      </div>

      {(selectorType === SelectorType.MatchLabels ||
        selectorType === SelectorType.Both) && (
        <MatchLabelsForm
          path={`${path}.matchLabels`}
          LabelSource={LabelSource}
        />
      )}

      {(selectorType === SelectorType.MatchExpressions ||
        selectorType === SelectorType.Both) && (
        <MatchExpressions path={`${path}.matchExpressions`} />
      )}
    </div>
  );
}

export default SelectorForm;
