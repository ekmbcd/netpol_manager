import { Port } from "@/types";
import { addPort, removePort, useFormContext } from "@/utils/form";
import { NumberInput, Select } from "@mantine/core";
import DeleteElementButton from "./DeleteElementButton";
import NewElementButton from "./NewElementButton";

type ParentType = "ingress" | "egress";

type PortFormProps = {
  parentIndex: number;
  type: ParentType;
};

function PortForm({ parentIndex, type }: PortFormProps) {
  const { getInputProps, setFieldValue } = useFormContext();

  const path: `spec.${ParentType}.${number}.ports` = `spec.${type}.${parentIndex}.ports`;

  const ports: Port[] | undefined = getInputProps(path).value;

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex justify-between">
        <p className="mb-1 text-sm text-slate-700">Ports</p>
        <NewElementButton onClick={() => addPort(path, setFieldValue, ports)} />
      </div>
      {ports?.map((_, portIndex) => (
        <div key={portIndex} className="flex items-center gap-2">
          <Select
            required
            className="grow"
            label="protocol"
            {...getInputProps(`${path}.${portIndex}.protocol`)}
            data={["TCP", "UDP"]}
            checkIconPosition="right"
          />
          <NumberInput
            required
            className="grow"
            label="port"
            {...getInputProps(`${path}.${portIndex}.port`)}
          />
          <DeleteElementButton
            onClick={() => removePort(path, setFieldValue, ports, portIndex)}
          />
        </div>
      ))}
    </div>
  );
}

export default PortForm;
