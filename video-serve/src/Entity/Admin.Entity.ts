/**
 * 管理员实体类
 */
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin_attribute")
export class AdminEntity extends BaseEntity {
  /**
   * 主键，用户id
   */
  @PrimaryGeneratedColumn()
  admin_id: number

  @Column({ type: "varchar", length: 255, comment: "用户名" })
  admin_name: string;

  @Column({ type: "varchar", length: 255, comment: "用户密码" })
  admin_password: string;

  @Column({ type: "varchar", length: 255, comment: "管理员邮箱" })
  admin_email: string;

  @Column({ type: "int", width: 64, comment: "管理员权限" })
  admin_admission: number;

  @Column({ type: "varchar", name: "created_at", comment: "用户创建时间" })
  created_at: string;

  @Column({ type: "varchar", name: "updated_at", comment: "用户修改时间" })
  updated_at: string;
}