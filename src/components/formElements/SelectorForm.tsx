import { NetworkPolicyFull, SelectorType } from "@/types";
import { changeSelector, useFormContext } from "@/utils/form";
import { Path } from "@/utils/path";
import { Select } from "@mantine/core";
import { useState } from "react";
import MatchExpressions from "./MatchExpressionsForm";
import MatchLabelsForm from "./MatchLabelsForm";

type SelectorFormProps = {
  title: string;
  path: Path<NetworkPolicyFull>;
  LabelSource?: "pod" | "namespace";
};

function SelectorForm({ title, path, LabelSource = "pod" }: SelectorFormProps) {
  const [selectorType, setSelectorType] = useState<SelectorType>();
  const { setFieldValue } = useFormContext();

  function onSelectorChange(newType: SelectorType) {
    if (newType === selectorType) {
      return;
    }
    changeSelector(newType, path, setFieldValue);
    setSelectorType(newType);
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between pb-2 items-center">
        <h4 className="font-semibold text-slate-900">{title}</h4>

        {/* TODO: add possibility to select none */}
        <Select
          placeholder="Choose a Selector"
          onChange={onSelectorChange}
          data={[
            SelectorType.MatchLabels,
            SelectorType.MatchExpressions,
            SelectorType.Both,
          ]}
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
