import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { NoTokenException } from '../HttpException/AuthException';

//处理Token请求头
@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
    const res = context.getArgs()[0] as Request;
    const Token = res.headers["authtoken"];
    if (Token) {
      return true;
    }
    else throw new NoTokenException("No Token");
  }
}