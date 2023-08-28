import { PolicyType } from "@/types";
import { useFormContext } from "@/utils/form";
import { Checkbox } from "@mantine/core";

function PolicyTypesForm() {
  const form = useFormContext();
  const policyTypes = form.values.spec.policyTypes;

  function isSelected(type: PolicyType) {
    return policyTypes?.includes(type);
  }

  function onChange(type: PolicyType) {
    if (policyTypes?.includes(type)) {
      form.setFieldValue(
        "spec.policyTypes",
        policyTypes.filter((policyType) => policyType !== type)
      );
    } else {
      form.setFieldValue("spec.policyTypes", [...policyTypes, type]);
    }
  }

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <h3 className="font-semibold text-slate-900 pb-2">Policy types</h3>
      <div className="flex gap-6 py-1">
        <Checkbox
          label="Ingress"
          checked={isSelected(PolicyType.Ingress)}
          onChange={() => onChange(PolicyType.Ingress)}
        />

        <Checkbox
          label="Egress"
          checked={isSelected(PolicyType.Egress)}
          onChange={() => onChange(PolicyType.Egress)}
        />
      </div>
    </div>
  );
}

export default PolicyTypesForm;
