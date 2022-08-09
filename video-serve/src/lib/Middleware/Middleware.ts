import { Request, Response ,NextFunction} from "express";

//添加全局中间件
export function Middleware(req: Request, res: Response, next: NextFunction) {
  next();
}