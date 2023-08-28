import { NetworkPolicyFull, SelectorType } from "@/types";
import { changeSelector, useFormContext } from "@/utils/form";
import { Path } from "@/utils/path";
import { Select } from "@mantine/core";
import MatchExpressions from "./MatchExpressionsForm";
import MatchLabelsForm from "./MatchLabelsForm";

type SelectorFormProps = {
  title: string;
  path: Path<NetworkPolicyFull>;
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
      changeSelector(null, path, setFieldValue);
    }
    changeSelector(newType, path, setFieldValue);
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
          path={`${path}.matchLabels` as Path<NetworkPolicyFull>}
          LabelSource={LabelSource}
        />
      )}

      {(selectorType === SelectorType.MatchExpressions ||
        selectorType === SelectorType.Both) && (
        <MatchExpressions
          path={`${path}.matchExpressions` as Path<NetworkPolicyFull>}
        />
      )}
    </div>
  );
}

export default SelectorForm;
