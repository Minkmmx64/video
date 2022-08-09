//获取时间 YYYY_MM_DD
export function getTMD():string{
  const YYYY = new Date().getFullYear();
  const MM = new Date().getMonth() + 1;
  const DD = new Date().getDate();
  return YYYY + '_' + MM + '_' + DD;
}
//isNullorUndefined
export function isNullorUndefined( Param: any) {
  return Param !== null && Param !== undefined && Param !== "";
}