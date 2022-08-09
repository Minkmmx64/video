import { isValidKey } from "@/common/utils";
import { AxiosResponse } from "axios";
import { HttpRequest } from "../ApiRequest";
import { CommonModules } from "./common";

export type AnyType = Record<string | number, string | number> | boolean | string | number | [];

export type TableSort = "ascending" | "descending";

//表格查询参数
export interface getListParam<S>{
  limit?: number;
  offset?: number;
  query?: Record<string, AnyType>;
  search?: S | undefined;
  sort?: CommomListTableSortParams
}

export interface CommomListTableSortParams{
  column: string,
  method: TableSort,
  defSortLock: boolean,
}

/**
 * 通用Api请求接口
 * (增删改查，上传)
 */
export class CommonApi {
  public url = "";

  constructor(url: string) {
    this.url = url;
  }
  
  /**
   * 获取表格方法
   * @param param 
   * @returns {Promise<AxiosResponse<CommonModules>>}
   */
  public getList<T,S>(param: getListParam<S>): Promise<AxiosResponse<CommonModules<T>>>{
    return HttpRequest().get(`${this.url}/list` + mergeParams(param));
  }

  /**
   * 创建资源
   * @param param 
   * @returns {Promise<AxiosResponse<CommonModules<T>>>}
   */
  public create<T,C>(param: C): Promise<AxiosResponse<CommonModules<T>>>{
    return HttpRequest().post(`${this.url}/create`, param);
  }

  /**
   * 修改资源
   * @param param 
   * @returns {Promise<AxiosResponse<CommonModules<T>>>}
   */
  public update<T, C>(param: C): Promise<AxiosResponse<CommonModules<T>>> {
    return HttpRequest().post(`${this.url}/update`, param);
  }

  /**
   * 删除资源
   * @param param 
   * @returns {Promise<AxiosResponse<CommonModules<T>>>}
   */
  public delete<T, C>(param: C): Promise<AxiosResponse<CommonModules<T>>> {
    return HttpRequest().post(`${this.url}/delete`, param);
  }

  /**
   * 上传文件方法
   * @param File 文件
   * @param File 当前上传第几片currentSlicing
   * @returns {Promise<AxiosResponse<CommonModules>>}
   */
  public uploadFile<T>(File: FormData | Blob): Promise<AxiosResponse<CommonModules<T>>>{
    return HttpRequest().post(`${this.url}/upload`,
      File,
      { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * 根据md5查询文件是否存在
   * @param md5 加密字符串
   * @returns {Promise<AxiosResponse<CommonModules>>}
   */
  public checkMd5<T>(md5: string): Promise<AxiosResponse<CommonModules<T>>> { 
    return HttpRequest().get(`${this.url}/upload/check?md5=${md5}`)
  }

  /**
   * 请求分片上传完毕
   * @param uuid 文件唯一ID
   * @returns {Promise<AxiosResponse<CommonModules>>}
   */
  public requestSliciingUploadComplete<T>(uuid: string | number): Promise<AxiosResponse<CommonModules<T>>>{
    return HttpRequest().get(`${this.url}/upload/complete?uuid=${uuid}`, { headers: { 'Content-Type': 'multipart/form-data' } })
  }

  /**
   * 请求分片上传失败
   * @param uuid 文件唯一ID
   * @returns {Promise<AxiosResponse<CommonModules>>}
   */
  public requestSliciingUploadFail<T>(uuid: string | number): Promise<AxiosResponse<CommonModules<T>>> {
    return HttpRequest().get(`${this.url}/upload/fail?uuid=${uuid}`)
  }
}

/**
 * 合并查询参数字符串
 * @param param 参数对象
 * @returns {string}
 */
export function mergeParams<S>(param: getListParam<S>):string {
  const res = [] as string[];
  let str = "";
  if (typeof param === "object") {
    for (const key in param) {
      if (isValidKey(key,param)) {
        if ((typeof param[key] === "object")) {
          const obj = {};
          for (const k2 in param[key] as Record<string,string>) {
            if (param[key][k2]) {
              const JSONs = `{"${k2}":"${param[key][k2]}"}`;
              Object.assign(obj, JSON.parse(JSONs));
            }
          }
          try {
            res.push(`${key}=${JSON.stringify(obj)}`)
          } catch (error) {
            console.error("查询参数类型格式不对，无法使用:JSON.stringify方法", error);
          }
        }
        else {
          if (param[key])
            res.push(`${key}=${param[key]}`)
        }
      }
    }
    for (let I = 0; I < res.length; I++){
      if (I === 0) {
        str = "?" + res[I];
        continue;
      }
      else{
        str += "&" + res[I];
        continue;
      }
    }
    return str;
  } else {
    console.error("查询参数类型格式不对,不是一个对象");
    return str;
  }
}
