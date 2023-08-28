import {
  IngressPolicy,
  MatchExpression,
  NetworkPolicyFull,
  Operator,
  Port,
  SelectorType,
} from "@/types";
import { createFormContext } from "@mantine/form";
import { SetFieldValue } from "node_modules/@mantine/form/lib/types";
import { Path } from "./path";

export const [FormProvider, useFormContext, useForm] =
  createFormContext<NetworkPolicyFull>();

export function addIngressRule(
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  ingress: IngressPolicy[] = []
) {
  setFieldValue("spec.ingress", [
    ...ingress,
    {
      from: [],
    },
  ]);
}

export function addPort(
  path: Path<NetworkPolicyFull>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  ports: Port[] = []
) {
  setFieldValue(path, [
    ...ports,
    {
      port: 0,
      protocol: "",
    },
  ]);
}

export function removePort(
  path: Path<NetworkPolicyFull>,
  portIndex: number,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  ports: Port[] = []
) {
  setFieldValue(
    path,
    ports.filter((_, index) => index !== portIndex)
  );
}

export function addLabel(
  labels: Record<string, string>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  path: Path<NetworkPolicyFull>
) {
  const temp = { ...labels };
  temp[""] = "";
  setFieldValue(path, temp);
}

export function removeLabel(
  labels: Record<string, string>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  path: Path<NetworkPolicyFull>,
  key: string
) {
  const temp = { ...labels };
  delete temp[key];
  setFieldValue(path, temp);
}

export function changeSelector(
  selectorType: SelectorType,
  path: Path<NetworkPolicyFull>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>
) {
  switch (selectorType) {
    case SelectorType.MatchLabels:
      setFieldValue(path, {
        matchLabels: {},
      });
      break;
    case SelectorType.MatchExpressions:
      setFieldValue(path, {
        matchExpressions: [],
      });
      break;
    case SelectorType.Both:
      setFieldValue(path, {
        matchLabels: {},
        matchExpressions: [],
      });
      break;
  }
}

export function addMatchExpression(
  expressions: MatchExpression[],
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  path: Path<NetworkPolicyFull>
) {
  setFieldValue(path, [
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
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  path: Path<NetworkPolicyFull>,
  index: number
) {
  setFieldValue(
    path,
    expressions.filter((_, i) => i !== index)
  );
}
