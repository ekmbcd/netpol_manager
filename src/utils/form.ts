import {
  MatchExpression,
  NetworkPolicyFull,
  Operator,
  SelectorType,
} from "@/types";
import { FieldPath, UseFormGetValues, UseFormSetValue } from "react-hook-form";

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
  setValue(
    `spec.${type}.${parentIndex}.ports`,
    (getValues(`spec.${type}.${parentIndex}.ports`) || []).filter(
      (_, index) => index !== portIndex
    )
  );
}

export function addLabel(
  labels: Record<string, string>,
  setValue: UseFormSetValue<NetworkPolicyFull>,
  path: FieldPath<NetworkPolicyFull>
) {
  const temp = { ...labels };
  temp[""] = "";
  setValue(path, temp);
}

export function removeLabel(
  labels: Record<string, string>,
  setValue: UseFormSetValue<NetworkPolicyFull>,
  path: FieldPath<NetworkPolicyFull>,
  key: string
) {
  const temp = { ...labels };
  delete temp[key];
  setValue(path, temp);
}

export function changeSelector(
  selectorType: SelectorType,
  path: FieldPath<NetworkPolicyFull>,
  setValue: UseFormSetValue<NetworkPolicyFull>
) {
  if (selectorType === SelectorType.MatchLabels) {
    setValue(path, {
      matchLabels: {},
    });
  } else {
    setValue(path, {
      matchExpressions: [],
    });
  }
}

export function addMatchExpression(
  expressions: MatchExpression[],
  setValue: UseFormSetValue<NetworkPolicyFull>,
  path: FieldPath<NetworkPolicyFull>
) {
  setValue(path, [
    ...expressions,
    {
      key: "",
      operator: Operator.In,
      values: [],
    },
  ]);
}

export function removeMatchExpression(
  expressions: MatchExpression[],
  setValue: UseFormSetValue<NetworkPolicyFull>,
  path: FieldPath<NetworkPolicyFull>,
  index: number
) {
  setValue(
    path,
    expressions.filter((_, i) => i !== index)
  );
}
