import { useClusterStore } from "@/store/clusterStore";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { NetworkPolicyFull } from "../types";
import { addIngressRule } from "../utils/form";
import IngressForm from "./formElements/IngressForm";
import MatchLabelsForm from "./formElements/MatchLabelsForm";
import MetadataForm from "./formElements/MetadataForm";
import PolicyTypesForm from "./formElements/PolicyTypesForm";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function DynamicForm() {
  const setNewNetpol = useClusterStore((state) => state.setNewNetpol);
  const newNetpol = useClusterStore((state) => state.newNetpol);

  const methods = useForm<NetworkPolicyFull>({
    defaultValues: newNetpol || {
      apiVersion: "networking.k8s.io/v1",
      kind: "NetworkPolicy",
      metadata: {
        name: "",
        namespace: "",
      },
      spec: {
        podSelector: {
          // TODO: maybe remove this?
          matchLabels: {},
        },
        policyTypes: [],
      },
    },
  });

  const watch = methods.watch;

  // update newNetpol in store when form changes
  useEffect(() => {
    const subscription = watch((data) =>
      setNewNetpol(data as NetworkPolicyFull)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <MetadataForm />

        <div className="pl-2 border-l-2 border-slate-300 mb-4">
          <h3 className="text-lg font-semibold">Spec</h3>

          <div className="pl-2 border-l-2 border-slate-300 mb-4">
            <h4 className="font-semibold text-slate-900 pb-2">Pod Selector</h4>
            <MatchLabelsForm />
          </div>

          <PolicyTypesForm />

          <div className="pl-2 border-l-2 border-slate-300 mb-4">
            <h4 className="font-semibold text-slate-900 pb-2">Ingress</h4>
            {watch("spec.ingress") &&
              watch("spec.ingress")!.map((_, index) => (
                <div key={index}>
                  <IngressForm ingressIndex={index} />
                  {index !== watch("spec.ingress")!.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            <Button
              type="button"
              onClick={() =>
                addIngressRule(methods.getValues, methods.setValue)
              }
            >
              add ingress
            </Button>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}

export default DynamicForm;
