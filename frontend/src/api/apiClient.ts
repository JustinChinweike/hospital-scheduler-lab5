


// src/api/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json", // keep this for GET/DELETE
  },
});
