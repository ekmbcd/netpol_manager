import routes from "@/api/routes";
import { parseLabels, parsePods } from "@/utils/parser";
import { Edge } from "reactflow";
import { create } from "zustand";
import {
  Namespace,
  NetworkPolicy,
  NetworkPolicyFull,
  PodNetpol,
} from "../types";
import { generateNamespacesColorMap } from "../utils/general";
import { generateClusterEdges } from "../utils/generateNodes";

export enum View {
  CLUSTER = "cluster",
  POD = "pod",
  NETPOL = "netpol",
  NEW_POLICY = "new_policy",
}

// TODO: create smaller stores
type ClusterStore = {
  pods: PodNetpol[];
  namespaces: Namespace[];
  networkPolicies: NetworkPolicy[];
  namespacesColorsMap: Map<string, string>;
  edges: Edge[];
  hoveredNode: string | null;
  connectedNodes: Set<string>;
  selectedPodId: string | null;
  selectedNetpol: NetworkPolicy | null;
  selectedView: View;
  newNetpol: NetworkPolicyFull;
  podLabels: Record<string, string[]>;
  namespaceLabels: Record<string, string[]>;

  setPods: (pods: PodNetpol[]) => void;
  setNamespaces: (namespaces: Namespace[]) => void;
  setNetworkPolicies: (networkPolicies: NetworkPolicy[]) => void;
  setHoveredNode: (nodeId: string | null) => void;
  setSelectedPod: (nodeId: string | null) => void;
  setSelectedNetpol: (netpol: NetworkPolicy | null) => void;
  setSelectedView: (view: View) => void;
  setNewNetpol: (netpol: NetworkPolicyFull) => void;
  getLabels: (origin: "pod" | "namespace", label?: string) => string[];

  getDataFromCluster: () => void;
  postNetpol: () => void;
};

// TODO: divide type in state and actions
export const useClusterStore = create<ClusterStore>()((set, get) => ({
  pods: [],
  namespaces: [],
  networkPolicies: [],
  namespacesColorsMap: new Map(),
  edges: [],
  hoveredNode: null,
  connectedNodes: new Set(),
  selectedPodId: null,
  selectedNetpol: null,
  selectedView: View.NEW_POLICY,
  newNetpol: {
    apiVersion: "networking.k8s.io/v1",
    kind: "NetworkPolicy",
    metadata: {
      name: "",
      namespace: "",
    },
    spec: {
      podSelector: {},
      policyTypes: [],
    },
  },
  podLabels: {},
  namespaceLabels: {},

  setPods: (pods) => set({ pods, edges: generateClusterEdges(pods) }),
  setNamespaces: (namespaces) => {
    const namespacesColorsMap = generateNamespacesColorMap(namespaces);

    set({ namespaces, namespacesColorsMap });
  },
  setNetworkPolicies: (networkPolicies) => set({ networkPolicies }),
  setHoveredNode: (nodeId) => {
    const connectedNodes = new Set<string>();
    if (nodeId) {
      const edges = get().edges;
      for (const edge of edges) {
        if (edge.source === nodeId) {
          connectedNodes.add(edge.target);
        } else if (edge.target === nodeId) {
          connectedNodes.add(edge.source);
        }
      }
    }
    set({ hoveredNode: nodeId, connectedNodes });
  },
  setSelectedPod: (nodeId) => {
    if (nodeId) {
      set({
        selectedPodId: nodeId,
        selectedNetpol: null,
        selectedView: View.POD,
      });
    } else {
      set({ selectedPodId: null, selectedView: View.CLUSTER });
    }
  },
  setSelectedNetpol: (netpol) => {
    const view =
      get().selectedView === View.NEW_POLICY ? View.NEW_POLICY : View.NETPOL;
    if (netpol) {
      set({
        selectedNetpol: netpol,
        selectedPodId: null,
        selectedView: view,
      });
    }
  },
  setSelectedView: (view) => {
    if (view === View.POD) {
      set({ selectedView: view, selectedPodId: get().pods[0]?.uid });
    } else {
      set({ selectedView: view, selectedPodId: null });
    }
  },
  setNewNetpol: (netpol) => set({ newNetpol: netpol }),
  getLabels: (origin, label) => {
    if (!label) {
      return Object.keys(get()[`${origin}Labels`]);
    }
    return get()[`${origin}Labels`][label];
  },

  getDataFromCluster: async () => {
    const [pods, namespaces, netpols] = await Promise.all([
      routes.getPods(),
      routes.getNamespaces(),
      routes.getNetpols(),
    ]);

    set({
      pods: parsePods(pods, netpols, namespaces),
      namespaces,
      networkPolicies: netpols,
      edges: generateClusterEdges(pods),
      namespacesColorsMap: generateNamespacesColorMap(namespaces),
      podLabels: parseLabels(pods),
      namespaceLabels: parseLabels(namespaces),
    });
  },

  postNetpol: async () => {
    const newNetpol = get().newNetpol;
    const response = await routes.postNetpol(newNetpol);
    if (response) {
      get().getDataFromCluster();
    }
  },
}));
