import { Body, Controller, Get, HttpStatus, Post, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CResponseSend, ResponseSend } from "src/common/ResponseSend";
import { NotNull } from "src/lib/decorator/NotNull";
import { TokenGuard } from "src/lib/Guards/useGuards";
import { HttpExceptionFilter } from "src/lib/HttpException";
import { Ex, ExStep } from "./video.dto";
import { VideoService } from "./video.service";

@ApiTags("客户端视频类")
@Controller("/video/client")
@UseFilters(HttpExceptionFilter)
export class VideoController{

  constructor(private readonly VideoServices: VideoService) { }
  
  @Get("/list")
  public async client(@Res() res: Response) {
    const video = await this.VideoServices.client();
    ResponseSend(new CResponseSend(HttpStatus.OK, "获取视频列表成功", "success", video, res));
  }

  @UseGuards(TokenGuard)
  @Post("/exvideo")
  public async exvideo(
                      @Body("video_href") @NotNull("body.video_href") video_href: string,
                      @Body("video_upload_user") @NotNull("body.video_upload_user") video_upload_user: string,
                      @Body("video_time") @NotNull("body.video_time") video_time: number,
                      @Body("video_type") @NotNull("body.video_type") video_type: string,
                      @Body("video_md5") @NotNull("body.video_md5") video_md5: string,
                      @Body("video_size") @NotNull("body.video_size") video_size: number,
                      @Body("user_id") @NotNull("body.user_id") user_id: number,
                      @Body("status") @NotNull("body.status") status: keyof ExStep,
                      @Body() body : Ex<"2">,
                      @Res() res:Response){
      switch(status){
        case '1':{
          const data: Ex<"1"> = {
            video_href,
            video_md5,
            video_size,
            video_time,
            video_type,
            video_upload_user,
            user_id
          };
          console.log(data);
          break;
        }
        case '2':{
          console.log(body);
          break;
        }
      }
      console.log(status);
      ResponseSend(new CResponseSend(HttpStatus.OK, "OK", "success", {} , res));
  }
}