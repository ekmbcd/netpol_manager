import { Handle, NodeProps, Position } from "reactflow";
import { useClusterStore } from "../../store/clusterStore";

function PodNode({ data }: NodeProps) {
  const hoveredNode = useClusterStore((state) => state.hoveredNode);
  const connectedNodes = useClusterStore((state) => state.connectedNodes);
  const namespacesColorsMap = useClusterStore(
    (state) => state.namespacesColorsMap
  );
  const isHovered = hoveredNode === data.uid;

  const isTransparent =
    hoveredNode && !isHovered && !connectedNodes.has(data.uid);

  return (
    <div
      style={{
        width: "90px",
        height: "90px",
        fontSize: "10px",
        borderRadius: "50%",
        border: "2px solid rgba(0,0,0, 0.15)",
        backgroundColor: namespacesColorsMap.get(data.namespace),
        filter: isHovered ? "brightness(120%)" : "brightness(100%)",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        opacity: isTransparent ? 0.1 : 1,
        transition: "all 0.2s ease-in-out",
      }}
      className="no-handles grid place-items-center p-1 text-center"
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      <div>{data.name}</div>
    </div>
  );
}

export default PodNode;
