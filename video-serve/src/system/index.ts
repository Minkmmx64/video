/**
 * 资源路由前缀
 */
export const BaseUrl = {
  dev: {
    url: "http://192.168.1.102",
    port: 8000,
  },
  prod: {
    url: "http://192.168.2.32",
    port: 3000,
  }
}

/**
 * 当前环境
 */
export const Base = process.env.NODE_ENV === "development" ? BaseUrl.dev : BaseUrl.prod;

/**
 * 静态资源前缀
 */
export const prefix = {
  //图片资源
  image: "/static/image",
  //视频资源
  video: "/static/video",
  //音乐资源
  music: "/static/music",
  //gif
  gif: "/static/gif"
}

/**
 * 静态资源目录
 */
export const source = {
  image: Base.url + ':' + Base.port + prefix.image,
  video: Base.url + ':' + Base.port + prefix.video,
  music: Base.url + ':' + Base.port + prefix.music
}