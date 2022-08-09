//将秒转换成 aa:bb:cc
export function convertTime(Time: number) {
  const h = Math.floor((Time / 3600));
  Time -= 3600 * h;
  const m = Math.floor((Time / 60));
  Time -= m * 60;
  const s = Math.floor(Time);
  const str = `${h > 9 ? `${h}` : `0${h}`} : ${m > 9 ? `${m}` : `0${m}`} : ${s > 9 ? `${s}` : `0${s}`}`
  return str;
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
//字符串判空
export function isNullOrEmpty(str: string | null | undefined | unknown): boolean {
  return !str || typeof str === 'undefined' || str === ''
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
//将秒转换成 天,时,分,秒
export function convertTimeToDHMS(Seconds: number) {
  const Day = 60 * 60 * 24; //一天多少秒
  const H = 60 * 60; //一小时多少秒
  const M = 60;
  const DD = Math.floor(Seconds / Day); //多少天,向下取整
  const S1 = Seconds - Day * DD;  //剩下多少秒
  const HH = Math.floor(S1 / H); //多少小时
  const S2 = S1 - HH * H; //剩下多少秒
  const MM = Math.floor(S2 / M);
  const SS = S2 - M * MM;
  console.log(DD,HH,MM,SS);
  return {
    D: DD,
    H: HH,
    M: MM,
    S:SS
  }
}