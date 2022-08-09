import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export const NotNull = createParamDecorator(
  (datas: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const DataParam = datas.split(".");
    try {
      let data = undefined;
      DataParam.map((k, Index) => {
        if (Index === 0) {
          data = request[k];
        } else data = data[k];
      })
      if (data === null || data === undefined || data === "") {
        throw new HttpException(datas + ' not null', HttpStatus.PRECONDITION_FAILED);
      }
    } catch (error) {
      throw new HttpException(new Error(error as string).message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },
);