import { IPBlock, MatchExpression, Policy, Selector } from "../types";

// type predicates are a type assertion that checks if an object
// has a specific property or set of properties

export function isPodSelector(
  policy: Policy
): policy is { podSelector: Selector } {
  return (policy as { podSelector: Selector }).podSelector !== undefined;
}

export function isIPBlock(policy: Policy): policy is { ipBlock: IPBlock } {
  return (policy as { ipBlock: IPBlock }).ipBlock !== undefined;
}

export function isNamespaceSelector(
  policy: Policy
): policy is { namespaceSelector: Selector } {
  return (
    (policy as { namespaceSelector: Selector }).namespaceSelector !== undefined
  );
}
