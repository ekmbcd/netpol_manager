import { useFormContext } from "@/utils/form";
import { NetworkPolicyPathExtract } from "@/utils/path";
import { TagsInput, TextInput } from "@mantine/core";

type IpBlockFormProps = {
  path: NetworkPolicyPathExtract<`${string}.ipBlock`>;
};

function IpBlockForm({ path }: IpBlockFormProps) {
  const { getInputProps } = useFormContext();

  return (
    <div className="mb-4 border-l-2 border-slate-300 pl-2">
      <div className="flex justify-between pb-2">
        <h4 className="font-semibold text-slate-900">IpBlock</h4>
      </div>
      <TextInput label="cidr" {...getInputProps(`${path}.cidr`)} required />
      <TagsInput label="except" {...getInputProps(`${path}.except`)} />
    </div>
  );
}

export default IpBlockForm;
