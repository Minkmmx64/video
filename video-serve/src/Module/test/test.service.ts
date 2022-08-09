import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VideoEntity } from "src/Entity/Video.Entity";
import { Repository } from "typeorm";

@Injectable()
export class TestService{
  constructor(@InjectRepository(VideoEntity) private videosRepository: Repository<VideoEntity>) { }

  public async video() {
    return this.videosRepository.find();
  }
}