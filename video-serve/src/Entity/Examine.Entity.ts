/**
 * 审核视频实体类
 */
 import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

 @Entity("examine_attribute")
 export class ExamineEntity extends BaseEntity{
   /**
    * 主键，审核id
    */
   @PrimaryGeneratedColumn()
   examine_id: number

   @Column({type:"varchar",length:255,comment:"用户id" }) //外键
   user_id: string;

   @Column({type:"enum",enum: [1, 2, 3, 4, 5] ,comment:"审核进度 | 1: 已上传视频 2:提交具体信息 3:正在审核 4: 审核通过 5:审核拒绝" })
   examine_state: 1 | 2 | 3 | 4 | 5;

   @Column({type:"varchar", length :255,comment:"审核信息" })
   examine_content: number;
  
   @Column({ type: "varchar", name: "created_at", comment: "审核创建时间" })
   created_at: string;
 
   @Column({ type: "varchar", name: "updated_at", comment: "审核修改时间" })
   updated_at: string;
 }