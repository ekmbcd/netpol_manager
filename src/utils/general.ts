import { Namespace, PodReference } from "../types";
import { isPodBase } from "./predicates";

export function isConnected(uid: string, list?: PodReference[]) {
  if (!list) {
    return true;
  }

  for (const item of list) {
    if (isPodBase(item) && item.uid === uid) {
      return true;
    }
  }
  return false;
}

// generate colors for each namespace
export function generateNamespacesColorMap(namespaces: Namespace[]) {
  const step = 360 / namespaces.length;

  return new Map(
    namespaces.map((namespace, i) => {
      const hue = i * step;
      const saturation = 70; // Adjust saturation as needed
      const lightness = 85; // Adjust lightness as needed

      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      return [namespace.name, color];
    })
  );
}
