import { useClusterStore } from "../store/clusterStore";
import { NetworkPolicy } from "../types";

type NetpolListElementProps = {
  netpol: NetworkPolicy;
};

function NetpolListElement({ netpol }: NetpolListElementProps) {
  const setSelected = useClusterStore((state) => state.setSelectedNetpol);

  return (
    <li
      className="m-1 cursor-pointer border border-slate-200 p-2 hover:bg-cyan-100  hover:bg-opacity-20"
      onClick={() => setSelected(netpol)}
    >
      <h2 className="text-lg">{netpol.metadata.name}</h2>
      <p className="text-sm text-slate-800">
        namespace: {netpol.metadata.namespace}
      </p>
    </li>
  );
}

export default NetpolListElement;
