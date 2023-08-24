import { useClusterStore } from "@/store/clusterStore";
import { NetworkPolicyFull } from "@/types";
import { addLabel, removeLabel } from "@/utils/form";
import { FieldPath, useFormContext } from "react-hook-form";
import DeleteElementButton from "./DeleteElementButton";
import InputWithLabel from "./InputWithLabel";
import NewElementButton from "./NewElementButton";

type MatchLabelsFormProps = {
  path: FieldPath<NetworkPolicyFull>;
  LabelSource?: "pod" | "namespace";
};

function MatchLabelsForm({ path, LabelSource = "pod" }: MatchLabelsFormProps) {
  const { watch, setValue } = useFormContext<NetworkPolicyFull>();
  const getLabels = useClusterStore((state) => state.getLabels);

  const labels = watch(path) as Record<string, string> | undefined;

  // TODO: bug(?): if you add 2 labels with the same key, the first one will be deleted
  // labels are a Record<string, string>, so we need to convert it to an array
  const labelsArray = Object.entries(labels || {});

  // change either the key or the value of a label
  function onChange(
    event: React.ChangeEvent<HTMLInputElement> | string,
    type: "key" | "value",
    key: string
  ) {
    let value;
    if (typeof event === "string") {
      value = event;
    } else {
      value = event.target.value;
    }
    if (type === "value") {
      setValue(`${path}.${key}` as FieldPath<NetworkPolicyFull>, value);
    } else {
      const temp = { ...labels };
      temp[value] = temp[key];
      delete temp[key];
      setValue(path, temp);
    }
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">MatchLabels</h4>
        <NewElementButton
          onClick={() => addLabel(labels || {}, setValue, path)}
        />
      </div>
      <div>
        {labelsArray.map(([key, value], index) => {
          return (
            <div key={index} className="flex gap-2 items-center">
              <div className="grow">
                <InputWithLabel
                  label="key"
                  onChange={(e) => onChange(e, "key", key)}
                  value={key}
                  options={getLabels(LabelSource)}
                />
              </div>
              <div className="grow">
                <InputWithLabel
                  label="value"
                  onChange={(e) => onChange(e, "value", key)}
                  value={value}
                  options={getLabels(LabelSource, key)}
                />
              </div>
              <DeleteElementButton
                onClick={() => removeLabel(labels!, setValue, path, key)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatchLabelsForm;
