import { NetworkPolicyFull, Port } from "@/types";
import { addPort, removePort, useFormContext } from "@/utils/form";
import { Path } from "@/utils/path";
import { NumberInput, Select } from "@mantine/core";
import DeleteElementButton from "./DeleteElementButton";
import NewElementButton from "./NewElementButton";

type PortFormProps = {
  parentIndex: number;
  type: "ingress" | "egress";
};

function PortForm({ parentIndex, type }: PortFormProps) {
  const { getInputProps, setFieldValue } = useFormContext();

  const path: Path<NetworkPolicyFull> = `spec.${type}.${parentIndex}.ports`;

  const ports: Port[] | undefined = getInputProps(path).value;

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between">
        <p className="text-sm text-slate-700 mb-1">Ports</p>
        <NewElementButton onClick={() => addPort(path, setFieldValue, ports)} />
      </div>
      {ports?.map((_, portIndex) => (
        <div key={portIndex} className="flex gap-2 items-center">
          <Select
            required
            className="grow"
            label="protocol"
            {...getInputProps(`${path}.${portIndex}.protocol`)}
            data={["TCP", "UDP"]}
          />
          <NumberInput
            required
            className="grow"
            label="port"
            {...getInputProps(`${path}.${portIndex}.port`)}
          />
          <DeleteElementButton
            onClick={() => removePort(path, portIndex, setFieldValue, ports)}
          />
        </div>
      ))}
    </div>
  );
}

export default PortForm;
