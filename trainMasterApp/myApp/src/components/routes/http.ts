import axios from "axios";
import { Platform } from "react-native";

const HOST_LAN = "192.168.0.10";
const PORT = 7009;
const BASE_DEV =
  Platform.OS === "android"
    ? `http://10.0.2.2:${PORT}/api`
    : `http://${HOST_LAN}:${PORT}/api`;
const BASE_PROD = "https://seu-dominio.com/api";

export const api = axios.create({
  baseURL: __DEV__ ? BASE_DEV : BASE_PROD,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((cfg) => {
  return cfg;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);