import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

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
