import { Policy } from "@/types";
import { addPolicy, useFormContext } from "@/utils/form";
import { NetworkPolicyPathExtract } from "@/utils/path";
import NewElementButton from "./NewElementButton";
import PolicySelectorForm from "./PolicySelectorForm";

type PoliciesFormProps = {
  title: string;
  path: NetworkPolicyPathExtract<`${string}.from` | `${string}.to`>;
};

function PoliciesForm({ title, path }: PoliciesFormProps) {
  const { setFieldValue, getInputProps } = useFormContext();

  const policies: Policy[] = getInputProps(path).value;

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex items-center justify-between pb-2">
        <h4 className="font-semibold text-slate-900">{title}</h4>

        <NewElementButton
          onClick={() => addPolicy(path, setFieldValue, policies)}
        />
      </div>
      {policies.map((_, index) => (
        <PolicySelectorForm index={index} path={path} key={index} />
      ))}
    </div>
  );
}

export default PoliciesForm;
