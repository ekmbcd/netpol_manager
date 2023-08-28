import classNames from "classnames";
import { useClusterStore } from "../store/clusterStore";
import { PodNetpol } from "../types";

type PodListElementProps = {
  pod: PodNetpol;
};

function PodListElement({ pod }: PodListElementProps) {
  const setHovered = useClusterStore((state) => state.setHoveredNode);
  const setSelected = useClusterStore((state) => state.setSelectedPod);
  const selectedPod = useClusterStore((state) => state.selectedPodId);

  const isSelected = selectedPod === pod.uid;

  return (
    <li
      className="m-1 cursor-pointer border-b border-slate-200 hover:bg-cyan-100/20"
      onMouseEnter={() => setHovered(pod.uid)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => setSelected(pod.uid)}
    >
      <div
        className={classNames(
          "border-l-4 p-2",
          isSelected && " border-primary"
        )}
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
      </div>
    </li>
  );
}

export default PodListElement;
