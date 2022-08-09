<template>
  <div 
    v-if="isError"
    @mousedown="ProgressMouseDown"
    @click="ClickKeyDown"
    @touchstart="ProgressTouchStart"
    class="progress-main cursor-pointer flex flex-wrap justify-center items-center" 
    @keydown="ProgressKeyDown"
    :style="progressOutWidth ? selectRadius(true) : selectRadius(false)">
    <div 
      class="progress relative" 
      ref="progress"
      :style="{
        width:(progressDisplay === 'horizontal' ? progressWidth : progressHeight) + 'px',
        height:(progressDisplay === 'horizontal' ? progressHeight : progressWidth) + 'px',
        backgroundColor: progressBgColor,
        borderRadius:'20px'
      }">
      <template v-if="mark">
        <div class="progress-mark absolute" v-for="(item,index) in mark" :key="index" :style="{
          ...selectMark(progressDisplay,index),
          color: typeof item === 'string' ? '#909399' : item.style.color
          }" >{{typeof item === "string" ? item : item.label}}</div>
      </template>
      <!-- 显示指示器 -->
      <div v-if="progressShowStep && progressStep" class="showStep absolute w-full h-full">
        <div class="stepradio relative w-full h-full">
          <div class="step absolute z-50" v-for="(item,index) in StepArray" :key="index" >
            <div 
              class="absolute"
              v-if="progressShowStep && progressStep && ( index !== (StepArray.length - 1) && index !== 0)"
              :style="{
                height:progressHeight + 'px',
                width:progressHeight + 'px',
                backgroundColor: progressStepColor ? progressStepColor : 'rgba(250, 250, 250, 1)',
                top:progressDisplay === 'horizontal' ? '0%' : (item / 100) * progressWidth + 'px',
                left: progressDisplay === 'horizontal' ? (item / 100) * progressWidth + 'px' : '0%',
                borderRadius: '50%'}" />
          </div>
        </div>
      </div>
      <div 
        class="ab-progress absolute" 
        :style="{
          width:(progressDisplay === 'horizontal' ? CustProgressWidth + 'px' : '100%'),
          height:(progressDisplay === 'horizontal' ? '100%' : CustProgressWidth + 'px'),
          borderRadius:'20px',
          ...(progressDisplay === 'horizontal' ? { left : '0%' } : { bottom : '0%' })
        }">
        <div 
          class="ac-propgress relative" 
          :style="{ 
            backgroundColor:selectType(type),
            borderRadius:'20px'
          }">
          <div 
            @mousemove="RadioShowMove"
            @mouseout="RadioShowOut"
            class="radio absolute cursor-pointer transition-all duration-300" 
            :style="{
              width:progressRadioSize + 'px',
              height: progressRadioSize + 'px',
              backgroundColor: '#fff',
              border: '3px solid '+ selectType(type),
              ...selectPosition(progressDisplay)}"></div>
            <template v-if="isShowData">
              <div class="radios relative w-full h-full">
                <div class="showdata absolute text-white text-center transition-all duration-300" :style="{
                  right: - ( 20 ) + 'px',
                  top: 1.2 * progressRadioSize + 'px',
                  height: '30px',
                  width: '40px',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  backgroundColor:'rgba(0,0,0,1)',
                  borderRadius: '5px',
                  lineHeight: '30px',
                }">{{( parseFloat(progressData.toFixed(2)) )}}</div>
              </div>
            </template>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps,toRefs,ref,defineEmits, onMounted, onBeforeUnmount, watch ,withDefaults, computed } from "vue";
import { useKeydown,useSelect } from "./useSlider";

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
  progressBgColor?: string;
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

const props = withDefaults(
  defineProps<IProps>(),
  {
    progressMinData:0,
    progressMaxData:100,
    mark: () => { return {} },
    progressBgColor: "rgba(255,255,255,1)",
    progressOutBgColor: "rgba(255,255,255,1)"
  }
)
//计算当前值
const progressData = computed( () => {
  const C = progressMinData.value + (progressMaxData.value - progressMinData.value) * (CustProgressWidth.value / progressWidth.value);
  if(progressComputed?.value){
    try {
      const CC = progressComputed.value(C);
      return CC;
    } catch (error) {
      console.warn(error);
      return C;
    }
  }else return C
} )

const emit = defineEmits<Emits>();
const { 
        progressBgColor,
        progressDisplay,
        progressHeight,
        progressOutWidth,
        progressRadioSize,
        progressWidth,
        modelValue,
        type,
        progressShowData,
        progressMaxData,
        progressMinData,
        progressStep,
        progressComputed,
        mark,
        progressShowStep,
        progressStepColor
} = toRefs(props);
const CustProgressWidth = ref();
const StepArray = ref<number[]>([]);
const progress = ref<HTMLDivElement>(document.createElement("div"));
const isShowData = ref(false);
//拷贝ModelValue的值
const CurrentModelValue = ref(0);
const isError = ref(true);

const { ProgressKeyDown } = useKeydown(progressWidth,CustProgressWidth,progressStep);

const { selectRadius,selectPosition,selectType,selectMark } = useSelect(toRefs(props));

const Update = () => {
  emit("update:modelValue",progressMinData.value + (CustProgressWidth.value / progressWidth.value) * (progressMaxData.value - progressMinData.value))
  emit("change",progressMinData.value + (CustProgressWidth.value / progressWidth.value) * (progressMaxData.value - progressMinData.value))
}

watch(
  () => [progressWidth.value,CustProgressWidth.value],
  () => 
    Update()
)

const ProgressFunc = (e:{clientX:number,clientY:number},Rect:DOMRect) => {
  const { left , bottom } = Rect;
  if(progressDisplay.value === "horizontal"){
    if(e.clientX - left < 0 ){
      CustProgressWidth.value = 0;
    }
    else if( e.clientX - left > progressWidth.value){
      CustProgressWidth.value = progressWidth.value
    }
    else {
      if(StepArray.value.length){
        let p = parseInt(( ((e.clientX - left) / progressWidth.value) * 100 ).toFixed(0));
        for(let i = 0;i < StepArray.value.length;i++){
          if(StepArray.value[i] - p <= 1){
            CustProgressWidth.value = ( StepArray.value[i] / 100 ) * progressWidth.value;
          }
        }
      }else CustProgressWidth.value = e.clientX - left;
    }
  }else{
    if(bottom -  e.clientY < 0){
      CustProgressWidth.value = 0
    }else if(bottom -  e.clientY > progressWidth.value){
      CustProgressWidth.value = progressWidth.value;
    }
    else {
      if(StepArray.value.length){
        let p = parseInt(( ((bottom -  e.clientY) / progressWidth.value) * 100 ).toFixed(0));
        for(let i = 0;i < StepArray.value.length;i++){
          if(Math.abs(StepArray.value[i] - p) <= 1){
            CustProgressWidth.value = ( StepArray.value[i] / 100 ) * progressWidth.value;
          }
        }
      }else CustProgressWidth.value = bottom -  e.clientY;
    }
  }
}

//点击slider触发键盘事件
const ClickKeyDown = (e:MouseEvent) => {
  e.stopPropagation();
  window.removeEventListener("keydown",ProgressKeyDown);
  window.addEventListener("keydown",ProgressKeyDown);
}

//显示数据
const RadioShowMove = () => {
  if(progressShowData?.value){
    isShowData.value = true;
  }
}

//隐藏数据
const RadioShowOut = () => {
  if(progressShowData?.value){
    isShowData.value = false;
  }
}

const ProgressMouseDown = (e:MouseEvent) => {
  ProgressFunc(e,progress.value.getBoundingClientRect());
  Update()
  window.addEventListener("mousemove",_ProgressMouseMove)
}

const _ProgressMouseMove = (e:MouseEvent) => {
  if(progressShowData?.value){
    isShowData.value = true;
  }
  e.preventDefault();
  ProgressFunc(e,progress.value.getBoundingClientRect());
  Update()
}

function CompomentDomClickEvent(){
  isShowData.value = false;
  if(progressShowData?.value){
    isShowData.value = false;
  }
  window.removeEventListener("keydown",ProgressKeyDown);
  emit("close");
}

function _CancelMouseMove(){
  emit("close");
  window.removeEventListener("mousemove",_ProgressMouseMove);
}

/**
 * touch事件有bug
 */
const _ProgressTouchMove = (e:TouchEvent) => {
  if(progressShowData?.value){
    isShowData.value = true;
  }
  ProgressFunc(e.touches[0],progress.value.getBoundingClientRect());
  Update()
}

function _CancelTouchMove(){
  window.removeEventListener("touchmove",_ProgressTouchMove);
}

const ProgressTouchStart = () => {
  window.addEventListener("touchmove",_ProgressTouchMove,true)
}

onMounted(() => {
  CurrentModelValue.value = ( modelValue.value - progressMinData.value) / (progressMaxData.value - progressMinData.value);
  CustProgressWidth.value = CurrentModelValue.value * progressWidth.value;
  if(progressStep?.value){
    let k = 0;
    for(let i = 0;;i+=progressStep.value){
      if(i > 100)break;
      else StepArray.value[k++] = i;
    }
  }
  window.addEventListener("click",CompomentDomClickEvent)
  window.addEventListener("mouseup",_CancelMouseMove)
  window.addEventListener("touchend",_CancelTouchMove)  
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown",ProgressKeyDown);
  window.removeEventListener("mouseup",_CancelMouseMove)
  window.removeEventListener("mousemove",_ProgressMouseMove);
  window.removeEventListener("click",CompomentDomClickEvent);
  window.removeEventListener("touchend",_CancelTouchMove);
})
</script>

<style lang="scss" scoped>
.progress{ 
  box-sizing: border-box;
  border-radius: 5%;
  .radio{ 
    border-radius: 50%;
    z-index: 100;
    &:hover{
      transform: scale(1.4);
    }
  }
  .ac-propgress {
    width: 100%;
    height: 100%;
    z-index: 99;
  }
}
 .progress-main {
    box-sizing: border-box;
  }
  .ab-progress {
    border-radius: 5%;
  }

  .showdata{
    animation: show 500ms ease;
    animation-fill-mode: keywords;
  }
  @keyframes show{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  .progress-mark{
    color: #909399;
    font-size: 12px;
    white-space: nowrap
  }
</style>