import axios from "axios";

const baseURL = `${process.env.REACT_APP_HRIS_BACKEND_URL}/${process.env.REACT_APP_API_VERSION}`;

const api = axios.create({
  baseURL,
  // You can add default headers here if needed
  // headers: { 'Content-Type': 'application/json' },
});

export default api;
