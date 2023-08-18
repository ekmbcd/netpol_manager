import { useState } from "react";
import { useClusterStore } from "../store/clusterStore";
import NetpolListElement from "./NetpolListElement";
import PodListElement from "./PodListElement";
import TabsButton from "./TabsButton";

export enum PodOrNetpol {
  POD = "Pods",
  NETPOL = "Netpols",
}

type PodListProps = {
  initialView: PodOrNetpol;
};

function PodList({ initialView }: PodListProps) {
  const netpols = useClusterStore((state) => state.networkPolicies);
  const pods = useClusterStore((state) => state.pods);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<PodOrNetpol>(initialView);

  const filteredPods = pods.filter((pod) =>
    pod.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredNetpols = netpols.filter((netpol) =>
    netpol.metadata.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex max-h-full w-4/12 flex-col p-4 pr-0 max-w-sm">
      <div
        className="flex items-center justify-center gap-8"
        aria-label="Change view"
      >
        <TabsButton
          value={PodOrNetpol.POD}
          label="Pods"
          current={view}
          onClick={setView}
        />
        <TabsButton
          value={PodOrNetpol.NETPOL}
          label="Netpols"
          current={view}
          onClick={setView}
        />
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 p-2"
        placeholder="Search..."
      />

      <ul className="h-full overflow-auto border border-slate-300">
        {view === PodOrNetpol.POD
          ? filteredPods.map((pod, index) => (
              <PodListElement pod={pod} key={index} />
            ))
          : filteredNetpols.map((netpol, index) => (
              <NetpolListElement netpol={netpol} key={index} />
            ))}
      </ul>
    </div>
  );
}

export default PodList;
