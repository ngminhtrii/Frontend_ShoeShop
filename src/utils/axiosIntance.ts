import axios from "axios";
import Cookie from "js-cookie";
// import { BaseApi } from "./BaseApi";
export const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;
export const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
export const BaseApi = `http://${SERVER_DOMAIN}:${SERVER_PORT}`;

export const axiosInstance = axios.create({
    baseURL: BaseApi,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420"
    },
});
export const axiosInstanceAuth = axios.create({
    baseURL: BaseApi,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookie.get("token"),
        "ngrok-skip-browser-warning": "69420"
    },
});

export const axiosInstanceFile = axios.create({
    baseURL: BaseApi,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + Cookie.get("token"),
        "ngrok-skip-browser-warning": "69420"
    },
});

