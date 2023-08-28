import { useClusterStore } from "@/store/clusterStore";
import { FormProvider, useForm } from "@/utils/form";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import IngressForm from "./formElements/IngressForm";
import MetadataForm from "./formElements/MetadataForm";
import PolicyTypesForm from "./formElements/PolicyTypesForm";
import SelectorForm from "./formElements/SelectorForm";

function DynamicForm() {
  const setNewNetpol = useClusterStore((state) => state.setNewNetpol);
  // const postNetpol = useClusterStore((state) => state.postNetpol);
  const newNetpol = useClusterStore((state) => state.newNetpol);

  const form = useForm({
    // get starting values from store
    initialValues: newNetpol || {
      apiVersion: "networking.k8s.io/v1",
      kind: "NetworkPolicy",
      metadata: {
        name: "",
        namespace: "",
      },
      spec: {
        podSelector: {},
        policyTypes: [],
      },
    },
  });

  useEffect(() => {
    setNewNetpol(form.values);
  }, [form.values]);

  return (
    <FormProvider form={form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(form.values);
        }}
      >
        <MetadataForm />

        <div className="pl-2 border-l-2 border-slate-300 mb-4">
          <h3 className="text-lg font-semibold">Spec</h3>

          <SelectorForm title="Pod Selector" path="spec.podSelector" />

          <PolicyTypesForm />

          <IngressForm />
        </div>
        <Button variant="default" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export default DynamicForm;
