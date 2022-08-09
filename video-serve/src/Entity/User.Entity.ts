/**
 * 用户实体类
 */
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_attribute")
export class UserEntity extends BaseEntity{
  /**
   * 主键，用户id
   */
  @PrimaryGeneratedColumn()
  user_id: number
  
  @Column({type:"varchar",length:255,comment:"用户名" })
  user_name: string;

  @Column({type:"varchar",length:255,comment:"用户密码"})
  user_password: string;

  @Column({ type: "varchar", length: 255, comment: "用户简介", default: "" })
  user_brief: string;

  @Column({ type: "int", width: 64, comment: "关注数量", default: 0 })
  user_follow: number;

  @Column({ type: "int", width: 64, comment: "粉丝数量", default:0 })
  user_fans: number;

  @Column({ type: "int", width: 64, comment: "用户经验", default: 0 })
  user_experience: number;

  @Column({ type: "varchar", length: 255, comment: "用户邮箱" })
  user_email: string;

  @Column({ type: "varchar", length: 255, comment: "用户手机号", unique: true })
  user_phone: string; 

  @Column({ type: "varchar", length: 255, comment: "用户头像", default: "http://cdn.minkm.top/base/16571623728446r6l3o1d2W4l2l8e4H7o157defaultAvatar.png" })
  user_avatar: string;

  @Column({ type: "varchar", name: "created_at", comment: "用户创建时间" })
  created_at: string;

  @Column({ type: "varchar", name: "updated_at", comment: "用户修改时间" })
  updated_at: string;
}