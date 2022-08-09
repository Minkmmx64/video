import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/Entity/User.Entity";
import { Repository } from "typeorm";
import { IRegister } from "./user.dto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { NoTokenException, ServiceException } from "src/lib/HttpException/AuthException";
import { UserDao } from "./user.dao";

@Injectable()
export class UserService{

  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { };

  private readonly User = new UserDao(this.userRepository);

  public async register(data: IRegister) {
   
    const psd = bcrypt.hashSync(data.password, 10);
    try {
      const Users = await this.User.SelectUserByMobile(data.mobilephone);
      if (Users.length) throw new Error("手机号重复");
      else return await this.User.InsertUserRegister(data, psd);
    } catch (error) {
      throw new ServiceException(error);
    }
  }

  public async login(mobilephone:string,password:string){

    const [ User ] = await this.User.SelectUserByMobile(mobilephone);
    
    if(User){
      const { user_id, user_password, user_name, user_phone } = User;
      const isExistence = await bcrypt.compare(password,user_password);
      if(isExistence){
        const AuthToken = {
          username: user_name,
          password: user_password,
          mobilephone: user_phone
        }
        const access_token = jwt.sign(AuthToken,"secretOrPrivateKey", {
          expiresIn: 6000
        });
        const Update =  await this.User.UpdateUserUpdatedAtById(User,user_id);
        if(Update){
          return { access_token, user_id };
        }else throw new ServiceException("更新状态失败");
      }else{
        throw new NoTokenException("密码错误");
      }
    }else throw new NoTokenException("用户不存在");
  }

  public async info(Token: string): Promise<UserEntity> {
    try {
      const { mobilephone } = jwt.verify(Token, "secretOrPrivateKey") as unknown as IRegister;
      const [ User ] = await this.User.SelectUserByMobile(mobilephone);
      return User;
    } catch (error) {
      throw new NoTokenException(error);
    }
  }
}