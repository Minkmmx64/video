import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";
import { CResponseSend, ResponseSend } from "src/common/ResponseSend";
import { UserService } from "./user.service";
import * as Svg from "svg-captcha";
import { NotNull } from "src/lib/decorator/NotNull";
import { NoTokenException, ServiceException } from "src/lib/HttpException/AuthException";
import { HttpExceptionFilter } from "src/lib/HttpException";
import { IRegister, ISession, ISessionStorage } from "./user.dto";
import { TokenGuard } from "src/lib/Guards/useGuards";
import { ObtainToken } from "src/lib/decorator/ObtainToken";

@ApiTags("客户端用户类")
@Controller("/user/client")
@UseFilters(HttpExceptionFilter)
export class UserController{

  constructor(private readonly UserServices: UserService) { }

  private readonly regexPsd = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;

  private readonly regexEmail = /^\w{1,18}@[a-z0-9]+(\.[a-z]{2,4})+$/i;

  private readonly regexUname = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,10}$/;
  
  @Get("/vcode")
  public async vcode(
                  @Res() res: Response,
                  @Req() req: Request & ISession
    ) {
    const SvgCaptcha = Svg.create({
      noise: 5,
      color: true
    });
    req.session.code = SvgCaptcha.text;
    res.cookie("sessionId", req.sessionID);
    ResponseSend(new CResponseSend(HttpStatus.OK, "获取验证码成功", "success", SvgCaptcha.data, res));
  }

  @Post("/vcodef")
  public async vcodef(
                    @Res() res: Response,
                    @Req() req: Request & ISessionStorage,
                    @Body("code") @NotNull("body.code") code:string
  ) {
    const sessionId = req.cookies["sessionId"];
    console.log(sessionId);
    
    if (sessionId) {
      const SessionJSON = req.sessionStore.sessions[sessionId];
      const Session = JSON.parse(SessionJSON);
      if (code.toLocaleLowerCase() === (Session.code as string).toLocaleLowerCase()) {
        ResponseSend(new CResponseSend(HttpStatus.OK, "验证成功", "success", "ok", res));
      }
      else throw new NoTokenException("验证码错误");
    } else throw new ServiceException("没有sessionId");
  }

  @Post("/register")
  public async register(
                      @Body("email") @NotNull("body.email") email: string,
                      @Body("mobilephone") @NotNull("body.mobilephone") mobilephone: string,
                      @Body("password") @NotNull("body.password") password: string,
                      @Body("username") @NotNull("body.username") username: string, 
                      @Body("rpassword") @NotNull("body.rpassword") rpassword: string,
                      @Res() res: Response
  ) {
    const Register: IRegister = {
      email: email,
      mobilephone: mobilephone,
      username: username,
      password: password
    }
    if (rpassword !== password) {
      throw new NoTokenException("两次密码不匹配");
    } else if (!this.regexPsd.test(mobilephone)) {
      throw new NoTokenException("手机号无效");
    } else if (!this.regexEmail.test(email)) {
      throw new NoTokenException("邮箱无效");
    } else if(!this.regexUname.test(username)){
      throw new NoTokenException("中文数字字母下划线2-10个字符");
    }
    const data = await this.UserServices.register(Register);
    ResponseSend(new CResponseSend(HttpStatus.OK, "成功", "success", data, res));
  }

  @Post("/login")
  public async login(
                    @Body("password") @NotNull("body.password") password:string,
                    @Body("mobilephone") @NotNull("body.mobilephone") mobilephone:string,
                    @Res() res:Response
  ){
    const AuthToken = await this.UserServices.login(mobilephone,password);
    ResponseSend(new CResponseSend(HttpStatus.OK, "登录成功", "success", AuthToken , res));
  }

  @Get("/info")
  @UseGuards(TokenGuard)
  public async info(@Res() res: Response, @ObtainToken("authtoken") Token: string) {
    const Info = await this.UserServices.info(Token);
    ResponseSend(new CResponseSend(HttpStatus.OK, "登录成功", "success", Info , res));
  }

}