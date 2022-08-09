import { Body, Controller, Get, HttpStatus, ParseIntPipe, Post, Query, Res, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CResponseSend, ResponseSend } from "src/common/ResponseSend";
import { NotNull } from "src/lib/decorator/NotNull";
import { TokenGuard } from "src/lib/Guards/useGuards";
import { HttpExceptionFilter } from "src/lib/HttpException";
import { ServiceException } from "src/lib/HttpException/AuthException";
import { EditVideoBody, UploadVideoFile, VideoCreatedBody, VideoSearchFrom, VideoSearchParam, VideoUpload } from "./Video.DTO";
import { VideoService } from "./video.service";

@ApiTags("视频管理")
@Controller("/video")
@UseGuards(TokenGuard)
@UseFilters(HttpExceptionFilter)
export class VideoController{

  public UploadBody: VideoUpload;

  constructor(private readonly VideoServices: VideoService) { }

  /**
   * @returns 视频列表
   */
  @Get("/list")
  @ApiOperation({ summary: '获取后台视频列表' })
  @ApiQuery({ name: "limit", required: true })
  @ApiQuery({ name: "offset", required: true })
  @ApiQuery({ name: "query", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "sort", required: false })
  @ApiHeader({name: "authtoken" , required: false})
  public async SelectVideoLists(
                        @Query("query") query: string,
                        @Query("limit", ParseIntPipe) @NotNull("query.limit") Limit: number,
                        @Query("offset", ParseIntPipe) @NotNull("query.offset") Offset: number,
                        @Query("sort") sort: string,
                        @Query("search") search: string,
                        @Res() res: Response) {
    let [Sort, Search, Id] = [null, null, null];
    if (search)Search = JSON.parse(search) as VideoSearchFrom;
    if (sort) Sort = JSON.parse(sort);
    if (query) Id = JSON.parse(query);
    const Query: VideoSearchParam = {
      limit: Limit,
      offset: Offset,
      search: Search,
      sort: Sort,
      query: {
        id:Id as unknown as number
      }
    }
    const { Videos, count } = await this.VideoServices.SelectVideoLists(Query);
    ResponseSend(new CResponseSend(HttpStatus.OK, "获取视频列表成功", "success", Videos, res, { count }));
  }

  /**
   * 视频分片上传
   * @param {VideoDto}
   * @param files
   * @returns 上传是否成功
   */
  @Post("/upload")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'File', maxCount: 1 },
    { name: 'count', maxCount: 1 },
    { name: 'filename', maxCount: 1 },
    { name: 'max', maxCount: 1 },
    { name: 'type', maxCount: 1 },
    { name: 'md5', maxCount: 1 },
    { name: 'uuid', maxCount: 1 },
    { name: 'size', maxCount: 1 }
  ]))
  public async VideoUploadInstance(
                      @Body("filename") @NotNull("body.filename") filename: string,
                      @Body("count", ParseIntPipe) @NotNull("body.count") count: number,
                      @Body("max", ParseIntPipe) @NotNull("body.max") max: number,
                      @Body("type") @NotNull("body.type") type: "Slicing" | "NoSlicing",
                      @Body("md5") @NotNull("body.md5") md5: string,
                      @Body("uuid") @NotNull("body.uuid") uuid: string,
                      @UploadedFiles() files: { File: FileList },
                      @Res() res:Response){
    try {
      this.UploadBody = {
        file: files.File[0] as unknown as UploadVideoFile,
        filename: filename,
        currentcount: count,
        max: max,
        type: type,
        md5: md5,
        uuid: uuid,
      };
      if (type === "Slicing") {
        const FilePath = await this.VideoServices.VideoUploadInstance(this.UploadBody);
        ResponseSend(new CResponseSend(HttpStatus.CREATED, "第" + count + "片上传完成", "success", FilePath, res));
      } else {
        const FilePath = await this.VideoServices.VideoUploadInstance(this.UploadBody);
        ResponseSend(new CResponseSend(HttpStatus.CREATED, "文件上传完成", "success", FilePath, res));
      }
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  /**
   * 请求合并
   * @param uuid 文件上传id分组 
   * @returns 是否合并完成
   */
  @Get("/upload/complete")
  public async RequestSliciingUploadComplete(
                                              @Query("uuid") @NotNull('query.uuid') uuid: string,
                                              @Res() res:Response) {
    try {
      const FilePath = await this.VideoServices.RequestSliciingUploadComplete(uuid);
      const response = {
        video_href: FilePath.filePath,
        video_time: typeof FilePath.time === "string" ? parseInt(FilePath.time) : FilePath.time
      }
      ResponseSend(new CResponseSend(HttpStatus.CREATED, "文件上传完成", "success", response, res));
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  /**
   * 检查文件md5
   * @param md5 
   * @returns {boolean}
   */
  @Get("/upload/check")
  public async checkMd5(
                        @Query("md5") @NotNull("query.md5") md5: string,
                        @Res() res: Response): Promise<void> {
    try {
      const video = await this.VideoServices.checkMd5(md5);
      if (video.length)
        ResponseSend(new CResponseSend(HttpStatus.ACCEPTED, "资源已存在", "success", video, res));
      else
        ResponseSend(new CResponseSend(HttpStatus.OK, "正在上传资源", "success", video, res));
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  /**
   * 创建视频信息
   * @returns 
   */
  @Post("/create")
  public async createVideo(
                            @Body("video_describe") @NotNull("body.video_describe") video_describe: string,
                            @Body("video_href") @NotNull("body.video_href") video_href: string,
                            @Body("video_name") @NotNull("body.video_name") video_name: string,
                            @Body("video_time", ParseIntPipe) @NotNull("body.video_time") video_time: number,
                            @Body("video_upload_user") @NotNull("body.video_upload_user") video_upload_user: string,
                            @Body("video_type") @NotNull("body.video_type") video_type: string,
                            @Body("video_md5") @NotNull("body.video_md5") video_md5: string,
                            @Body("video_size" , ParseIntPipe) @NotNull("body.video_size") video_size: number,
                            @Res() res: Response): Promise<void> {
    const FVideo: VideoCreatedBody = {
      videoDescribe: video_describe,
      videoHref: video_href,
      videoName: video_name,
      videoTime: video_time,
      videoUploadUser: video_upload_user,
      videoType: video_type,
      VideoMd5: video_md5,
      videoSize: video_size
    }
    try {
      const createVideo = await this.VideoServices.CreateVideoInstance(FVideo);
      ResponseSend(new CResponseSend(HttpStatus.CREATED, "视频上传完成", "success", createVideo, res));
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  /**
   *  编辑音频
   */
  @Post("/update")
  public async EditVideo(
                          @Body("video_upload_user") @NotNull("body.video_upload_user") video_upload_user:string,
                          @Body("video_name") @NotNull("body.video_name") video_name:string,
                          @Body("video_describe") @NotNull("body.video_describe") video_describe:string,
                          @Body("video_id", ParseIntPipe) @NotNull("body.video_id") video_id: number,
                          @Res() res:Response
  ){
    const VideoBody:EditVideoBody = {
      video_upload_user:video_upload_user,
      video_name:video_name,
      video_describe:video_describe,
      video_id:video_id
    }
    const result = await this.VideoServices.EditVideo(VideoBody);
    ResponseSend(new CResponseSend(HttpStatus.CREATED, "编辑视频成功", "success", result, res));
  }

  /**
   * 删除
   */
  @Post("/delete")
  public async DeleteVideo(
                            @Body("video_id", ParseIntPipe) @NotNull("body.video_id") video_id: number,
                            @Res() res: Response
  ) {
    const result = await this.VideoServices.DeleteVideo(video_id); 
    ResponseSend(new CResponseSend(HttpStatus.CREATED, "删除视频成功", "success", result, res));
  }
}