import { NetworkPolicyFull, PolicyType } from "@/types";
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
      <div className="flex gap-6 py-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ingress-checkbox"
            checked={isSelected(PolicyType.Ingress)}
            onCheckedChange={() => onChange(PolicyType.Ingress)}
          />
          <label
            htmlFor="ingress-checkbox"
            className="text-sm font-medium leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ingress
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="egress-checkbox"
            checked={isSelected(PolicyType.Egress)}
            onCheckedChange={() => onChange(PolicyType.Egress)}
          />
          <label
            htmlFor="egress-checkbox"
            className="text-sm font-medium leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Egress
          </label>
        </div>
      </div>
    </div>
  );
}

export default PolicyTypesForm;
