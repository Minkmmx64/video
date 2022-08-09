import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VideoEntity } from "src/Entity/Video.Entity";
import { Repository } from "typeorm";
import DB from "../../../lib/db/const";
@Injectable()
export class VideoService{

  constructor(@InjectRepository(VideoEntity) private videosRepository: Repository<VideoEntity>) { }

  public async client() {
    const $Sql = `SELECT * from ${DB.MYSQL_VIDEO_TABLE} LIMIT 0,8`;
    const video = await this.videosRepository.query($Sql);
    return video;
  }

  public async exvideo(){
    console.log("1");
  }
}