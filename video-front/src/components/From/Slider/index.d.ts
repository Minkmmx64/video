declare module 'glolbal';

/**
 * Slider标记类型
 */
type Mark = Record<number, IMark | string>;
interface IMark {
  style: {
    color: string;
  };
  label: string;
}

/**
 * Slider组件参数
 */
interface IProps {
  /**
   * 水平 | 垂直
   */
  progressDisplay: "horizontal" | "vertical";
  /**
   * 进度条宽度
   */
  progressWidth: number;
  /**
   * 进度条高度
   */
  progressHeight: number;
  /**
   * 初始进度条背景颜色
   */
  progressBgColor: string;
  /**
   * 进度条圆点大小
   */
  progressRadioSize: number;
  /**
   * 进度条外围容器宽度;
   */
  progressOutWidth: number;
  /**
   * 外围容器背景色
   */
  progressOutBgColor: string;
  /**
   * 进度条数据
   */
  modelValue: number;
  /**
   * 是否显示数值弹框
   */
  progressShowData?: boolean;
  /**
   * 进度条基本类型
   */
  type: "primary" | "danger" | "warn" | "info" | "success"
  /**
   * 步长
   */
  progressStep?: number;
  /**
   * 是否显示步长指示器
   */
  progressShowStep?: boolean;
  /**
   * 最小值
   */
  progressMinData?: number;
  /**
   * 最大值
   */
  progressMaxData?: number;
  /**
   * 计算属性，用来计算比例，v-model绑定的是0-1的值，如果过传别的需要传计算函数
   */
  progressComputed?: (val: number) => number;
  /**
   * 显示标记
   */
  mark?: Mark;
  /**
   * 步长指示器颜色
   */
  progressStepColor?: string;
}

/**
 * Slider组件事件
 */
interface Emits {
  /**
   * 隐藏进度条，非必要。
   */
  (event: 'close'): void;
  /**
   * 回传当前值
   */
  (event: 'update:modelValue', E: number): void;
  /**
   * 回传事件
   */
  (event: 'change', E: number): void;
}