import { PolicyType } from "@/types";
import { addEgressRule, useFormContext } from "@/utils/form";
import { Divider } from "@mantine/core";
import NewElementButton from "./NewElementButton";
import PoliciesForm from "./PoliciesForm";
import PortForm from "./PortForm";

function EgressForm() {
  const { values, setFieldValue } = useFormContext();

  if (!values.spec.policyTypes.includes(PolicyType.Egress)) {
    return null;
  }

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">Egress</h4>
        <NewElementButton
          onClick={() => addEgressRule(setFieldValue, values.spec.egress)}
        />
      </div>
      {values.spec.egress &&
        values.spec.egress.map((_, index) => (
          <div key={index}>
            <PortForm parentIndex={index} type="egress" />

            <PoliciesForm title="To" path={`spec.egress.${index}.to`} />

            {index !== values.spec.egress!.length - 1 && <Divider my="md" />}
          </div>
        ))}
    </div>
  );
}

export default EgressForm;
