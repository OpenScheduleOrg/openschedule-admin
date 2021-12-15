import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://10.0.0.115:5000",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

export * from "./auth";
export * from "./cliente";
export * from "./clinica";
export * from "./consulta";
export * from "./horario";
