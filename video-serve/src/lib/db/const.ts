import { TypeOrmModuleOptions } from "@nestjs/typeorm"

/**
 * 数据表常量
 */
export default {
  //视频表
  MYSQL_VIDEO_TABLE: "video_attribute",
  //弹幕表
  MYSQL_BULLET_TABLE: "bullet_attribute",
}

/**
 * 连接MYSQL
 */
export const MYSQL_CONFIG:TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'video',
  entities: ["src/Entity/*.Entity.ts"],
  synchronize: true,
}