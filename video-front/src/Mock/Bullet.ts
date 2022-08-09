import { Bullets } from "@/Modules/Bullet";

export const MockBullet:Bullets.Attribute[] = [
  {
    "size": 12,
    "currentPoint":{ "x": 0, "y": 376 },
    "color": "#FFFFFF",
    "speed": 5,
    "text": "333",
    "time": 0,
    "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 161 },
    "color": "#FFFFFF",
    "speed": 8,
    "text": "333",
    "time": 0,
    "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 161 },
    "color": "#FFFFFF",
    "speed": 8,
    "text": "333",
    "time": 1,
    "opacity": 1,
    "type": "top",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 161 },
    "color": "#FFFFFF",
    "speed": 8,
    "text": "333",
    "time": 2,
    "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 161 },
    "color": "#FFFFFF",
    "speed": 8,
    "text": "333",
    "time": 3,
    "opacity": 1,
    "type": "top",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 161 },
    "color": "#FFFFFF",
    "speed": 8,
    "text": "333",
    "time": 4,
    "opacity": 1,
    "type": "top",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 161 },
    "color": "#FFFFFF",
    "speed": 8,
    "text": "333",
    "time": 5,
    "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 336 },
    "color": "#FFFFFF",
    "speed": 7,
    "text": "333333",
    "time": 0,
    "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 16,
    "currentPoint": { "x": 0, "y": 395 },
    "color": "#ffffff",
    "speed": 4,
    "text": "321321",
    "time": 48,
    "opacity": 1,
    "type": "bottom",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 322 },
    "color": "#FFFFFF", "speed": 3,
    "text": "32111111113211111111",
    "time": 2, "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 15 },
    "color": "#FFFFFF",
    "speed": 9, "text": "3333333333333333333333333333333333333333333333333333",
    "time": 6,
    "opacity": 1,
    "type": "top",
    "show": true
  },
  {
    "size": 12,
    "currentPoint": { "x": 0, "y": 262 },
    "color": "#ffb6b9",
    "speed": 3,
    "text": "33333333",
    "time": 19,
    "opacity": 1,
    "type": "scroll",
    "show": false
  },
  {
    "size": 16,
    "currentPoint": { "x": 0, "y": 149 },
    "color": "#ffb6b9",
    "speed": 3,
    "text": "321321321",
    "time": 31,
    "opacity": 0.7,
    "type": "bottom",
    "show": false
  },
  {
    "size": 16,
    "currentPoint": { "x": 0, "y": 395 },
    "color": "#000000",
    "speed": 4,
    "text": "321321",
    "time": 41,
    "opacity": 0.4,
    "type": "bottom",
    "show": false
  },
  {
    "size": 16,
    "currentPoint": { "x": 0, "y": 6 },
    "color": "#000000",
    "speed": 3,
    "text": "333333a啊啊啊a啊啊啊",
    "time": 3,
    "opacity": 0.5,
    "type": "bottom",
    "show": false
  }]
  .sort((a, b) => {
    return a.time - b.time;
  }) as Bullets.Attribute[]

  /**
   * 将弹幕转换为Class
   * @param C 
   * @returns {Bullets.CCBullet[]}
   */
function AttributeToCCBullet(C:Bullets.Attribute[]): Bullets.CCBullet[]{
  const res = [] as Bullets.CCBullet[];
  C.map(k => res.push(new Bullets.CCBullet(k)));
  return res
}

/**
 * 转换线性弹幕集合为二维弹幕集合[当面秒数][当前秒的弹幕集合]
 * @param C 弹幕集合
 * @param VideoTime 视频总进度
 * @return {Bullets.CCBullet[time] = Bullets.CCBullet[]}
 */
export function useBulletTimer(C: Bullets.CCBullet[], VideoTime: number): Bullets.CCBullet[][]{
  const res = [] as Bullets.CCBullet[][];
  for (let i = 0; i <= VideoTime; i++){
    res[i] = [];
    for (let j = 0; j < C.length; j++){
      if (C[j].time === i) {
        res[i].push(C[j]);
      }
    }
  }
  return res;
}


export const CCBullet = (T: number) => useBulletTimer(AttributeToCCBullet(MockBullet),T);