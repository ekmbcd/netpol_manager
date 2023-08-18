import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { NetworkPolicyFull, PolicyType } from "../types";

// TODO: delete this?
type FormStore = {
  form: NetworkPolicyFull;
  setMetadata: (
    field: keyof NetworkPolicyFull["metadata"],
    value: string
  ) => void;
  setPolicyTypes: (policyTypes: PolicyType[]) => void;
  addIngressRule: () => void;
};

export const useFormStore = create(
  immer<FormStore>((set) => ({
    form: {
      apiVersion: "networking.k8s.io/v1",
      kind: "NetworkPolicy",
      metadata: {
        name: "",
        namespace: "",

        labels: {},
      },
      spec: {
        policyTypes: [],
        podSelector: {
          matchLabels: {},
        },
      },
    },

    setMetadata: (field, value) =>
      set((state) => {
        state.form.metadata[field] = value;
      }),

    setPolicyTypes: (policyTypes) =>
      set((state) => {
        state.form.spec.policyTypes = policyTypes;
      }),
    addIngressRule: () =>
      set((state) => {
        if (!state.form.spec.ingress) {
          state.form.spec.ingress = [];
        }

        state.form.spec.ingress.push({
          from: [],
          ports: [],
        });
        console.log(state.form.spec.ingress);
      }),
  }))
);
