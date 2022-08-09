/**
 * Api配置服务
 */
export const ApiServe = {
  dev: {
    url:"http://192.168.1.102:8000/"
  },
  pord: {
    url:"http://192.168.2.32:8000/"
  }
}


/**
 * 当前环境选择路由前缀
 */
export const BaseUrl = process.env.NODE_ENV === "development" ? ApiServe.dev.url : ApiServe.pord.url;

