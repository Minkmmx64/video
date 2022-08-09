/**
 * 评论实体类
 */
 import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
 
 @Entity("comment_wx_attribute")
 export class CommentWXEntity extends BaseEntity{
   /**
    * 主键，评论ID
    */
   @PrimaryGeneratedColumn()
   comment_id: number;
   
   @Column({ type: "int", width: 64, comment: "评论用户id" }) //外键
   comment_send_user_id: number;

   @Column({ type: "int", width: 64, comment: "回复用户id" }) //外键
   comment_reply_user_id: number;

   @Column({ type: "int", width: 64, comment: "父评论id, -1表示评论" })
   comment_parent_node: number;

   @Column({ type: "varchar", length: 255, comment: "回复内容" })
   comment_content: string;

   @Column({ type: "varchar", length: 255, comment: "评论点赞数" })
   comment_like_count: string

   @Column({ type: "varchar", name: "created_at", comment: "评论时间" })
   created_at: string;
 
   @Column({ type: "varchar", name: "updated_at", comment: "最后修改时间" })
   updated_at: string;
 }