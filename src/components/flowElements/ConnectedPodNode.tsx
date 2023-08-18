import { Handle, NodeProps, Position } from "reactflow";
import { useClusterStore } from "../../store/clusterStore";

function ConnectedPodNode({ data }: NodeProps) {
  const namespacesColorsMap = useClusterStore(
    (state) => state.namespacesColorsMap
  );
  return (
    <div
      style={{
        border: "2px solid rgba(0,0,0, 0.15)",
        width: "300px",
        backgroundColor: namespacesColorsMap.get(data.namespace) || "white",
      }}
      className="w-24 rounded-md p-3"
    >
      <h3 className="font-semibold whitespace-nowrap overflow-clip text-ellipsis">
        {data.label}
      </h3>
      <Handle isConnectable={false} type="source" position={Position.Right} />
      <Handle isConnectable={false} type="target" position={Position.Left} />
    </div>
  );
}

export default ConnectedPodNode;
