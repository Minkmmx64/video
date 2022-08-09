export class VideoDto{
  count = 0;
  filename = "";
  max: number;
  type: "Slicing" | "NoSlicing";
  md5: string;
  uuid: string;
}

export interface VideoUpload{
  filename: string;
  file: UploadVideoFile;
  currentcount: number;
  max: number;
  type: "Slicing" | "NoSlicing";
  md5: string;
  uuid: string;
}

export interface UploadVideoFile{
  fieldname:string;
  originalname:string;
  encoding:string;
  mimetype:string;
  buffer:Buffer;
  size: number;
}

export interface VideoFormat {
  format: Format;
}

export interface Format {
  filename: string;
  nb_streams: number;
  nb_programs: number;
  format_name: string;
  format_long_name: string;
  start_time: string;
  duration: number;
  size: string;
  bit_rate: string;
  probe_score: number;
  tags: Tags;
}

export interface Tags {
  major_brand: string;
  minor_version: string;
  compatible_brands: string;
  creation_time: string;
  encoder: string;
}

export interface VideoCreatedBody{
  videoDescribe: string,
  videoHref: string,
  videoName: string,
  videoTime: number,
  videoUploadUser: string;
  videoType: string;
  VideoMd5: string;
  videoSize: number;
}

export interface VideoSearchFrom {
  id: string | null;
  name: string | null;
  time: number | null;
  md5: string | null;
}

export interface VideoSearchParam{
  limit: number,
  offset: number,
  sort?: {
    column: string,
    method: "ascending" | "descending"
  },
  search: VideoSearchFrom,
  query?: {
    [param:string]:any
  }
}

export type FileTypes = "video" | "image" | "file" | "gif";

export interface FilesCollectionsType{
  md5: string,
  suffix: string,
  Buffers: Buffer[],
}

export interface EditVideoBody{
  video_upload_user:string;
  video_name:string;
  video_describe:string;
  video_id:number;
}

export interface WorkerData{
  href: string;
  md5: string;
  time: string;
}