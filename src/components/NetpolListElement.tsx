import classNames from "classnames";
import { useClusterStore } from "../store/clusterStore";
import { NetworkPolicy } from "../types";

type NetpolListElementProps = {
  netpol: NetworkPolicy;
};

function NetpolListElement({ netpol }: NetpolListElementProps) {
  const setSelected = useClusterStore((state) => state.setSelectedNetpol);
  const selectedNetpol = useClusterStore((state) => state.selectedNetpol);

  const isSelected = selectedNetpol === netpol;

  return (
    <li
      className="m-1 cursor-pointer border-b border-slate-200 hover:bg-cyan-100/20"
      onClick={() => setSelected(netpol)}
    >
      <div
        className={classNames(
          "border-l-4 p-2",
          isSelected && " border-primary"
        )}
      >
        <h2 className="text-lg">{netpol.metadata.name}</h2>
        <p className="text-sm text-slate-800">
          namespace: {netpol.metadata.namespace}
        </p>
      </div>
    </li>
  );
}

export default NetpolListElement;
