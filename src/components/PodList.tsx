import { PodOrNetpol } from "@/types";
import { Tabs, TextInput } from "@mantine/core";
import { useState } from "react";
import { useClusterStore } from "../store/clusterStore";
import NetpolListElement from "./NetpolListElement";
import PodListElement from "./PodListElement";

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
    <Tabs
      value={view}
      onChange={(e) => setView(e as PodOrNetpol)}
      className="flex max-h-full w-4/12 max-w-sm flex-col"
    >
      <Tabs.List
        justify="center"
        // TODO: hack for mantine bug, remove when fixed
        className="before:!bottom-0"
      >
        <Tabs.Tab value={PodOrNetpol.POD}>Pods</Tabs.Tab>
        <Tabs.Tab value={PodOrNetpol.NETPOL}>Netpols</Tabs.Tab>
      </Tabs.List>

      <TextInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="py-2"
        placeholder="Search..."
      />

      <Tabs.Panel
        value={PodOrNetpol.POD}
        className="h-full overflow-auto border-slate-300"
      >
        <ul>
          {filteredPods.map((pod, index) => (
            <PodListElement pod={pod} key={index} />
          ))}
        </ul>
      </Tabs.Panel>

      <Tabs.Panel
        value={PodOrNetpol.NETPOL}
        className="h-full overflow-auto border-slate-300"
      >
        <ul>
          {filteredNetpols.map((netpol, index) => (
            <NetpolListElement netpol={netpol} key={index} />
          ))}
        </ul>
      </Tabs.Panel>
    </Tabs>
  );
}

export default PodList;
