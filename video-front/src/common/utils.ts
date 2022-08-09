//将秒转换成 aa:bb:cc
export function convertTime(Time: number) {
  const h = Math.floor((Time / 3600));
  Time -= 3600 * h;
  const m = Math.floor((Time / 60));
  Time -= m * 60;
  const s = Math.floor(Time);
  const str = `${h > 9 ? `${h}` : `0${h}`} : ${m > 9 ? `${m}` : `0${m}`} : ${s > 9 ? `${s}` : `0${s}`}`
  return str.replace(/00 :/, () => "");
}
//小数转换成整数 || 指定位数的小数
export function convertDoubleToInt(DD: number, T?: number) {
  if (T) return parseFloat(DD.toFixed(T))
  else return parseInt(DD.toFixed(0));
}
//判断是不是有效的key
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}
//随机生成4位uuid
export function uuid():string {
  return (Math.random() * 9000 + 1000).toFixed(0);
}
//深拷贝
export function deepClone<T>(obj: T): T{
  const CloneObj = {} as T;
  for (const k in obj) {
    const o = obj[k];
    if (Object.prototype.toString.call(o) === "[Object object]") {
      CloneObj[k] = deepClone(o);
    } else if (o instanceof Array) {
      CloneObj[k] = o.map(Iteration => deepClone(Iteration)) as unknown as T[Extract<keyof T, string>];
    } else CloneObj[k] = o;
  }
  return CloneObj;
}