import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { UserEntity } from "src/Entity/User.Entity";
import { InsertResult, Repository, UpdateResult } from "typeorm";
import { IRegister } from "./user.dto";

@Injectable()
export class UserDao {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

  private readonly getTime = () => moment().format("YYYY-MM-DD hh-mm-ss");                                  //获取时间

  public async InsertUserRegister(Register: IRegister,psd:string): Promise<InsertResult> {
    const Insert = await this.userRepository.insert({
      updated_at: this.getTime(),
      created_at: this.getTime(),
      user_name: Register.username,
      user_email: Register.email,
      user_phone: Register.mobilephone,
      user_password: psd
    })
    return Insert;
  }

  public async SelectUserByMobile(mobile: string):Promise<UserEntity[]> {
    const User = await this.userRepository.find({
      where: { user_phone : mobile }
    })
    return User;
  }

  public async UpdateUserUpdatedAtById(user:UserEntity,id:number) : Promise<UpdateResult>{
    return await this.userRepository.createQueryBuilder().update(user).set({
      updated_at: this.getTime()
    }).where("user_id = :id",{ id : id}).execute();
  }

}