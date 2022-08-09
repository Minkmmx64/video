export interface ExStep{
  '1' : ExFrom;
  '2' : ExFrom & { video_name: string, video_describe: string };
}

export interface ExFrom {
  video_href:string;
  video_upload_user:string;
  video_time: number;
  video_type: string;
  video_md5: string;
  video_size: number;
  user_id: number;
}

export type Ex<T extends keyof ExStep> = ExStep[T];