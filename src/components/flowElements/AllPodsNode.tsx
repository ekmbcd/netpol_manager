import { Handle, NodeProps, Position } from "reactflow";

function AllPodsNode({ data }: NodeProps) {
  return (
    <div
      style={{
        border: "2px solid rgba(0,0,0, 0.15)",
        width: "300px",
        backgroundColor: "white",
        height: "100px",
      }}
      className="w-24 rounded-md p-3 grid place-items-center"
    >
      <h3 className="font-semibold whitespace-nowrap overflow-clip text-ellipsis italic">
        {data.label}
      </h3>
      <Handle isConnectable={false} type="source" position={Position.Right} />
      <Handle isConnectable={false} type="target" position={Position.Left} />
    </div>
  );
}

export default AllPodsNode;
