import { Response } from "express";

export class CResponseSend{

  public body = {};
  public code = 200;
  public message = "";
  public meta = {};
  public status = "success" as "success" | "failed";
  public res = {} as Response;

  constructor(code: number, message: string, status: "success" | "failed",body: any,res:Response,meta?:any) {
    this.body = body;
    this.code = code;
    this.message = message;
    this.status = status;
    this.res = res;
    this.meta = meta;
  }

  public Send() {
    this.res.status(this.code);
    this.res.send(this.ResBody())
  }

  public ResBody() {
    return {
      body: this.body,
      code: this.code,
      status: this.status,
      message: this.message,
      meta:this.meta,
    }
  }
}

export function ResponseSend(CC: CResponseSend) {
  CC.Send();
}