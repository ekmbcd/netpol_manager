import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, useReactFlow } from "reactflow";
import { View, useClusterStore } from "../../store/clusterStore";
import { PodReference, PolicyType } from "../../types";
import { generateEdges, generatePodNodes } from "../../utils/generateNodes";
import {
  fillPodEgress,
  fillPodIngress,
  selectPodReferencesFromSelector,
} from "../../utils/parser";
import AllPodsNode from "../flowElements/AllPodsNode";
import ConnectedPodNode from "../flowElements/ConnectedPodNode";
import EdgeWithLabel from "../flowElements/EdgeWithLabel";
import SelectedPodsGroup from "../flowElements/SelectedPodsGroup";

function NetpolDisplay() {
  const selectedView = useClusterStore((state) => state.selectedView);
  const selectedNetpol = useClusterStore((state) => state.selectedNetpol);
  const newNetpol = useClusterStore((state) => state.newNetpol);
  const pods = useClusterStore((state) => state.pods);
  const namespaces = useClusterStore((state) => state.namespaces);
  const setSelected = useClusterStore((state) => state.setSelectedPod);

  const activeNetpol =
    selectedView === View.NEW_POLICY ? newNetpol : selectedNetpol;

  const flowInstance = useReactFlow();

  useEffect(() => {
    if (flowInstance) {
      flowInstance.fitBounds({ x: -600, y: 0, width: 1200, height: 100 });
    }
  }, [activeNetpol]);

  if (!activeNetpol) {
    console.error("No netpol selected - should not happen!");
    return null;
  }

  const nodes: Node[] = [];

  const nodeTypes = useMemo(
    () => ({
      selectedPodsGroup: SelectedPodsGroup,
      connectedPodNode: ConnectedPodNode,
      allPodsNode: AllPodsNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      edgeWithLabel: EdgeWithLabel,
    }),
    []
  );

  // only consider pods in the same namespace as the selected netpol
  const filteredPods = useMemo(() => {
    return pods.filter((pod) => {
      return pod.namespace === activeNetpol.metadata.namespace;
    });
  }, [activeNetpol]);

  const selectedPods = useMemo(() => {
    return selectPodReferencesFromSelector(
      activeNetpol.spec.podSelector,
      filteredPods
    );
  }, [activeNetpol]);

  const selectedPodsGroup = {
    id: "selectedPodsGroup",
    type: "selectedPodsGroup",
    data: { selectedPodsNum: selectedPods.length },
    position: { x: 0, y: -10 },
  };

  const selectedPodsNodes = generatePodNodes(0, selectedPods);

  // TODO: memo left, right and edges together
  const ingressPods = useMemo(() => {
    if (!activeNetpol.spec.policyTypes.includes(PolicyType.Ingress)) {
      return undefined;
    }

    if (!activeNetpol.spec.ingress) {
      return [];
    }

    const ingressPodList: PodReference[] = [];
    fillPodIngress(activeNetpol, ingressPodList, pods, namespaces);

    return ingressPodList;
  }, [activeNetpol]);

  const left = generatePodNodes(-500, ingressPods);

  const egressPods = useMemo(() => {
    if (!activeNetpol.spec.policyTypes.includes(PolicyType.Egress)) {
      return undefined;
    }

    if (!activeNetpol.spec.egress) {
      return [];
    }

    const egressPodList: PodReference[] = [];
    fillPodEgress(activeNetpol, egressPodList, pods, namespaces);

    return egressPodList;
  }, [activeNetpol]);

  const right = generatePodNodes(500, egressPods);

  nodes.push(selectedPodsGroup, ...selectedPodsNodes, ...left, ...right);

  const edges = useMemo(() => {
    return generateEdges(selectedPodsGroup, left, right);
  }, [activeNetpol]);

  return (
    <div className="flex-grow">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        // position nodes from the center of the node
        nodeOrigin={[0.5, 0.5]}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        edgeTypes={edgeTypes}
        // connectionLineComponent={FloatingConnectionLine}
        onNodeClick={(_, node) => {
          setSelected(node.id);
        }}
        // TODO: can we do something with this?
        // onNodesChange={(nodes) => {
        // }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default NetpolDisplay;
