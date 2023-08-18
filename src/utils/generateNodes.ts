import { Edge, Node } from "reactflow";
import { PodNetpol, PodReference, Port } from "../types";
import { isPodBase } from "../utils/predicates";
import { isConnected } from "./general";

enum Colors {
  green = "green",
  blue = "blue",
}

export function generateClusterEdges(pods: PodNetpol[]) {
  const podEdges: Edge[] = [];

  for (const source of pods) {
    for (const target of pods) {
      if (source.uid === target.uid) {
        continue;
      }
      if (
        isConnected(source.uid, target.ingress) &&
        isConnected(target.uid, source.egress)
      ) {
        podEdges.push({
          id: `${source.uid}-${target.uid}`,
          source: source.uid,
          target: target.uid,
          type: "floating",
          animated: true,
        });
      }
    }
  }

  return podEdges;
}

export function generateClusterNodes(data: PodNetpol[]) {
  const nodesNum = data.length;

  const nodes = [];
  for (let i = 0; i < nodesNum; i++) {
    nodes.push({
      id: data[i].uid,
      data: {
        name: data[i].name,
        uid: data[i].uid,
        namespace: data[i].namespace,
      },
      // position nodes in circle
      position: {
        x: Math.cos((i / nodesNum) * 2 * Math.PI - Math.PI / 2) * 30 * nodesNum,
        y: Math.sin((i / nodesNum) * 2 * Math.PI - Math.PI / 2) * 30 * nodesNum,
      },
      type: "podNode",
    });
  }
  return nodes;
}

export function generatePodNodes(x: number, podReferences?: PodReference[]) {
  if (!podReferences)
    return [
      {
        id: x > 0 ? "all-pods-egress" : "all-pods-ingress",
        data: {
          label: "All pods (*)",
          ports: getPortsLabel(undefined),
        },
        position: { x: x, y: 0 },
        type: "allPodsNode",
      },
    ];

  let suffix = "";
  if (x > 0) {
    suffix = "-egress";
  } else if (x < 0) {
    suffix = "-ingress";
  }

  return (
    podReferences.map((podRef, index) => {
      const y = index * 80 - (podReferences.length - 1) * 40;
      if (isPodBase(podRef)) {
        return {
          id: `${podRef.uid}${suffix}`,
          data: {
            label: podRef.name,
            namespace: podRef.namespace,
            ports: getPortsLabel(podRef.ports),
          },
          position: { x: x, y: y },
          type: "connectedPodNode",
        };
      } else {
        // TODO: manage cidr
        return {
          id: `${podRef.cidr}${suffix}`,
          data: {
            label: podRef.cidr,
            ports: getPortsLabel(podRef.ports),
          },
          position: { x: x, y: y },
          type: "connectedPodNode",
        };
      }
    }) || []
  );
}

// transforms a list of ports into a string
function getPortsLabel(ports: Port[] | undefined) {
  if (!ports) return "All ports (*)";
  return ports.reduce((acc, port) => {
    return `${acc} ${port.protocol}:${port.port}`;
  }, "");
}

export function generateEdges(center: Node, left: Node[], right: Node[]) {
  const edges: Edge[] = [];

  for (const node of left) {
    edges.push(createEdge(node.id, center.id, Colors.green, node.data.ports));
  }

  for (const node of right) {
    edges.push(createEdge(center.id, node.id, Colors.blue, node.data.ports));
  }

  return edges;
}

function createEdge(
  source: string,
  target: string,
  color: Colors,
  label?: string
) {
  return {
    id: `${source}-${target}`,
    source: source,
    target: target,
    animated: true,
    style: { stroke: color, strokeWidth: "2" },
    label: label,
    type: "edgeWithLabel",
  };
}
