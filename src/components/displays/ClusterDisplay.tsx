import { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import { useClusterStore } from "../../store/clusterStore";
import { generateClusterNodes } from "../../utils/generateNodes";
import PodNode from "../flowElements/ClusterPodNode";
import FloatingEdge from "../flowElements/FloatingEdge";

function ClusterDisplay() {
  const setHovered = useClusterStore((state) => state.setHoveredNode);
  const setSelected = useClusterStore((state) => state.setSelectedPod);
  const pods = useClusterStore((state) => state.pods);
  const edges = useClusterStore((state) => state.edges);

  const nodes = useMemo(() => generateClusterNodes(pods), [pods]);

  const nodeTypes = useMemo(
    () => ({
      podNode: PodNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      floating: FloatingEdge,
    }),
    []
  );

  return (
    <div className="flex-grow p-2">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        // connectionLineComponent={FloatingConnectionLine}
        edgeTypes={edgeTypes}
        onNodeMouseEnter={(_, node) => {
          setHovered(node.id);
        }}
        onNodeMouseLeave={() => {
          setHovered(null);
        }}
        onNodeClick={(_, node) => {
          setSelected(node.id);
        }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default ClusterDisplay;
