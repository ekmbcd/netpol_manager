import { NetworkPolicyFull } from "@/types";
import { addPort } from "@/utils/form";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import PortForm from "./PortForm";

type IngressFormProps = {
  ingressIndex: number;
};

function IngressForm({ ingressIndex }: IngressFormProps) {
  const { getValues, setValue, watch } = useFormContext<NetworkPolicyFull>();
  return (
    <div>
      <div className="pl-2 border-l-2 border-slate-300 mb-4">
        <p className="text-sm text-slate-700 mb-1">Ports</p>
        {watch(`spec.ingress.${ingressIndex}.ports`)?.map((_, index) => (
          <div key={index}>
            <PortForm
              key={index}
              parentIndex={ingressIndex}
              portIndex={index}
              type="ingress"
            />
            {watch(`spec.ingress.${ingressIndex}.ports`)!.length - 1 !==
              index && <Separator className="my-2" />}
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addPort(getValues, setValue, "ingress", ingressIndex)}
        >
          add port
        </Button>
      </div>
      <div className="pl-2 border-l-2 border-slate-300 mb-4">
        <p className="text-sm text-slate-700 mb-1">From</p>
      </div>
    </div>
  );
}

export default IngressForm;
