import { Handle, NodeProps, Position } from "reactflow";

function SelectedPodsGroup({ data }: NodeProps) {
  return (
    <div
      style={{
        width: "380px",
        border: "2px solid rgba(0,0,0, 0.15)",
        backgroundColor: "white",
        height: `${data.selectedPodsNum * 80 + 60}px`,
      }}
      className="w-24 rounded-md p-3"
    >
      <h3 className="text-xl font-bold">SELECTED PODS</h3>
      <Handle isConnectable={false} type="target" position={Position.Left} />
      <Handle isConnectable={false} type="source" position={Position.Right} />
    </div>
  );
}

export default SelectedPodsGroup;
