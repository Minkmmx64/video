import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "src/Entity/Video.Entity";
import { TestController } from "./test.controller";
import { TestService } from "./test.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity]),
  ],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule { }