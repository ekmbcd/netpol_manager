import { useClusterStore } from "../store/clusterStore";
import { PodNetpol } from "../types";

type PodListElementProps = {
  pod: PodNetpol;
};

function PodListElement({ pod }: PodListElementProps) {
  const setHovered = useClusterStore((state) => state.setHoveredNode);
  const setSelected = useClusterStore((state) => state.setSelectedPod);

  return (
    <li
      className="m-1 cursor-pointer border border-slate-200 p-2 hover:bg-cyan-100  hover:bg-opacity-20"
      onMouseEnter={() => setHovered(pod.uid)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => setSelected(pod.uid)}
    >
      <h2 className="text-lg">{pod.name}</h2>
      <p className=" text-sm text-slate-800">{pod.uid}</p>
      <p className="text-sm text-slate-800">namespace: {pod.namespace}</p>
      {pod.labels && (
        <ul className="p-2">
          {Object.keys(pod.labels).map((label) => (
            <li className="text-xs text-slate-600" key={label}>
              {`${label}: ${pod.labels[label]}`}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default PodListElement;
