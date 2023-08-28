import { XYPosition } from "reactflow";

// ------------- PARSER TYPES ---------------- //
export type OwnerReference = {
  kind: string;
  name: string;
  uid: string;
};

export type PodBase = {
  name: string;
  namespace: string;
  uid: string;
};

export type PodReference = {
  ports?: Port[];
} & (PodBase | IPBlock);

export type Pod = PodBase & {
  labels: Record<string, string>;
  ownerReferences?: OwnerReference[];
};

export type PodNetpol = Pod & {
  ingress?: PodReference[];
  egress?: PodReference[];
};

export type Namespace = {
  name: string;
  labels: Record<string, string>;
};

export type MatchExpression = {
  key: string;
  operator: string;
  values?: string[];
};

export type Selector = {
  matchLabels?: Record<string, string>;
  matchExpressions?: MatchExpression[];
};

export type Port = {
  protocol: string;
  port: number;
  endPort?: number;
};

export type IPBlock = {
  cidr: string;
  except?: string[];
};

export type Policy =
  | {
      podSelector: Selector;
    }
  | {
      ipBlock: IPBlock;
    }
  | NamespaceSelector;

export type NamespaceSelector = {
  namespaceSelector: Selector;
  podSelector?: Selector;
};

export type IngressPolicy = {
  ports?: Port[];
  from: Policy[];
};

export type EgressPolicy = {
  ports?: Port[];
  to: Policy[];
};

export type NetworkPolicy = {
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    podSelector: Selector;
    policyTypes: PolicyType[];
    ingress?: IngressPolicy[];
    egress?: EgressPolicy[];
  };
};

export type NetworkPolicyFull = {
  apiVersion: string;
  kind: string;
} & NetworkPolicy;

export type WithLabels = {
  labels: Record<string, string>;
};

// ------------- FLOW TYPES ---------------- //

export type CustomNode = {
  id: string;
  positionAbsolute: XYPosition;
  width: number;
  height: number;
};

// ------------- ENUMS ---------------- //

export enum PodOrNetpol {
  POD = "Pods",
  NETPOL = "Netpols",
}

export enum Operator {
  In = "In",
  NotIn = "NotIn",
  Exists = "Exists",
  DoesNotExist = "DoesNotExist",
}

export enum PolicyType {
  Ingress = "Ingress",
  Egress = "Egress",
}

export enum SelectorType {
  MatchLabels = "matchLabels",
  MatchExpressions = "matchExpressions",
  Both = "both",
}
