/**
 * 视频实体类
 */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity("video_attribute")
export class VideoEntity extends BaseEntity{
  /**
   * 视频ID 主键
   */
  @PrimaryGeneratedColumn()
  video_id: number;

  @Column({ type: "varchar", name: "video_name", comment:"视频名称" })
  video_name: string;

  @Column({ type: "varchar", name: "video_describe", comment: "视频描述" })
  video_describe: string;

  @Column({ type: "int", name: "video_time", width: 64, comment: "视频时长", default: 0 })
  video_time: number;

  @Column({ type: "int", name: "video_player_count", width: 64, comment: "播放次数", default: 0 })
  video_player_count: number;

  @Column({ type: "int", name: "video_comment_count", width: 64, comment: "评论数", default: 0 })
  video_comment_count: number;

  @Column({ type: "int", name: "video_like_count", width: 64, comment: "点赞数", default: 0 })
  video_like_count: number;

  @Column({ type: "int", name: "video_collection_count", width: 64, comment: "收藏数", default: 0 })
  video_collection_count: number;

  @Column({ type: "int", name: "video_forward_count", width: 64, comment: "转发数", default: 0 })
  video_forward_count: number;

  @Column({ type: "bigint", name: "video_size", width: 255, comment: "视频大小", default: 0 })
  video_size: number;

  @Column({ type: "int", name: "video_bullet_count", width: 64, comment: "弹幕数", default: 0 })
  video_bullet_count: number;

  @Column({ type: "varchar", name: "video_href", comment: "视频url" })
  video_href: string;

  @Column({ type: "varchar", name: "video_cover", comment: "视频封面" })
  video_cover: string;

  @Column({ type: "varchar", name: "video_gif", comment: "视频gif", default: "" })
  video_gif: string;

  @Column({ type: "varchar", name: "video_type", comment: "视频格式" })
  video_type: string;

  @Column({ type: "varchar", name: "video_upload_user", comment: "上传用户" }) //外键
  video_upload_user: string;

  @Column({ type: "int", name: "video_upload_user_id", comment: "上传用户id", default: 0}) //外键
  video_upload_user_id: number;

  @Column({ type: "int", name: "video_verify", comment: "是否审核", default: 0 }) //0未审核 1审核通过 -1未通过审核
  video_verify: number;

  @Column({ type: "varchar", name: "video_md5", comment: "视频md5" })
  video_md5: string;
  
  @Column({ type: "varchar", name: "created_at", comment: "创建时间" })
  created_at: string;

  @Column({ type: "varchar", name: "updated_at", comment: "修改时间" })
  updated_at: string;
}