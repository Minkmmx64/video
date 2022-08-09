import { AxiosResponse } from "axios";
import { HttpRequest } from "../ApiRequest";
import { CommonModules } from "./common";
import { CommonApi } from "./CommonApi";

export class VideoModule {
  //视频id
  video_id = 0;
  //视频名称
  video_name = "";
  //视频描述
  video_describe = "";
  //视频时长
  video_time = 0;
  //播放次数
  video_player_count = 0;
  //评论数
  video_comment_count = 0;
  //点赞数
  video_like_count = 0;
  //收藏数
  video_forward_count = 0;
  //弹幕数
  video_bullet_count = 0;
  //链接
  video_href = "";
  //封面
  video_cover = "";
  //上传用户
  video_upload_user = "";
  //视频类型
  video_type = "";
  //上传时间
  created_at = "";
  //修改时间
  updated_at = "";
  //视频md5
  video_md5 = "";
  //视频大小
  video_size = 0;
  //视频gif
  video_gif = "";
}

const url = "video";

export interface ExStatus {
  '1': VideoFrom;
  '2': VideoFrom;
  '3': undefined;
}

export interface VideoFrom{
  //视频名称
  video_name:string;
  //视频描述
  video_describe: string;
  //上传用户
  video_upload_user: string;
  //链接
  video_href: string;
  //视频时长
  video_time: number;
  //视频类型
  video_type: string;
  //视频md5
  video_md5: string;
  //视频大小
  video_size: number;
  //用户id
  user_id: number;
}

export class VideoApi extends CommonApi{

  constructor() {
    super("video")
  }

  public client(): Promise<AxiosResponse<CommonModules<VideoModule[]>>> {
    return HttpRequest().get(`${url}/client/list`);
  }

  public exvideo<T extends keyof ExStatus>(status: T ,data: ExStatus[T]): Promise<AxiosResponse<CommonModules<VideoModule>>> {
    return HttpRequest().post(`${url}/client/exvideo`, { ...data, status } );
  }
  
}



export default new VideoApi();