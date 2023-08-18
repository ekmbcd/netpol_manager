import { NetworkPolicyFull, PolicyType } from "@/types";
import { Label } from "@radix-ui/react-label";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

function PolicyTypesForm() {
  const { watch, setValue } = useFormContext<NetworkPolicyFull>();

  function isSelected(type: PolicyType) {
    const policyTypes = watch("spec.policyTypes");
    return policyTypes?.includes(type);
  }

  function onChange(type: PolicyType) {
    const policyTypes = watch("spec.policyTypes");
    if (policyTypes?.includes(type)) {
      setValue(
        "spec.policyTypes",
        policyTypes.filter((policyType) => policyType !== type)
      );
    } else {
      setValue("spec.policyTypes", [...policyTypes, type]);
    }
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <h3 className="font-semibold text-slate-900 pb-2">Policy types</h3>
      <div className="p-2">
        <Label className="mr-4 cursor-pointer">
          <Checkbox
            className="mr-1"
            checked={isSelected(PolicyType.Ingress)}
            onCheckedChange={() => onChange(PolicyType.Ingress)}
          />
          Ingress
        </Label>

        <Label className="cursor-pointer">
          <Checkbox
            className="mr-1"
            checked={isSelected(PolicyType.Egress)}
            onCheckedChange={() => onChange(PolicyType.Egress)}
          />
          Egress
        </Label>
      </div>
    </div>
  );
}

export default PolicyTypesForm;
