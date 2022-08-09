export class CommonModules<T> {
  status = "200";
  message = "消息";
  code = 200;
  meta = {
    count: 0
  };
  body = {} as T;
}