import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { CResponseSend, ResponseSend } from "src/common/ResponseSend";

/**
 * 自定义异常过滤器，捕获 HttpException
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const Status = exception.getStatus();
    const ExceptionMessage = exception.message;

    const resData = {
      timestamp: new Date().toISOString(),
      path: request.url,
      message: ExceptionMessage,
    }

    ResponseSend(new CResponseSend(Status, ExceptionMessage, "failed", resData, response));
  }
}