import { HttpException, HttpStatus } from "@nestjs/common";


//没有Token
export class NoTokenException extends HttpException {
  constructor(message:string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

//服务器异常
export class ServiceException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}



