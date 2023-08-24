import { useClusterStore } from "@/store/clusterStore";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { NetworkPolicyFull } from "../types";
import IngressForm from "./formElements/IngressForm";
import MatchLabelsForm from "./formElements/MatchLabelsForm";
import MetadataForm from "./formElements/MetadataForm";
import PolicyTypesForm from "./formElements/PolicyTypesForm";
import SelectorForm from "./formElements/SelectorForm";
import { Button } from "./ui/button";

function DynamicForm() {
  const setNewNetpol = useClusterStore((state) => state.setNewNetpol);
  // const postNetpol = useClusterStore((state) => state.postNetpol);
  const newNetpol = useClusterStore((state) => state.newNetpol);

  const methods = useForm<NetworkPolicyFull>({
    // get starting values from store
    defaultValues: newNetpol || {
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

  const watch = methods.watch;

  // TODO: this causes re-rendering of the whole form, can we avoid it?
  // update newNetpol in store when form changes
  useEffect(() => {
    const subscription = watch((data) =>
      setNewNetpol(data as NetworkPolicyFull)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <MetadataForm />

        <div className="pl-2 border-l-2 border-slate-300 mb-4">
          <h3 className="text-lg font-semibold">Spec</h3>

          <SelectorForm title="Pod Selector" path="spec.podSelector" />
          {/* <MatchLabelsForm
            title="Pod Selector"
            path="spec.podSelector.matchLabels"
          /> */}

          <PolicyTypesForm />

          <IngressForm />
        </div>
        <Button
          type="button"
          onClick={() => {
            console.log(methods.getValues());
          }}
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export default DynamicForm;
