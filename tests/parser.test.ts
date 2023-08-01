import { describe, expect, it } from "vitest";
import simplePodsJSON from "./test_data/simple/pods.json";
import simpleNetpolsJSON from "./test_data/simple/netpols.json";
import simpleNamespacesJSON from "./test_data/simple/namespaces.json";
import { parsePods } from "../src/utils/parser";
import { Namespace, NetworkPolicy, Pod, PodReference } from "../src/types";
import { isPodBase } from "../src/utils/predicates";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

describe("parse pods, simple mode", () => {
  const parsedPods = parsePods(
    // TODO: why is this not working?
    simplePodsJSON as unknown as Pod[],
    simpleNetpolsJSON as unknown as NetworkPolicy[],
    simpleNamespacesJSON as unknown as Namespace[]
  );
  console.dir(parsedPods, { depth: null });

  if (!parsedPods) {
    throw new Error("parsedPods is undefined");
  }

  it("check pods", () => {
    expect(parsedPods?.length).toBe(simplePodsJSON.length);

    const randomNumber = getRandomInt(parsedPods.length - 1);

    expect(parsedPods[randomNumber].name).toBe(
      simplePodsJSON[randomNumber].name
    );

    expect(parsedPods[randomNumber].namespace).toBe(
      simplePodsJSON[randomNumber].namespace
    );

    expect(parsedPods[randomNumber].uid).toEqual(
      simplePodsJSON[randomNumber].uid
    );

    expect(parsedPods[randomNumber].labels).toEqual(
      simplePodsJSON[randomNumber].labels
    );
  });

  it("check all allowed / none allowed", () => {
    const pod = parsedPods.find((pod) => pod.name === "1-ingress-blocked");

    if (!pod) {
      throw new Error("pod is undefined");
    }

    expect(pod.egress).toBeUndefined();
    expect(pod.ingress).toBeDefined();
    expect(pod.ingress?.length).toBe(0);
  });

  it("check single ingress with podSelector", () => {
    const pod = parsedPods.find((pod) => pod.name === "2-single-ingress");

    if (!pod) {
      throw new Error("pod is undefined");
    }

    expect(pod.egress).toBeUndefined();
    expect(pod.ingress).toBeDefined();
    expect(pod.ingress?.length).toBe(1);
    expect(pod.ingress?.[0]).toEqual({
      name: "1-ingress-blocked",
      namespace: "default",
      uid: "5197e1ae-b007-4d54-8ff4-495b1352f359",
      ports: [
        {
          port: 6379,
          protocol: "TCP",
        },
      ],
    });
  });

  it("check multiple ingress with namespaceSelector and podSelector", () => {
    const pod = parsedPods.find((pod) => pod.name === "3-multiple-ingress");

    if (!pod) {
      throw new Error("pod is undefined");
    }

    expect(pod.egress).toBeUndefined();
    expect(pod.ingress).toBeDefined();

    const externalPods = pod.ingress?.filter((ingress) => {
      if (isPodBase(ingress)) {
        return ingress.namespace !== "default";
      }
      return false;
    });

    expect(externalPods?.length).toBe(1);
    expect((externalPods?.[0] as Pod).name).toEqual("5-external-pod");
    expect((externalPods?.[0] as Pod).namespace).toEqual("test-ns");
    expect((externalPods?.[0] as PodReference).ports).toEqual([
      { port: 6379, protocol: "UDP" },
      { port: 6380, protocol: "TCP" },
    ]);

    const internalPod = pod.ingress?.filter((ingress) => {
      if (isPodBase(ingress)) {
        return ingress.namespace === "default";
      }
      return false;
    });

    expect(internalPod?.length).toBe(3);
    expect((internalPod?.[0] as PodReference).ports).toEqual([
      { port: 6379, protocol: "UDP" },
      { port: 6380, protocol: "TCP" },
    ]);
  });
});
