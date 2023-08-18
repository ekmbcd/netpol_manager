import { NetworkPolicyFull } from "@/types";
import { removePort } from "@/utils/form";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import InputWithLabel from "./InputWithLabel";

type PortFormProps = {
  parentIndex: number;
  portIndex: number;
  type: "ingress" | "egress";
};

function PortForm({ parentIndex, portIndex, type }: PortFormProps) {
  const { register, getValues, setValue } = useFormContext<NetworkPolicyFull>();

  return (
    <>
      <InputWithLabel
        label="protocol"
        props={register(
          `spec.${type}.${parentIndex}.ports.${portIndex}.protocol`
        )}
      />
      <InputWithLabel
        label="port"
        type="number"
        props={register(`spec.${type}.${parentIndex}.ports.${portIndex}.port`)}
      />
      <Button
        type="button"
        onClick={() =>
          removePort(getValues, setValue, "ingress", parentIndex, portIndex)
        }
      >
        remove
      </Button>
    </>
  );
}

export default PortForm;
