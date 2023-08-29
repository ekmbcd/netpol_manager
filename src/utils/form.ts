import {
  EgressPolicy,
  IngressPolicy,
  MatchExpression,
  NamespaceSelector,
  NetworkPolicyFull,
  Operator,
  Policy,
  PolicySelectorType,
  Port,
  SelectorType,
} from "@/types";
import { createFormContext } from "@mantine/form";
import { SetFieldValue } from "node_modules/@mantine/form/lib/types";
import { NetworkPolicyPathExtract } from "./path";

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

export function addEgressRule(
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  egress: EgressPolicy[] = []
) {
  setFieldValue("spec.egress", [
    ...egress,
    {
      to: [],
    },
  ]);
}

export function addPort(
  path: NetworkPolicyPathExtract<`${string}.ports`>,
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
  path: NetworkPolicyPathExtract<`${string}.ports`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  ports: Port[] = [],
  portIndex: number
) {
  setFieldValue(
    path,
    ports.filter((_, index) => index !== portIndex)
  );
}

export function addLabel(
  path: NetworkPolicyPathExtract<`${string}.matchLabels`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  labels: Record<string, string>
) {
  const temp = { ...labels };
  temp[""] = "";
  setFieldValue(path, temp);
}

export function removeLabel(
  path: NetworkPolicyPathExtract<`${string}.matchLabels`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  labels: Record<string, string>,
  key: string
) {
  const temp = { ...labels };
  delete temp[key];
  setFieldValue(path, temp);
}

export function changeSelector(
  path: NetworkPolicyPathExtract<
    `${string}.podSelector` | `${string}.namespaceSelector`
  >,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  selectorType: SelectorType | null
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
    default:
      setFieldValue(path, {});
  }
}

export function changePolicySelector(
  path: NetworkPolicyPathExtract<
    `${string}.from.${number}` | `${string}.to.${number}`
  >,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  selectorType: PolicySelectorType
) {
  switch (selectorType) {
    case PolicySelectorType.PodSelector:
      setFieldValue(path, {
        podSelector: {},
      });
      break;
    // TODO: manage both namespaceSelector and optional podSelector
    case PolicySelectorType.NamespaceSelector:
      setFieldValue(path, {
        namespaceSelector: {},
      });
      break;
    case PolicySelectorType.ipBlock:
      setFieldValue(path, {
        ipBlock: {},
      });
      break;
  }
}

export function addMatchExpression(
  path: NetworkPolicyPathExtract<`${string}.matchExpressions`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  expressions: MatchExpression[]
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
  path: NetworkPolicyPathExtract<`${string}.matchExpressions`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  expressions: MatchExpression[],
  index: number
) {
  setFieldValue(
    path,
    expressions.filter((_, i) => i !== index)
  );
}

export function addPolicy(
  path: NetworkPolicyPathExtract<`${string}.from` | `${string}.to`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  policies: Policy[]
) {
  setFieldValue(path, [
    ...policies,
    {
      podSelector: {},
    },
  ]);
}

export function removePolicy(
  path: NetworkPolicyPathExtract<`${string}.from` | `${string}.to`>,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  policies: Policy[],
  index: number
) {
  setFieldValue(
    path,
    policies.filter((_, i) => i !== index)
  );
}

export function togglePodSelectorToNamespaceSelector(
  path: NetworkPolicyPathExtract<
    `${string}.from.${number}` | `${string}.to.${number}`
  >,
  setFieldValue: SetFieldValue<NetworkPolicyFull>,
  policy: NamespaceSelector,
  value: boolean
) {
  if (value) {
    setFieldValue(`${path}.podSelector`, {});
  } else {
    const temp = { ...policy };
    delete temp.podSelector;
    setFieldValue(`${path}`, temp);
  }
}
