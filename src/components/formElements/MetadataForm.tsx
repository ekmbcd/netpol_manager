import { NetworkPolicyFull } from "@/types";
import { useFormContext } from "react-hook-form";
import InputWithLabel from "./InputWithLabel";

function MetadataForm() {
  const { register } = useFormContext<NetworkPolicyFull>();

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <h3 className="text-lg font-semibold">Metadata</h3>
      <InputWithLabel label="name" props={register("metadata.name")} />
      <InputWithLabel
        label="namespace"
        props={register("metadata.namespace")}
      />
    </div>
  );
}

export default MetadataForm;
