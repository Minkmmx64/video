import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MYSQL_CONFIG } from './lib/db/const';
import { Modules } from "./Module/index";
@Module({
  imports: [
    TypeOrmModule.forRoot(MYSQL_CONFIG),
    Modules.video,
    Modules.videoClient,
    Modules.UserClient,
    Modules.TestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
