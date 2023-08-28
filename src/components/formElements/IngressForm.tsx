import { PolicyType } from "@/types";
import { addIngressRule, useFormContext } from "@/utils/form";
import { Divider } from "@mantine/core";
import NewElementButton from "./NewElementButton";
import PoliciesForm from "./PoliciesForm";
import PortForm from "./PortForm";

type IngressFormProps = {};

function IngressForm({}: IngressFormProps) {
  const { values, setFieldValue } = useFormContext();

  if (!values.spec.policyTypes.includes(PolicyType.Ingress)) {
    return null;
  }

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">Ingress</h4>
        <NewElementButton
          onClick={() => addIngressRule(setFieldValue, values.spec.ingress)}
        />
      </div>
      {values.spec.ingress &&
        values.spec.ingress.map((_, index) => (
          <div key={index}>
            <PortForm parentIndex={index} type="ingress" />

            <PoliciesForm title="From" path={`spec.ingress.${index}.from`} />

            {index !== values.spec.ingress!.length - 1 && <Divider my="md" />}
          </div>
        ))}
    </div>
  );
}

export default IngressForm;
