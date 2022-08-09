import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { BaseUrl } from "./ApiConfig";

const AxiosConfig = <AxiosInstance>Axios.create({
  baseURL: BaseUrl,
  timeout: 500000,
  headers: { 'AuthToken': 'xxxxxx' },
})

/**
 * 请求拦截
 */
AxiosConfig.interceptors.request.use((config: AxiosRequestConfig) => {
  return config;
})

/**
 * 响应拦截
 */
AxiosConfig.interceptors.response.use((resqonse: AxiosResponse) => {
  return resqonse;
})

export function HttpRequest(): AxiosInstance {
  return AxiosConfig;
}
