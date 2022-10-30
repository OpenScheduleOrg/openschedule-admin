import axios, { Axios } from "axios";

const axiosInstance: Axios = axios.create({
  baseURL: process.env.VUE_APP_API_URI,
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
