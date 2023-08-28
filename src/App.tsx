import { Tabs } from "@mantine/core";
import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import FormCodeSwitcher from "./components/FormCodeSwitcher";
import PodList from "./components/PodList";
import ClusterDisplay from "./components/displays/ClusterDisplay";
import NetpolDisplay from "./components/displays/NetpolDisplay";
import PodDisplay from "./components/displays/PodDisplay";
import { View, useClusterStore } from "./store/clusterStore";
import { PodOrNetpol } from "./types";

function App() {
  const getDataFromCluster = useClusterStore(
    (state) => state.getDataFromCluster
  );
  const view = useClusterStore((state) => state.selectedView);
  const setSelectedView = useClusterStore((state) => state.setSelectedView);

  useEffect(() => {
    getDataFromCluster();
  }, []);

  return (
    <div style={{ height: "750px" }} className="p-2">
      <Tabs
        value={view}
        onChange={setSelectedView}
        inverted
        keepMounted={false}
        className="h-full"
      >
        {/* CLUSTER VIEW */}
        <Tabs.Panel className="flex h-full" value={View.CLUSTER}>
          <ReactFlowProvider>
            <ClusterDisplay />
            <PodList initialView={PodOrNetpol.POD} />
          </ReactFlowProvider>
        </Tabs.Panel>

        {/* POD VIEW */}
        <Tabs.Panel className="flex h-full" value={View.POD}>
          <ReactFlowProvider>
            <PodDisplay />
            <PodList initialView={PodOrNetpol.POD} />
          </ReactFlowProvider>
        </Tabs.Panel>

        {/* NETPOL VIEW */}
        <Tabs.Panel className="flex h-full" value={View.NETPOL}>
          <ReactFlowProvider>
            <NetpolDisplay />
            <PodList initialView={PodOrNetpol.NETPOL} />
          </ReactFlowProvider>
        </Tabs.Panel>

        {/* NEW POLICY VIEW */}
        <Tabs.Panel className="flex h-full" value={View.NEW_POLICY}>
          <ReactFlowProvider>
            <NetpolDisplay />
            <FormCodeSwitcher />
          </ReactFlowProvider>
        </Tabs.Panel>

        <Tabs.List justify="center">
          <Tabs.Tab className="text-base" value={View.CLUSTER}>
            Cluster view
          </Tabs.Tab>

          <Tabs.Tab className="text-base" value={View.POD}>
            Pod view
          </Tabs.Tab>

          <Tabs.Tab className="text-base" value={View.NETPOL}>
            Network Policy view
          </Tabs.Tab>

          <Tabs.Tab className="text-base" value={View.NEW_POLICY}>
            New Policy
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </div>
  );
}

export default App;
