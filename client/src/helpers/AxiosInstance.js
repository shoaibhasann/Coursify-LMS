import axios from "axios";

const server = import.meta.env.VITE_SERVER_URL

const BASE_URL = `${server}/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    common: {
      "Content-Type": "application/json", // Set the default content type to JSON
    },
  },
});

export default axiosInstance;
