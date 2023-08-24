import { NetworkPolicyFull } from "@/types";
import { Controller, useFormContext } from "react-hook-form";
import InputWithLabel from "./InputWithLabel";

function MetadataForm() {
  const { control } = useFormContext<NetworkPolicyFull>();

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <h3 className="text-lg font-semibold">Metadata</h3>
      <Controller
        name="metadata.name"
        control={control}
        render={({ field }) => <InputWithLabel label="name" {...field} />}
      />
      <Controller
        name="metadata.namespace"
        control={control}
        render={({ field }) => (
          <InputWithLabel label="namespace" options={[]} {...field} />
        )}
      />
    </div>
  );
}

export default MetadataForm;
