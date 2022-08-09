import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VideoEntity } from "src/Entity/Video.Entity";
import { InsertResult, Repository } from "typeorm";
import DB from "../../../lib/db/const";
import { EditVideoBody, FilesCollectionsType, FileTypes, VideoCreatedBody, VideoFormat, VideoSearchParam, VideoUpload, WorkerData } from "./Video.DTO";
import { getTMD, isNullorUndefined } from "src/common/common";
import { Base, prefix, source } from "src/system";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import * as iconv from "iconv-lite";
import * as moment from "moment";
import { Buffer } from "buffer";
import { ServiceException } from "src/lib/HttpException/AuthException";
import { Worker } from "worker_threads";

@Injectable()
export class VideoService {

  private FilesCollections: Record<number | string, FilesCollectionsType> = {};                    //文件分片数组 [uuid] => [FilesCollectionsType]
     
  private readonly VFileType: FileTypes = "video";                                                 //文件上传类型这里是音频文件

  private readonly IFileType: FileTypes = "image";                                                 //文件上传类型这里是图片文件

  private readonly GFileType: FileTypes = "gif";                                                   //文件上传类型这里是gif文件
     
  private readonly getTime = () => moment().format("YYYY-MM-DD");                                  //获取时间
     
  private FileName = "";                                                                           //文件名
     
  private FileResultPath = "";                                                                     //文件url地址

  private readonly VideoPathPrefix = Base.url + ":" + Base.port + prefix.video + '/';                       //视频路径前缀

  private readonly ImagePathPrefix = Base.url + ":" + Base.port + prefix.image + '/';                       //图片路径前缀

  private readonly GifPathPrefix = Base.url + ":" + Base.port + prefix.gif + '/';                       //git路径前缀

  private readonly FixPath = (PathPrefix: string, Fix: string) => PathPrefix.replace(Fix, () => "");        //删除路径前缀

  private readonly CutPic = async (url: string, md5: string):Promise<[string,string]> => {                  //截取第一帧图片
    return new Promise( async (resolve, reject) => {
      try {
        const Path = this.createdFilePathToString(this.IFileType);
        const ImgPath = source.image + '/' + getTMD() + '/' + md5 + ".jpg";
        try {
          await this.CreateFileMkdir(Path);
          const cmd = `ffmpeg -ss 10 -i ${url} -vframes 1 -s 200*200 ${Path}/${md5}.jpg`;                      // -ss 开始时间 第10秒 输入文件 截取一副画面
          exec(cmd, (e, r) => {
            if (e) reject(e);
            resolve([ r, ImgPath ]);
          })
        } catch (error) {
          throw new ServiceException(error)
        }
      } catch (error) {
        throw new ServiceException(error)
      }
    })
  }    
     
  private readonly createdFilePathToString = (type: FileTypes) => {
    return path.join(__dirname, '../../../../public', type, getTMD());                              //获取文件路径 
  }     
  
  private readonly readVideo = (): Promise<VideoFormat> => {                                         //读取音频
    return new Promise((resolve, reject) => {
      exec(`ffprobe -show_format -of json ${this.FileResultPath}`, { encoding: 'buffer' }, (e, r) => {
        if (e) reject(e);
        const video = JSON.parse(iconv.decode(r, 'cp936'));
        console.log(video);
        resolve(video);
      });
    })
  }

  private readonly CreateFileMkdir = (fsp: fs.PathLike) => {                                       //生成文件夹
    return new Promise((resolve, reject) => {
      fs.stat(fsp, error => {
        if (error) {
          console.log(`文件路径${fsp}不存在正在创建`, error);
          try {
            fs.mkdirSync(fsp);
            resolve(true);
          } catch (error) {
            console.log(`文件路径${fsp}创建失败`);
            reject(error);
          }
        }
        else resolve(true);
      })
    })
  }

  private readonly DeleteVideoResource = (href: string, cover: string,gif?:string) => {                                      //同时删除视频文件以及图片文件,gif
    const VPath = path.resolve(__dirname, "../../../../public/video", this.FixPath(href, this.VideoPathPrefix));
    const IPath = path.resolve(__dirname, "../../../../public/image", this.FixPath(cover, this.ImagePathPrefix));
    if (gif) {
      const GPath = path.resolve(__dirname, "../../../../public/gif", this.FixPath(gif, this.GifPathPrefix));
      fs.unlinkSync(GPath);
    }
    fs.unlinkSync(VPath);
    fs.unlinkSync(IPath);
  }

  private readonly SwitchTime = (Type:number):string => {                     //选择时间大小
    switch (Type) {
      case 1:{
        return `AND video_time > 0 && video_time < 60`;
      }
      case 2:{
        return `AND video_time >= 60 && video_time < 600`;
      }
      case 3:{
        return `AND video_time >= 600 && video_time < 1800`;
      }
      case 4:{  
        return `AND video_time >= 1800 && video_time < 3600`;
      }
      case 5:{  
        return `AND video_time >= 3600`;
      }
      default:{
        return "";
      }
    }
  }

  constructor(@InjectRepository(VideoEntity) private videosRepository: Repository<VideoEntity>) { }


  public async SelectVideoLists(Querys: VideoSearchParam) {
    
    const { limit, offset, search, sort, query } = Querys;
    const $sort = sort?.column && sort?.method ? `ORDER BY ${sort.column} ${sort.method === "ascending" ? "ASC" : "DESC"}` : "";
    const Time = typeof search.time === "string" ? parseInt(search.time) : search.time;
    const $time = isNullorUndefined(Time) ? this.SwitchTime(Time) : "";
    try {
      const $sql = `
        SELECT * from ${DB.MYSQL_VIDEO_TABLE}
        WHERE video_id = IF(${ isNullorUndefined(search.id )},'${ search.id }',video_id) AND
        video_id = IF(${ isNullorUndefined(query.$query) },'${ query.$query }',video_id) AND
        video_name LIKE IF(${ isNullorUndefined(search.name) },'%${ search.name }%',video_name) AND
        video_md5 = IF(${ isNullorUndefined(search.md5) },'${ search.md5 }',video_md5) ${$time} ${ $sort }
        LIMIT ${ (offset - 1) * limit },${ limit }`
      const Videos: VideoEntity[] = await this.videosRepository.query($sql);
      const count = await this.videosRepository.query(`SELECT count(*) as total from ${DB.MYSQL_VIDEO_TABLE}`);
      return {
        Videos,
        count: count[0].total
      };
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  public async VideoUploadInstance(Slicing: VideoUpload):
    Promise<string | { filePath: string, time: number }>
  {
    if (Slicing.type === "Slicing") {                                            //需要分片
      if (this.FilesCollections[Slicing.uuid]) {                                 //已经开始上传
        try {                                                                    //push 文件字节流
          this.FilesCollections[Slicing.uuid].Buffers.push(Slicing.file.buffer); 
          return "ok";
        } catch (error) {
          throw new ServiceException(error);
        }
      } else {
        try {                                       //第一次上传初始化
          this.FilesCollections[Slicing.uuid] = {
            md5: Slicing.md5,                       //文件md5
            suffix: Slicing.filename.split(".")[1], //文件后缀
            Buffers: Array<Buffer>(),               //文件字节流
          }
          this.FilesCollections[Slicing.uuid].Buffers.push(Slicing.file.buffer);
          return "ok";
        } catch (error) {
          throw new ServiceException(error);
        }
      }
    } else {
      const FileMkdirPath = this.createdFilePathToString(this.VFileType); //不分片  直接生成文件
      this.FileName = `${Slicing.md5}.${Slicing.filename.split(".")[1]}`; //获取文件名
      const FilePathUrl = path.join(FileMkdirPath, this.FileName);        //文件夹路径
      try {                                                               //创建文件夹
        await this.CreateFileMkdir(FileMkdirPath);
        const FileWriteStream = fs.createWriteStream(FilePathUrl);
        try {
          const FileWriter = (): Promise<void> => {                       //使用Promise等待写操作避免子进程并发
            return new Promise((resolve, reject) => {
              FileWriteStream.write(Slicing.file.buffer, "utf-8", error => {
                if (error) reject(error.message);
              });
              FileWriteStream.end(() => resolve());
            })
          }
          await FileWriter();
          try {
            this.FileResultPath = `${source.video}/${getTMD()}/${this.FileName}`;
            const video = await this.readVideo();

            return {
              filePath: this.FileResultPath,
              time: video.format.duration,
            };
          } catch (error) {
            throw new ServiceException('获取音频失败' + error);
          }
        } catch (error) {
          throw new ServiceException(error);
        }
      } catch (error) {
        throw new ServiceException(error);
      }
    }
  }

  public async RequestSliciingUploadComplete(uuid: string) {                                      //请求合并
    const FileMkdirPath = this.createdFilePathToString(this.VFileType);                           //文件夹路径
    this.FileName = `${this.FilesCollections[uuid].md5}.${this.FilesCollections[uuid].suffix}`;   //获取文件名
    const FilePathUrl = path.join(FileMkdirPath, this.FileName);                                  //文件路径

    try {
      await this.CreateFileMkdir(FileMkdirPath);
      const FileWriteStream = fs.createWriteStream(FilePathUrl);
      try {
        const FileWriter = ():Promise<void> => {
          return new Promise((resolve, reject) => {
            for (let i = 0; i < this.FilesCollections[uuid].Buffers.length; i++) {
              FileWriteStream.write(this.FilesCollections[uuid].Buffers[i], "utf-8", error => {
                if (error) reject(error.message);
              });
            }
            FileWriteStream.end(() => resolve());
          })
        }
        await FileWriter();
        try {
          this.FilesCollections[uuid] = null;
          this.FileResultPath = `${source.video}/${getTMD()}/${this.FileName}`;
          const video = await this.readVideo();
          return {
            filePath: this.FileResultPath,
            time: video.format.duration
          };
        } catch (error) {
          throw new ServiceException('获取音频失败' + error);
        }
      } catch (error) {
        throw new ServiceException('写入失败,可以进行重试' + error);
      }
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  public async CreateVideoInstance(Video: VideoCreatedBody) {
    const [res, ImgUrl] = await this.CutPic(Video.videoHref, Video.VideoMd5);
    console.info(res);
    try {
      
      const WorkerData: WorkerData = {
        href: Video.videoHref,
        md5: Video.VideoMd5,
        time: getTMD(),
      }
      
      const WorkerThread = new Worker(__dirname + "/component/WorkerThread.js", { workerData: JSON.stringify(WorkerData) });

      WorkerThread.on("message", () => {
        const gif = this.GifPathPrefix + getTMD() + '/' + Video.VideoMd5 + '.gif';
        this.videosRepository.query(`UPDATE ${DB.MYSQL_VIDEO_TABLE} SET video_gif='${gif}' WHERE video_md5='${Video.VideoMd5}'`);
      })
      
      WorkerThread.on("error", e => {
        console.error(e);
      })

      const Insert: InsertResult = await this.videosRepository.insert({
        video_cover: ImgUrl,
        video_name: Video.videoName,
        video_describe: Video.videoDescribe,
        video_time: Video.videoTime,
        video_href: Video.videoHref,
        video_upload_user: Video.videoUploadUser,
        video_type: Video.videoType,
        video_md5: Video.VideoMd5,
        video_size:Video.videoSize,
        created_at: this.getTime(),
        updated_at: this.getTime()
      })
      return Insert;
    } catch (error) {
      //同时删除视频文件以及图片文件
      this.DeleteVideoResource(Video.videoHref, ImgUrl);
      throw new ServiceException(error);
    }
  }

  public async checkMd5(md5: string): Promise<VideoEntity[]> {
    return this.videosRepository.query(`SELECT * FROM ${DB.MYSQL_VIDEO_TABLE} WHERE video_md5='${md5}'`)
  }

  public async EditVideo(VideoEdit: EditVideoBody) {
    const { video_describe, video_id, video_name, video_upload_user } = VideoEdit;

    const VideoUpdate = await this.videosRepository.findOne({
      where: {
        video_id: video_id
      }
    });

    VideoUpdate.video_name = video_name;
    VideoUpdate.video_describe = video_describe;
    VideoUpdate.video_upload_user = video_upload_user;
    VideoUpdate.updated_at = this.getTime();

    try {
      await this.videosRepository.save(VideoUpdate);
      return "OK";
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  public async DeleteVideo(id: number) {
    const VideoUpdate = await this.videosRepository.findOne({
      where: {
        video_id: id
      }
    });
    try {
      //同时删除视频文件以及图片文件
      this.DeleteVideoResource(VideoUpdate.video_href, VideoUpdate.video_cover, VideoUpdate.video_gif);
      await this.videosRepository.remove(VideoUpdate);
      return "OK";
    } catch (error) {
      throw new ServiceException(error);
    } 
  }
}