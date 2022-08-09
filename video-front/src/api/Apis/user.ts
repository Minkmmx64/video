import { AxiosResponse } from "axios";
import { HttpRequest } from "../ApiRequest";
import { CommonModules } from "./common";

export class UserModule extends CommonModules<UserModule> {

  access_token = "";
  user_id = 0;
  user_name = "";
  user_avatar = "";

  public login(data:Login) : Promise<AxiosResponse<UserModule>> {
    return HttpRequest().post("user/client/login", data);
  }

  public register(data:Register): Promise<AxiosResponse<UserModule>> {
    return HttpRequest().post("user/client/register", data);
  }

  public forget(data:Forget): Promise<AxiosResponse<UserModule>> {
    return HttpRequest().post("user/client/forget", data);
  }

  public vcode(): Promise<AxiosResponse<UserModule>> {
    return HttpRequest().get("user/client/vcode");
  }

  public vcodef(data:string): Promise<AxiosResponse<UserModule>> {
    return HttpRequest().post("user/client/vcodef",{ code: data});
  }

  public userInfo():Promise<AxiosResponse<UserModule>> {
    return HttpRequest().get(`user/client/info`);
  }

} 

export interface Login{
  mobilephone: string;
  password: string;
  code:string;
}

export interface Register{
  username: string;
  password: string;
  rpassword: string;
  email:string;
  mobilephone:string;
}

export interface Forget{
  email?:string;
  username:string;
  mobilephone?:string;
  code:string;
}

export default new UserModule();
