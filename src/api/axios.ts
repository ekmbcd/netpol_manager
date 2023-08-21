import axios from "axios";

export const api = axios.create({
  // TODO: change this
  baseURL: "http://localhost:8001",
  timeout: 5000, // Timeout 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
