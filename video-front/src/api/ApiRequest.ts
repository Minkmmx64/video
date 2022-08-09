import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { BaseUrl } from "./ApiConfig";

const AxiosConfig = <AxiosInstance>Axios.create({
  baseURL: BaseUrl,
  timeout: 500000,
  headers: { 'X-MINKM-BASE': 'MM' },
  withCredentials: true,
})

/**
 * 请求拦截
 */
AxiosConfig.interceptors.request.use((config: AxiosRequestConfig) => {
  const AuthToken = sessionStorage.getItem("AuthToken");
  if (!config.headers) config.headers = {};
  config.headers.AuthToken = AuthToken || "";
  return config;
}, error => {
  console.log("[Request]",error);
})

/**
 * 响应拦截
 */
AxiosConfig.interceptors.response.use((resqonse: AxiosResponse) => {
  return resqonse;
}, error => {
  console.log("[Resqonse Error]", error);
  const Message = error.response.data.message;
  ElMessage.error(Message);
  return Promise.reject(error);
})

export function HttpRequest(): AxiosInstance {
  return AxiosConfig;
}
