// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Bullets {
  /**
  * 坐标
  */
  export interface Point {
    x: number;
    y: number;
  }

  /**
   * 弹幕类型 底部,顶部,滚动
   */
  export type Tpye = "bottom" | "top" | "scroll"

  /**
   * 自定义弹幕文字样式
   */
  export interface CustomText {
    color: string;
    text: string;  
    size: number;  //大小 0小 1标准
    type: Tpye; 
  }

  //全局弹幕样式，不需要放在弹幕属性里
  //弹幕缩放比例
  export interface GlobalBullet{
    opacity: number;
    speed?: number;
    size: number;     
  }

  /**
   * 弹幕属性
   */
  export interface Attribute {
    //字号
    size: number;
    //坐标 默认x轴为0,y轴随机
    currentPoint: Point;
    //弹幕颜色
    color: string;
    //初始速度
    speed: number;
    //弹幕内容
    text: string;
    //发送时间
    time: number;
    //透明度
    opacity: number;
    //类型滚动，顶部，底部
    type: Tpye;
    //是否显示
    show: boolean;
  }

  /**
   * 弹幕类
   */
  export class CCBullet {
    
    /**
     * 是否暂停
     */
    private Flag = 0;
    /**
     * 暂停时的时间
     */
    private Timer = 0;

    /**
     * 弹幕尺寸 √
     */
    public size = 0 as number;

    /**
     * 弹幕坐标
     */
    public currentPoint = {
      x: 0,
      y: 0
    } as Point

    /**
     * 弹幕颜色 √
     */
    public color = "rgba(0,0,0,0)" as string;

    /**
     * 弹幕速度 √
     * 随机[4-10]秒
     */
    public speed = 0 as number;

    /**
     * 弹幕文字 √
     */
    public text = "" as string;

    /**
     * 弹幕发送时间
     * 当前视频播放到第几秒出现
     */
    public time = 0 as number;

    /**
     * 不透明度 √
     */
    public opacity = 0 as number;

    /**
     * 弹幕类型 √
     */
    public type = "" as Tpye;

    /**
     * 是否显示弹幕
     */
    public show = true as boolean;

    constructor(Bullet: Attribute) {
      this.color = Bullet.color;
      this.currentPoint = Bullet.currentPoint;
      this.text = Bullet.text;
      this.time = Bullet.time;
      this.size = Bullet.size;
      this.speed = Bullet.speed;
      this.opacity = Bullet.opacity;
      this.type = Bullet.type;
      this.show = true;
    }

    /**
     * 弹幕滚动
     */
    public Start() {
      setTimeout(() => {
        this.show = false;
      }, this.speed * 1000);
    }

    /**
     * 悬停弹幕停止滚动
     */
    public Stop() {
      this.show = false;
    }

  }  
}