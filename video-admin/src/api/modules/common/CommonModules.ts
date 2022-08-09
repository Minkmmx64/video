import { Code } from "@/api/ApiConst";

/**
 * 通用数据模型
 */
export class CommonModules<T> {
  status = "200";
  message = "消息";
  code = 200 as Code;
  meta = {
    count: 0
  };
  body = {} as T;
}