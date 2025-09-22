import axios from "axios";
import Cookies from "js-cookie";
import store from "./store";
import { logoutHandler } from "./util";
export const baseURLImage = "https://shgapi.aladdinapps.com/";
// export const baseURLImage = "https://api.shghealth.com/";

const API = axios.create({
  baseURL: "https://shgapi.aladdinapps.com/",
  // baseURL: "https://api.shghealth.com/",
  headers: { "ngrok-skip-browser-warning": "true" },
});

API.interceptors.request.use((req) => {
  if (Cookies.get("token")) {
    req.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
    }
    return Promise.reject(error);
  }
);

export default API;
