import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Base, prefix } from './system';
import { Middleware } from './lib/Middleware/Middleware';
import { ServerResponse } from 'http';
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const options = new DocumentBuilder()
    .setTitle('Api文档')
    .setDescription('文档介绍') // 文档介绍
    .setVersion('1.0.0') // 文档版本
    .build();
  // 为了创建完整的文档（具有定义的HTTP路由），我们使用类的createDocument()方法SwaggerModule。此方法带有两个参数，分别是应用程序实例和基本Swagger选项。
  const document = SwaggerModule.createDocument(app, options);
  // 最后一步是setup()。它依次接受（1）装入Swagger的路径，（2）应用程序实例, （3）描述Nest应用程序的文档。
  SwaggerModule.setup('/swagger', app, document);

  app.use(cookieParser());

  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
      secure: false,
      httpOnly: false
    }
  }));

  app.use(Middleware);
  
  //视频静态资源
  app.useStaticAssets(join(__dirname, '../public/video'), {
    prefix: prefix.video,
    setHeaders: (res: ServerResponse) => {
      res.setHeader('Content-Disposition', 'attachment');
    },
  });
  
  //图片静态资源
  app.useStaticAssets(join(__dirname, '../public/image'), {
    prefix: prefix.image,
  });

  //gif静态资源
  app.useStaticAssets(join(__dirname, '../public/gif'), {
    prefix: prefix.gif,
  });

  app.enableCors({
    origin: [
      "http://192.168.149.25:8080",
      "http://192.168.149.25:8081",
      "http://192.168.149.25:8082"],
    credentials: true
  });

  await app.listen(Base.port);
}
bootstrap();
