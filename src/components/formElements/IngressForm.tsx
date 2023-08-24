import { NetworkPolicyFull } from "@/types";
import { addIngressRule } from "@/utils/form";
import { useFormContext } from "react-hook-form";
import NewElementButton from "./NewElementButton";
import PortForm from "./PortForm";
import Separator from "./Separator";

type IngressFormProps = {};

function IngressForm({}: IngressFormProps) {
  const { getValues, setValue, watch } = useFormContext<NetworkPolicyFull>();
  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">Ingress</h4>
        <NewElementButton onClick={() => addIngressRule(getValues, setValue)} />
      </div>
      {watch("spec.ingress") &&
        watch("spec.ingress")!.map((_, index) => (
          <div key={index}>
            <PortForm parentIndex={index} type="ingress" />

            <div className="pl-2 border-l-2 border-slate-300 mb-4">
              <p className="text-sm text-slate-700 mb-1">From</p>
            </div>

            {index !== watch("spec.ingress")!.length - 1 && <Separator />}
          </div>
        ))}
    </div>
  );
}

export default IngressForm;
