import { describe, expect, it } from "vitest";
import podsJSON from "./test_data/simple/pods.json";
import netpolsJSON from "./test_data/simple/netpols.json";
import namespacesJSON from "./test_data/simple/namespaces.json";
import { parsePods } from "../src/utils/parser";
import { Namespace, NetworkPolicy, Pod } from "../src/types";

describe("parse pods", () => {
  it("simple test", () => {
    const parsedPods = parsePods(
      podsJSON as Pod[],
      // TODO: why is this not working?
      netpolsJSON as NetworkPolicy[],
      namespacesJSON as Namespace[]
    );
    console.dir(parsedPods, { depth: null });
    expect(parsedPods).toBeDefined();
  });
});
