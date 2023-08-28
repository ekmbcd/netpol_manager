import { useClusterStore } from "@/store/clusterStore";
import { useFormContext } from "@/utils/form";
import { Autocomplete, TextInput } from "@mantine/core";

function MetadataForm() {
  const { getInputProps } = useFormContext();
  const namespaces = useClusterStore((state) => state.namespaces);

  return (
    <div className="pl-2 border-l-2 border-slate-300 mb-4">
      <h3 className="text-lg font-semibold">Metadata</h3>
      <TextInput
        label="name"
        required
        {...getInputProps("metadata.name")}
        w={260}
      />
      <Autocomplete
        label="namespace"
        required
        {...getInputProps("metadata.namespace")}
        data={namespaces.map((ns) => ns.name)}
        w={260}
      />
    </div>
  );
}

export default MetadataForm;
