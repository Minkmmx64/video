/**
 * 弹幕实体类
 */
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VideoEntity } from "./Video.Entity";

@Entity("bullet_attribute")
export class BulletEntity extends BaseEntity{
  /**
   * 主键，弹幕ID
   */
  @PrimaryGeneratedColumn()
  bullet_id: number;
  
  @Column({ type: "int", default: 0, width: 64, comment: "弹幕尺寸" })
  bullet_size: number;

  @Column({ type: "varchar", length: 255, comment: "弹幕坐标" })
  bullet_position: string;

  @Column({ type: "varchar", length: 255, comment: "弹幕颜色" })
  bullet_color: string;

  @Column({ type: "int", width: 64, comment: "弹幕速度" })
  bullet_speed: number;

  @Column({ type: "varchar", length: 255, comment: "弹幕文字" })
  bullet_text: string;

  @Column({ type: "double", comment: "不透明度" })
  bullet_opacity: number;

  @Column({ type: "enum", enum: ["bottom", "top", "scroll"], comment: "弹幕类型 : 滚动 | 顶部 | 底部" })
  bullet_type: "bottom" | "top" | "scroll";

  @Column({ type: "int", width: 64, comment: "在视频第几秒发送的时间" })
  bullet_time: number;

  @Column({ type: "int", default: 0, width: 64, comment: "发送的用户Id" }) //外键
  bullet_send_user_id: number;

  @Column({ type: "int", default: 0, width: 64, comment: "对应视频id" }) //外键
  Bullet_from_video: VideoEntity;
  
  @Column({ type: "varchar", name: "created_at", comment: "弹幕发送时间" })
  created_at: string;

  @Column({ type: "varchar", name: "updated_at", comment: "弹幕修改时间" })
  updated_at: string;

}