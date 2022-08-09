<template>
  <div @mousemove="BulletEditorMouseMove" @mouseleave="BulletEditorMouseOut" class="BulletEditor relative">
    <img class="cursor-pointer" :src="imgUrl[CImg]" width="22" height="22">
    <div v-if="isShowEditor" class="BulletEditorMain absolute z-50 flex flex-col">
      <div class="BulletEditorMain-item-1 flex flex-row items-center justify-between">
        <div class="item-1-label text-white mr-msm mt-bs">不透明度</div>
        <MSlider 
            v-model="opacity"
            progressDisplay="horizontal" 
            :progressWidth="160" 
            :progressHeight="3" 
            progressBgColor="#fff" 
            :progressRadioSize="11" 
            :progressOutWidth="0" 
            :progressMinData="0.1"
            :progressMaxData="1"
            type="primary"
            progressOutBgColor="red"/>
        <div class="item-1-opacity text-white ml-bs ">{{(opacity * 100 > 10 ? opacity * 100 : 10).toFixed(0)}}%</div>
      </div>
      <div class="BulletEditorMain-item-1 flex flex-row items-center justify-between">
        <div class="item-1-label text-white mr-msm  mt-bs">弹幕字号</div>
        <MSlider 
            v-model="size"
            progressDisplay="horizontal" 
            :progressWidth="160" 
            progressStepColor="rgba(254,95,85,1)"
            :progressHeight="3" 
            progressBgColor="#fff" 
            :progressRadioSize="11" 
            :progressOutWidth="0" 
            :progressStep="100/12"
            :progressMinData="50"
            progressShowStep
            :progressMaxData="170"
            type="primary"
            progressOutBgColor="red"/>
        <div class="item-1-opacity text-white ml-bs ">{{size.toFixed(0)}}%</div>
      </div>
      <div class="BulletEditorMain-item-1 flex flex-row items-center justify-between">
        <div class="item-1-label text-white mr-msm  mt-bs">弹幕速度</div>
        <MSlider 
            v-model="speed"
            progressDisplay="horizontal" 
            :progressWidth="160" 
            :progressHeight="3" 
            progressBgColor="rgb(66,66,66)" 
            :progressRadioSize="11" 
            :progressOutWidth="0" 
            :progressMinData="1"
            :progressMaxData="5"
            :progressStep="25"
            progressShowStep
            type="primary"
            :mark="marks"
            progressOutBgColor="red"/>
        <div class="item-1-opacity text-white ml-bs">{{speed.toFixed(0)}}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { convertDoubleToInt } from '@/common/utils';
import { ref,defineEmits, watch } from 'vue';
import MSlider from '../From/Slider/MSlider.vue';

export interface From{
  opacity:number;
  size:number;
  speed:number;
}

interface Emits{
  (event:'ChangeFrom',Data:From):void;
}

const emit = defineEmits<Emits>();

//弹幕icon图片
const imgUrl = [
  require("@/images/bullet-ac.png"),
  require("@/images/bullet-no.png"),
]
const CImg = ref(1);

//显示编辑框
const isShowEditor = ref(false);

//弹幕属性设计
const opacity = ref(1);
const size = ref(50);
const speed = ref(1);
const marks = ref<Mark>({
  0:  {
    style: {
      color: 'rgba(118,118,118,1)',
    },
    label: '极慢',
  },
  50: {
    style: {
      color: 'rgba(118,118,118,1)',
    },
    label: '适中',
  },
  100: {
    style: {
      color: 'rgba(118,118,118,1)',
    },
    label: '极快',
  },
})

let BulletEditorTimer = 0;

//移动鼠标显示编辑框
const BulletEditorMouseMove = () => {
  if(BulletEditorTimer)clearTimeout(BulletEditorTimer);
  isShowEditor.value = true;
  CImg.value = 0;
}

//移出500ms之后隐藏编辑框
const BulletEditorMouseOut = () => {
  CImg.value = 1;
  BulletEditorTimer = setTimeout(() => {
    isShowEditor.value = false;
  }, 300) as unknown as number;
}

watch(
  () => [opacity.value,size.value,speed.value],
  () => emit("ChangeFrom",
                        { 
                          opacity:convertDoubleToInt(opacity.value,2),
                          size:convertDoubleToInt(size.value),
                          speed:convertDoubleToInt(speed.value), 
                        })
)

</script>

<style lang="scss" scoped>
.BulletEditor{ 
  margin-right: 20px;
}
.BulletEditorMain{ 
  width: 300px;
  height: 300px;
  background-color: rgba(0, 0, 0,.5);
  left: -161px;
  transform: translateY(-350px);
  font-size: 12px;
  padding: 10px;
  opacity: 1;
}
.item-1-opacity {
  width: 30px;
}
</style>