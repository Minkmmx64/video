<template>
  <div class="StepBar" :style="{
    width: width + 'px'
  }">
    <div class="StepProgress w-full flex flex-row items-center flex-nowrap" ref="StepProgress">
      <div class="Child flex flex-col flex-shrink-0" v-for="(item,index) in StepData" :key="index">
        <div class="Top flex flex-row items-center">
          <div class="radio flex-shrink-0 flex flex-row justify-center items-center" :style="{
            borderColor: item.step < currentStep ? 'rgb(103,194,58)' : item.step === currentStep ? 'rgb(230,162,60)' : 'rgb(144,147,153)'
          }">{{ item.step }}</div>
          <div v-if="index !== StepData.length - 1" class="line" :style="{
            backgroundColor: item.step < currentStep ? 'rgb(103,194,58)' : item.step === currentStep ? 'rgb(230,162,60)' : 'rgb(144,147,153)'
          }"></div>
        </div>
        <div class="text text-center" :style="{
            color: item.step < currentStep ? 'rgb(103,194,58)' : item.step === currentStep ? 'rgb(230,162,60)' : 'rgb(144,147,153)'
          }">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="content relative" ref="Father">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup name="StepBar">
import { defineProps, ref, watch, withDefaults, toRefs, onMounted } from "vue";
import { deepClone } from "@/common/utils";

export interface DataProps{
  //步骤条名称
  name: string;
  //步骤条进度
  step: number;
}

interface IProps {
  //步骤条宽度
  width: number;
  //当前进度
  currentStep: number;
  //总步骤
  StepData: DataProps[];
}

const Props = withDefaults(
  defineProps<IProps>(),
  {
    width: 400,
    currentStep: -1,
  }
)

const { width, currentStep, StepData } = toRefs(Props);
const StepProgress = ref<HTMLElement | null>(null);
const Father = ref<HTMLElement & { __vnode: { children: [{ children: [{ type : { name : string} }] }] } } & { children : HTMLElement[] } | null>(null);
const CHildNodes = ref<HTMLElement[] | null>(null);
const DisScroll = ref(0);

watch(
  () => [currentStep.value],
  ([newV], [oldV]) => {
    if (newV > oldV) {
      useScroll(true);
    } else {
      useScroll(false);
    }
    __update__();
  }
);

const useScroll = (flag:boolean) => {
  if (StepProgress.value) {
    //滚动条最多滚这么多距离
    DisScroll.value = StepProgress.value.scrollWidth - width.value;
    //前2次和最后一次不滚动
    if (currentStep.value > 2 && currentStep.value < StepData.value.length && flag && StepProgress.value.scrollLeft < DisScroll.value) {
      const X = (currentStep.value - 2) * 200;
      let x = (currentStep.value - 3) * 200;
      const I = setInterval(() => {
        if (StepProgress.value) {
          if (x + 2 <= X) {
            StepProgress.value.scrollLeft += 2;
            x += 2;
          } else {
            StepProgress.value.scrollLeft = X;
            clearInterval(I);
          }
        }
      }, 2);
    }else {
      if (!flag && currentStep.value <= StepData.value.length - 2) {
        const X = (currentStep.value - 2) * 200;
        const I = setInterval(() => {
        if (StepProgress.value && X >= 0 ) {
          if ( StepProgress.value.scrollLeft - 2 >= X) {
            StepProgress.value.scrollLeft -= 2;
          } else {
            StepProgress.value.scrollLeft = X;
            clearInterval(I);
          }
        }
      }, 2);
      }
    }
  }
}

const __init__ = () => {
  if (CHildNodes.value) {
    if (CHildNodes.value.length !== StepData.value.length) console.warn("Slot element is inconsistent with the number of steps");
    [...CHildNodes.value].map( ( v, i ) => {
      v.classList.add("absolute");
      v.classList.add("transition-all");
      v.classList.add("duration-500");
      v.classList.add("flex");
      v.classList.add("flex-col");
      v.style.left = i * 100 + '%';
      v.style.top = "0%";
      v.style.backgroundColor = "#fff" ;
    })
  }
}

const __update__ = () => {
  if (CHildNodes.value && currentStep.value <= StepData.value.length) {
    [...CHildNodes.value].map( ( v, i ) => {
      v.style.left = ( i - (currentStep.value - 1)) * 100 + '%';
    })
  }
}

onMounted(() => {
  if (Father.value && Father.value.__vnode && Father.value.__vnode.children) {
    const Node = deepClone(Father.value.children);
    try {
      Father.value.__vnode.children[0].children.map(( _, index ) => {
        if (Father.value && _.type.name !== "StepBarContent") {
          Father.value.removeChild(Node[index]);
        }
      });
      CHildNodes.value = Father.value.children;
      __init__();
    } catch (error) {
      console.warn("Non label root elements are not supported");
      console.warn(error);
    }
  }
})

</script>

<style lang="scss" scoped>
.StepBar{
  border: 1px dashed rgb(64,158,255);
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: 100;
}
.StepProgress{
  user-select: none;
  .Child{
    width: 200px;
    .radio{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border-width: 3px;
      border-style: solid;
    }
    .line{
      border: none;
      width: 100%;
      height: 3px;
    }
  }

  &::-webkit-scrollbar {
    width: 0px; //对垂直方向滚动条
    height: 0px; //对水平方向滚动条
    scroll-behavior: smooth;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(0, 0, 0,1) //滚动条的颜色
  }
  overflow: scroll;
}
.content{
  width: 100%;
  min-height: 500px;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 1px; //对垂直方向滚动条
    height: 0px; //对水平方向滚动条
    scroll-behavior: smooth;
  }
}

.text{
  color: rgba(254,95,85,1);
  font-size: 14px;
}

</style>