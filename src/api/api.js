import axios from "axios";

const api = axios.create({
  baseURL: process.env.HRIS_BACKEND_URL, // Access the URL from .env
});

export default api;
