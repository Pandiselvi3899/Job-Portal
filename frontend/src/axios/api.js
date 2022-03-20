import axios from "axios";
const api = axios.create();
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      window.location.href = "/logout";
    } else {
      return Promise.reject(err);
    }
  }
);
export default api;
