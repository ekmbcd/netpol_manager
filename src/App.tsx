import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import FormCodeSwitcher from "./components/FormCodeSwitcher";
import PodList, { PodOrNetpol } from "./components/PodList";
import TabsButton from "./components/TabsButton";
import ClusterDisplay from "./components/displays/ClusterDisplay";
import NetpolDisplay from "./components/displays/NetpolDisplay";
import PodDisplay from "./components/displays/PodDisplay";
import simpleNamespacesJSON from "./namespaces.json";
import simbleNetpolsJSON from "./netpols.json";
import { View, useClusterStore } from "./store/clusterStore";
import testData from "./test";
import { Namespace, NetworkPolicy, PodNetpol } from "./types";

function App() {
  const setPods = useClusterStore((state) => state.setPods);
  const setNamespaces = useClusterStore((state) => state.setNamespaces);
  const setNetworkPolicies = useClusterStore(
    (state) => state.setNetworkPolicies
  );
  const view = useClusterStore((state) => state.selectedView);
  const setSelectedView = useClusterStore((state) => state.setSelectedView);

  useEffect(() => {
    // TODO: change this to a real API call
    const data = testData as PodNetpol[];
    setPods(data);
    setNamespaces(simpleNamespacesJSON as Namespace[]);
    setNetworkPolicies(simbleNetpolsJSON as unknown as NetworkPolicy[]);
  }, []);

  return (
    <div style={{ height: "750px" }} className="p-2">
      <div className="flex h-full flex-col">
        <div className="flex h-full min-h-0">
          {view === View.CLUSTER && (
            <ReactFlowProvider>
              <ClusterDisplay />
              <PodList initialView={PodOrNetpol.POD} />
            </ReactFlowProvider>
          )}
          {view === View.POD && (
            <ReactFlowProvider>
              <PodDisplay />
              <PodList initialView={PodOrNetpol.POD} />
            </ReactFlowProvider>
          )}
          {view === View.NETPOL && (
            <ReactFlowProvider>
              <NetpolDisplay />
              <PodList initialView={PodOrNetpol.NETPOL} />
            </ReactFlowProvider>
          )}
          {view === View.NEW_POLICY && (
            <ReactFlowProvider>
              <NetpolDisplay />
              <FormCodeSwitcher />
            </ReactFlowProvider>
          )}
        </div>
        <nav
          className="flex items-center justify-center gap-8"
          aria-label="Change view"
        >
          <TabsButton
            value={View.CLUSTER}
            label="Cluster view"
            current={view}
            onClick={setSelectedView}
          />
          <TabsButton
            value={View.POD}
            label="Pod view"
            current={view}
            onClick={setSelectedView}
          />
          <TabsButton
            value={View.NETPOL}
            label="Network Policy view"
            current={view}
            onClick={setSelectedView}
          />
          <TabsButton
            value={View.NEW_POLICY}
            label="New Policy"
            current={view}
            onClick={setSelectedView}
          />
        </nav>
      </div>
    </div>
  );
}

export default App;
