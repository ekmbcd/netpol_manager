import { useClusterStore } from "@/store/clusterStore";
import { NetworkPolicyFull } from "@/types";
import { addLabel, removeLabel, useFormContext } from "@/utils/form";
import { Path } from "@/utils/path";
import { Autocomplete } from "@mantine/core";
import DeleteElementButton from "./DeleteElementButton";
import NewElementButton from "./NewElementButton";

type MatchLabelsFormProps = {
  path: Path<NetworkPolicyFull>;
  LabelSource?: "pod" | "namespace";
};

function MatchLabelsForm({ path, LabelSource = "pod" }: MatchLabelsFormProps) {
  const { getInputProps, setFieldValue } = useFormContext();
  const getLabels = useClusterStore((state) => state.getLabels);

  const labels: Record<string, string> | undefined = getInputProps(path).value;

  // TODO: bug(?): if you add 2 labels with the same key, the first one will be deleted
  // labels are a Record<string, string>, so we need to convert it to an array
  const labelsArray = Object.entries(labels || {});

  // TODO: this breaks when key has a dot in it (e.g. "app.kubernetes.io/name")
  // change either the key or the value of a label
  function onChange(value: string, type: "key" | "value", key: string) {
    console.log(value, type, key);
    if (type === "value") {
      setFieldValue(`${path}.${key}`, value);
    } else {
      const temp = { ...labels };
      temp[value] = temp[key];
      delete temp[key];
      setFieldValue(path, temp);
    }
  }

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">MatchLabels</h4>
        <NewElementButton
          onClick={() => addLabel(labels || {}, setFieldValue, path)}
        />
      </div>
      <div>
        {labelsArray.map(([key, value], index) => {
          return (
            <div key={index} className="mb-2 flex items-center gap-2">
              <Autocomplete
                required
                className="grow"
                label="key"
                onChange={(e) => onChange(e, "key", key)}
                value={key}
                data={getLabels(LabelSource)}
              />

              <Autocomplete
                required
                className="grow"
                label="value"
                onChange={(e) => onChange(e, "value", key)}
                value={value}
                data={getLabels(LabelSource, key)}
              />

              <DeleteElementButton
                onClick={() => removeLabel(labels!, setFieldValue, path, key)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatchLabelsForm;
