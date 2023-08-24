import { NetworkPolicyFull } from "@/types";
import { addPort, removePort } from "@/utils/form";
import { useFormContext } from "react-hook-form";
import InputWithLabel from "./InputWithLabel";
import NewElementButton from "./NewElementButton";

type PortFormProps = {
  parentIndex: number;
  type: "ingress" | "egress";
};

function PortForm({ parentIndex, type }: PortFormProps) {
  const { register, getValues, setValue, watch } =
    useFormContext<NetworkPolicyFull>();

  const ports = watch(`spec.${type}.${parentIndex}.ports`);

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between">
        <p className="text-sm text-slate-700 mb-1">Ports</p>
        <NewElementButton
          onClick={() => addPort(getValues, setValue, "ingress", parentIndex)}
        />
      </div>
      {ports?.map((_, portIndex) => (
        <div key={portIndex} className="flex gap-2 items-center">
          <div className="grow">
            <InputWithLabel
              label="protocol"
              props={register(
                `spec.${type}.${parentIndex}.ports.${portIndex}.protocol`
              )}
            />
          </div>
          <div className="grow">
            <InputWithLabel
              label="port"
              type="number"
              props={register(
                `spec.${type}.${parentIndex}.ports.${portIndex}.port`
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PortForm;
