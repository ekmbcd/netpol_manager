import { NetworkPolicyFull, SelectorType } from "@/types";
import { changeSelector } from "@/utils/form";
import { useState } from "react";
import { FieldPath, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MatchExpressions from "./MatchExpressionsForm";
import MatchLabelsForm from "./MatchLabelsForm";
import NewElementButton from "./NewElementButton";

type SelectorFormProps = {
  title: string;
  path: FieldPath<NetworkPolicyFull>;
  LabelSource?: "pod" | "namespace";
};

function SelectorForm({ title, path, LabelSource = "pod" }: SelectorFormProps) {
  const [selectorType, setSelectorType] = useState<SelectorType>();

  const { setValue } = useFormContext<NetworkPolicyFull>();

  function onSelectorChange(newType: SelectorType) {
    if (newType === selectorType) {
      return;
    }
    changeSelector(newType, path, setValue);
    setSelectorType(newType);
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between pb-2 items-center">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <Select
          value={selectorType}
          onValueChange={(e: SelectorType) => onSelectorChange(e)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose a Selector" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Selectors</SelectLabel>
              <SelectItem value={SelectorType.MatchLabels}>
                MatchLabels
              </SelectItem>
              <SelectItem value={SelectorType.MatchExpressions}>
                MatchExpressions
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* TODO: there can be both a matchLabels and a MatchExpressions */}
      {selectorType === SelectorType.MatchLabels && (
        <MatchLabelsForm
          path={`${path}.matchLabels` as FieldPath<NetworkPolicyFull>}
          LabelSource={LabelSource}
        />
      )}
      {selectorType === SelectorType.MatchExpressions && (
        <MatchExpressions
          path={`${path}.matchExpressions` as FieldPath<NetworkPolicyFull>}
        />
      )}
    </div>
  );
}

export default SelectorForm;
