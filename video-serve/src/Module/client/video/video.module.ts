import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { VideoEntity } from "../../../Entity/Video.Entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity]),
  ],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoClientModule { }