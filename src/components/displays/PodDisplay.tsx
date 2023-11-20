import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, useReactFlow } from "reactflow";
import { useClusterStore } from "../../store/clusterStore";
import { generateEdges, generatePodNodes } from "../../utils/generateNodes";
import AllPodsNode from "../flowElements/AllPodsNode";
import ConnectedPodNode from "../flowElements/ConnectedPodNode";
import EdgeWithLabel from "../flowElements/EdgeWithLabel";
import SelectedPodNode from "../flowElements/SelectedPodNode";

function PodDisplay() {
  const selectedPod = useClusterStore((state) => state.selectedPodId);
  const pods = useClusterStore((state) => state.pods);
  const setSelected = useClusterStore((state) => state.setSelectedPod);

  const flowInstance = useReactFlow();

  useEffect(() => {
    if (flowInstance) {
      flowInstance.fitBounds({ x: -600, y: 0, width: 1200, height: 100 });
    }
  }, [selectedPod]);

  const nodes: Node[] = [];

  const nodeTypes = useMemo(
    () => ({
      selectedPodNode: SelectedPodNode,
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

  const selectedPodObj = pods.find((pod) => pod.uid === selectedPod);

  const selectedNode = {
    id: selectedPod || "null",
    type: "selectedPodNode",
    data: selectedPodObj,
    position: { x: 0, y: 0 },
  };

  const left = generatePodNodes(-460, selectedPodObj?.ingress);
  const right = generatePodNodes(460, selectedPodObj?.egress);

  nodes.push(selectedNode!, ...left, ...right);

  const edges = useMemo(() => {
    if (!selectedNode) {
      return [];
    }
    return generateEdges(selectedNode, left, right);
  }, [selectedPodObj]);

  if (!selectedPod) {
    console.error("No pod selected - should not happen!");
    return null;
  }
  if (!selectedPodObj) {
    console.error("No pod selected - should not happen!");
    return null;
  }

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

export default PodDisplay;
