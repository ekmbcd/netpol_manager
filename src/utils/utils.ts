import { PodEdge, PodNode } from "../types";

export function prepareInitialNodes(data: any): PodNode[] {
    const nodes = data.pods;
    let podNodes: PodNode[] = [];
    let i = 0;
    for (const pod of nodes) {
        podNodes.push({
            id: pod.name,
            data: { labels: pod.labels },
            position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 250 }, // set position of nodes in rows of 4
            type: 'podNode'
        });
        i++;
    }
    return podNodes;
}

export function prepareInitialEgress(data: any): PodEdge[] {
    const pods = data.pods;
    let podEdges: PodEdge[] = [];

    for (const pod of pods) {
        for (const egress of pod.egress) {
            podEdges.push({
                id: `${pod.name}-${egress}`,
                source: egress,
                target: pod.name,
                label: `${pod.name} To ${egress}`,
                animated: true,
                style: { stroke: 'red', strokeWidth: 2.5 }
            });
        }
    }
    return podEdges;
}

export function prepareInitialIngress(data: any): PodEdge[] {
    const pods = data.pods;
    let podEdges: PodEdge[] = [];

    for (const pod of pods) {
        for (const ingress of pod.ingress) {
            podEdges.push({
                id: `${ingress}-${pod.name}`,
                source: pod.name,
                target: ingress,
                label: `${ingress} To ${pod.name}`,
                animated: true,
                style: { stroke: 'yellow', strokeWidth: 2 }
            });
        }
    }
    return podEdges;
}

export function prepareInitialEdges(data : any){
    const pods = data.pods;
    let podEdges: PodEdge[] = [];

    for (const pod of pods) {
        for (const egress of pod.egress) {
            if (!podEdges.some(edge => edge.id === `${pod.name}-${egress}`)) {
                podEdges.push({
                    id: `${pod.name}-${egress}`,
                    source: egress,
                    target: pod.name,
                    label: `${pod.name} to ${egress}`,
                    animated: true,
                    style: { stroke: '', strokeWidth: 2.5 }
                });
            }
        }
        for (const ingress of pod.ingress) {
            if (!podEdges.some(edge => edge.id === `${pod.name}-${ingress}`)) {
                podEdges.push({
                    id: `${pod.name}-${ingress}`,
                    source: pod.name,
                    target: ingress,
                    label: `${ingress} to ${pod.name}`,
                    animated: true,
                    style: { stroke: '', strokeWidth: 2 }
                });
            }
        }
    }
    return podEdges;
}

// funzione che verifica che per ogni pod, se nella lista di ingress c'è un pod, verifica che questo pod abbia nella sua lista di egress il pod iniziale, se è così aggiunge l'edge all'array.

export function checkIngressEgress(data: any): PodEdge[] {
    const pods = data.pods;
    let podEdges: PodEdge[] = [];

    for (const pod of pods) {
        for (const ingress of pod.ingress) {
            if (pods.some((pod : any) => pod.name === ingress)) {
                if (pods.some((pod : any) => pod.egress.includes(ingress))) {
                    podEdges.push({
                        id: `${ingress}-${pod.name}`,
                        source: pod.name,
                        target: ingress,
                        label: `${ingress} to ${pod.name}`,
                        animated: true,
                        style: { stroke: '', strokeWidth: 2 }
                    });
                }
            }
        }
    }
    return podEdges;
}