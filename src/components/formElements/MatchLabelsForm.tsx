import { NetworkPolicyFull } from "@/types";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import InputWithLabel from "./InputWithLabel";

type MatchLabelsFormProps = {};

function MatchLabelsForm({}: MatchLabelsFormProps) {
  const { watch, setValue } = useFormContext<NetworkPolicyFull>();

  const labels = watch("spec.podSelector.matchLabels");

  if (!labels) {
    return null;
  }

  const labelsArray = Object.entries(labels);

  function onChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "key" | "value",
    key: string
  ) {
    if (type === "value") {
      setValue(`spec.podSelector.matchLabels.${key}`, event.target.value);
    } else {
      const temp = { ...labels };
      temp[event.target.value] = temp[key];
      delete temp[key];
      setValue("spec.podSelector.matchLabels", temp);
    }
  }

  function createNewLabel() {
    const temp = { ...labels };
    temp[""] = "";
    setValue("spec.podSelector.matchLabels", temp);
  }

  return (
    <div>
      {labelsArray.map(([key, value], index) => {
        return (
          <div key={index} className="flex gap-2">
            <div className="grow">
              <InputWithLabel
                label="key"
                props={{
                  onChange: (e) => onChange(e, "key", key),
                  value: key,
                }}
              />
            </div>
            <div className="grow">
              <InputWithLabel
                label="value"
                props={{
                  onChange: (e) => onChange(e, "value", key),
                  value: value,
                }}
              />
            </div>
          </div>
        );
      })}
      <Button onClick={createNewLabel}>new label</Button>
    </div>
  );
}

export default MatchLabelsForm;
