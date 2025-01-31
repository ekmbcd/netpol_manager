import {
  IPBlock,
  MatchExpression,
  Namespace,
  NamespaceSelector,
  NetworkPolicy,
  Operator,
  Pod,
  PodBase,
  PodNetpol,
  PodReference,
  Policy,
  PolicyType,
  Port,
  Selector,
  WithLabels,
} from "../types";
import {
  isIPBlock,
  isNamespaceSelector,
  isPodBase,
  isPodSelector,
} from "./predicates";

/*
  - create pods with null ingress and egress

  - for each netpol:
    - find list of pods that match the podSelector
      - check if matchLabels or matchExpressions
    - for each ingress policy:
      - set ports
      - for each policy:
        - understand the type of policy
          - find all pods that match the policy for podSelector
            (filter pods in the same namespace, then labels)
          - find all pods that match the policy for ipBlock
            (understand cidr and except)
          - find all pods that match the policy for namespaceSelector
            (find all pods in namespace with labels)
            (if podSelector is also present, filter by labels)
        - add all pods to ingress
        - same for egress

  - collapse pods into deployments
  - group deployments by namespace
*/

export function parsePods(
  pods: Pod[],
  netpols: NetworkPolicy[],
  namespaces: Namespace[]
) {
  try {
    const parsedPods: PodNetpol[] = pods.map((pod) => {
      const podNetpol: PodNetpol = pod;

      // only consider netpols in the same namespace
      const filteredNetpols = netpols.filter(
        (netpol) => netpol.metadata.namespace === pod.namespace
      );

      // remove self from list of pods
      const filteredPods = removePodsFromList(pods, [pod]);

      for (const netpol of filteredNetpols) {
        // if the pod is not selected, skip
        if (!isPodSelected(netpol.spec.podSelector, pod)) {
          continue;
        }

        // INGRESS
        if (netpol.spec.policyTypes.includes(PolicyType.Ingress)) {
          // if ingress is undefined, all traffic is allowed
          if (!podNetpol.ingress) {
            podNetpol.ingress = [];
          }
          // in this case all traffic is restricted
          if (!netpol.spec.ingress) {
            continue;
          }
          fillPodIngress(netpol, podNetpol.ingress, filteredPods, namespaces);
        }

        // EGRESS (same as ingress)
        if (netpol.spec.policyTypes.includes(PolicyType.Egress)) {
          // if egress is undefined, all traffic is allowed
          if (!podNetpol.egress) {
            podNetpol.egress = [];
          }
          // in this case all traffic is restricted
          if (!netpol.spec.egress) {
            continue;
          }
          fillPodEgress(netpol, podNetpol.egress, filteredPods, namespaces);
        }
      }
      return podNetpol;
    });
    return parsedPods;
  } catch (err) {
    console.error("parse pods fail!", err);
  }
}

// fill connections with all pods that match the selected ingress policy
export function fillPodIngress(
  netpol: NetworkPolicy,
  connections: PodReference[],
  pods: Pod[],
  namespaces: Namespace[]
) {
  // network policies are additive (we add more allowed pods)
  for (const ingressPolicy of netpol.spec.ingress!) {
    // there is an array of policies, we need to check all of them
    for (const policy of ingressPolicy.from) {
      connections.push(
        ...selectPodsFromPolicy(
          policy,
          // remove pods already allowed from the list of pods
          removePodsFromList(pods, [...connections]),
          namespaces,
          netpol.metadata.namespace,
          ingressPolicy.ports
        )
      );
    }
  }
}

export function fillPodEgress(
  netpol: NetworkPolicy,
  connections: PodReference[],
  pods: Pod[],
  namespaces: Namespace[]
) {
  // network policies are additive (we add more allowed pods)
  for (const ingressPolicy of netpol.spec.egress!) {
    // there is an array of policies, we need to check all of them
    for (const policy of ingressPolicy.to) {
      connections.push(
        ...selectPodsFromPolicy(
          policy,
          // remove pods already allowed from the list of pods
          removePodsFromList(pods, [...connections]),
          namespaces,
          netpol.metadata.namespace,
          ingressPolicy.ports
        )
      );
    }
  }
}

function isPodSelected(selector: Selector, pod: Pod) {
  return selectElementsFromSelector(selector, [pod]).length > 0;
}

// returns all selected pods from a policy
export function selectPodsFromPolicy(
  netpol: Policy,
  pods: Pod[],
  namespaces: Namespace[],
  netpolNamespace: string,
  ports?: Port[]
) {
  const selectedPods: PodReference[] = [];

  if (isNamespaceSelector(netpol)) {
    selectedPods.push(
      ...selectPodsFromNamespaceSelector(netpol, pods, namespaces, ports)
    );
  } else if (isPodSelector(netpol)) {
    selectedPods.push(
      ...selectPodReferencesFromSelector(
        netpol.podSelector,
        // only consider pods in the same namespace
        pods.filter((pod) => pod.namespace === netpolNamespace),
        ports
      )
    );
  } else if (isIPBlock(netpol)) {
    selectedPods.push(...selectPodsFromIPBlock(netpol.ipBlock, pods, ports));
  } else {
    console.warn("selectPodsFromPolicy - unknown policy type", netpol);
  }
  return selectedPods;
}

// returns all selected pods from a selector
export function selectPodReferencesFromSelector(
  selector: Selector,
  pods: Pod[],
  ports?: Port[]
) {
  const selectedPods = selectElementsFromSelector(selector, pods);

  return selectedPods.map((pod) => {
    return {
      name: pod.name,
      namespace: pod.namespace,
      uid: pod.uid,
      ports,
    };
  });
}

// returns all selected elements from a selector
function selectElementsFromSelector<T extends WithLabels>(
  selector: Selector,
  elements: T[]
) {
  let selectedElements: T[] | undefined = undefined;

  // all selectors are ANDed together
  if (selector.matchLabels) {
    selectedElements = selectFromLabels(selector.matchLabels, elements);
  }

  if (selector.matchExpressions) {
    // there is an array of expressions, we need to check all of them
    for (const expression of selector.matchExpressions) {
      // first selector, no need to filter
      if (!selectedElements) {
        selectedElements = selectFromExpression(expression, elements);
      } else {
        // filter selected pods
        selectedElements = selectFromExpression(expression, selectedElements);
      }
    }
  }

  // empty selector, all pods are selected
  if (!selectedElements) {
    selectedElements = elements;
  }
  return selectedElements;
}

// returns a list of pods that do not match the list of pods to remove
function removePodsFromList(
  pods: Pod[],
  podsToRemove: PodBase[] | PodReference[]
) {
  return pods.filter((pod) => {
    for (const podToremove of podsToRemove) {
      // need to check if the pod is a PodBase or a IPBlock
      if (isPodBase(podToremove) && podToremove.uid === pod.uid) {
        return false;
      }
    }
    return true;
  });
}

function selectPodsFromIPBlock(ipBlock: IPBlock, pods: Pod[], ports?: Port[]) {
  console.log("selectPodsFromIPBlock", ipBlock, pods, ports);
  // TODO: decide what to do
  // pods ip are ephemeral, so we can't really check if they are in the ip block
  return [];
}

function selectPodsFromNamespaceSelector(
  selector: NamespaceSelector,
  pods: Pod[],
  namespaces: Namespace[],
  ports?: Port[]
) {
  // find all namespaces that match the selector
  const selectedNamespaces = selectElementsFromSelector(
    selector.namespaceSelector,
    namespaces
  );

  // find all pods that are in the selected namespaces
  const selectedPods = pods.filter((pod) => {
    return selectedNamespaces.find(
      (namespace) => namespace.name === pod.namespace
    );
  });

  // if there is a pod selector, filter pods by labels
  if (selector.podSelector) {
    return selectPodReferencesFromSelector(
      selector.podSelector,
      selectedPods,
      ports
    );
  }

  return selectedPods.map((pod) => {
    return {
      name: pod.name,
      namespace: pod.namespace,
      uid: pod.uid,
      ports,
    };
  });
}

function selectFromLabels<T extends WithLabels>(
  labels: Record<string, string>,
  elements: T[]
) {
  return elements.filter((element) => {
    if (!element.labels) {
      return false;
    }
    return Object.entries(labels).every(([key, value]) => {
      return element.labels[key] === value;
    });
  });
}

function selectFromExpression<T extends WithLabels>(
  expression: MatchExpression,
  elements: T[]
) {
  try {
    switch (expression.operator) {
      case Operator.In:
        return elements.filter((element) => {
          return expression.values?.includes(element.labels[expression.key]);
        });
      case Operator.NotIn:
        return elements.filter((element) => {
          return !expression.values?.includes(element.labels[expression.key]);
        });
      case Operator.Exists:
        return elements.filter((element) => {
          return element.labels[expression.key] !== undefined;
        });
      case Operator.DoesNotExist:
        return elements.filter((element) => {
          return element.labels[expression.key] === undefined;
        });
    }
  } catch (e) {
    // TODO: what to do in this case?
    // - namespaceSelector:
    //     matchExpressions:
    //     - key: namespace
    //       operator: In
    //       values: ["frontend", "backend"]
    console.error("selectFromExpression", expression, elements, e);
    return [];
  }
}

export function parseLabels(elements: WithLabels[]) {
  const labels: Record<string, string[]> = {};
  for (const element of elements) {
    if (!element.labels) {
      continue;
    }
    for (const [key, value] of Object.entries(element.labels)) {
      if (!labels[key]) {
        labels[key] = [];
      }
      if (!labels[key].includes(value)) {
        labels[key].push(value);
      }
    }
  }
  return labels;
}
