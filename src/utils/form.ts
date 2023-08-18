import { NetworkPolicyFull } from "@/types";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

// TODO: delete this?
export function addIngressRule(
  getValues: UseFormGetValues<NetworkPolicyFull>,
  setValue: UseFormSetValue<NetworkPolicyFull>
) {
  setValue("spec.ingress", [
    ...(getValues("spec.ingress") || []),
    {
      from: [],
      ports: [],
    },
  ]);
}

export function addPort(
  getValues: UseFormGetValues<NetworkPolicyFull>,
  setValue: UseFormSetValue<NetworkPolicyFull>,
  type: "ingress" | "egress",
  parentIndex: number
) {
  setValue(`spec.${type}.${parentIndex}.ports`, [
    ...(getValues(`spec.${type}.${parentIndex}.ports`) || []),
    {
      port: 0,
      protocol: "",
    },
  ]);
}

export function removePort(
  getValues: UseFormGetValues<NetworkPolicyFull>,
  setValue: UseFormSetValue<NetworkPolicyFull>,
  type: "ingress" | "egress",
  parentIndex: number,
  portIndex: number
) {
  console.log("before", getValues(`spec.${type}.${parentIndex}.ports`));
  setValue(
    `spec.${type}.${parentIndex}.ports`,
    (getValues(`spec.${type}.${parentIndex}.ports`) || []).filter(
      (_, index) => index !== portIndex
    )
  );
  console.log("after", getValues(`spec.${type}.${parentIndex}.ports`));
}
