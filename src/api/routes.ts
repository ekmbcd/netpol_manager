import { Namespace, NetworkPolicy, Pod } from "@/types";
import { api } from "./axios";

const routes = {
  async getPods(): Promise<Pod[]> {
    const response = await api.get("/api/v1/pod");
    return response.data;
  },

  // TODO: return full network policy from be
  async getNetpols(): Promise<NetworkPolicy[]> {
    const response = await api.get("/api/v1/netpol");
    return response.data;
  },

  async getNamespaces(): Promise<Namespace[]> {
    const response = await api.get("/api/v1/namespace");
    return response.data;
  },

  // TODO: what does this api return?
  async postNetpol(netpol: NetworkPolicy) {
    const response = await api.post("/api/v1/netpol", netpol);
    return response.data;
  },
};

export default routes;
