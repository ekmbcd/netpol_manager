import { Handle, NodeProps, Position } from "reactflow";
import { useClusterStore } from "../../store/clusterStore";

function SelectedPodNode({ data }: NodeProps) {
  const namespacesColorsMap = useClusterStore(
    (state) => state.namespacesColorsMap
  );

  return (
    <div
      style={{
        width: "360px",
        border: "2px solid rgba(0,0,0, 0.15)",
        backgroundColor: namespacesColorsMap.get(data.namespace),
      }}
      className="w-24 rounded-md p-3"
    >
      <h3 className="text-lg font-semibold">{data.name}</h3>
      <p className="text-sm text-slate-800">{data.uid}</p>
      <p className="text-sm text-slate-800">namespace: {data.namespace}</p>
      {data.labels && (
        <ul className="p-2">
          {Object.keys(data.labels).map((label) => (
            <li className="text-xs text-slate-600" key={label}>
              {`${label}: ${data.labels[label]}`}
            </li>
          ))}
        </ul>
      )}
      {/* {ingressPorts.map((port, index) => (
        <>
          <Handle
            isConnectable={false}
            type="target"
            position={Position.Left}
            key={index}
            style={{
              top: `${index * 30 + 30}px`,
            }}
          >
            <div
              className="absolute text-xs text-slate-600"
              style={{
                bottom: 4,
                right: 4,
              }}
            >{`${port.protocol}:${port.port}`}</div>
          </Handle>
        </>
      ))} */}
      <Handle isConnectable={false} type="target" position={Position.Left} />
      <Handle isConnectable={false} type="source" position={Position.Right} />
    </div>
  );
}

export default SelectedPodNode;
