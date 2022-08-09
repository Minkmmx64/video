import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface ReqHeaders {
  authtoken: string;
}

export const ObtainToken = createParamDecorator(
  (datas: keyof ReqHeaders, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    return datas ? ( request.headers[datas] ? request.headers[datas] : request.headers ) : request.headers ;
  },
);