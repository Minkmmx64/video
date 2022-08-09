<template>
  <span 
    :class="`IconFronV2 text-center cursor-pointer flex ${hover ? 'Ihover' : ''}`" 
    :style="{
      ...SelectStyle(),
      color: textColor,
      marginLeft: '5px'}">
    <i v-if="show" :class="`iconfont transition-all ${icon}`" :style="{
      fontSize: '18px'
    }" />
    <div :class="`text ${hoverTitlt ? 'hoverTitle' : ''}`" v-if="title !== ''" :style="{
      color: textColor,
  fontSize: '14px',
      marginLeft: (space ? space : 0) + 'px'
    }">{{ title }}</div>
  </span>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, toRefs, StyleValue } from "vue";

interface IProp{
  //排列方式 水平 垂直
  align?: "vertical" | "horizontal",
  //图标
  icon?: string;
  //文字
  title?: string;
  //是否居中
  center?: boolean;
  //文字颜色
  textColor?: string;
  //移到元素是否触发icon动画
  hover?: boolean;
  //是否触发title动画
  hoverTitlt?:boolean;
  //是否显示图标
  show?: boolean;
  //文字，图标间距
  space?: number;
}

const props = withDefaults(
  defineProps<IProp>(),
  {
    align: "horizontal",
    icon: "icon-guanli",
    title: '',
    center: false,
    textColor: "rgb(255,255,255)",
    show: true,
    hoverTitlt:false,
  }
);

const { icon, align, center } = toRefs(props);

const SelectStyle = (): StyleValue=> {
  if (align.value === "horizontal") {
    return {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: center.value ? "center" : "start"
    }
  } else {
    return {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: center.value ? "center" : "start"
    }
  }
}
</script>

<style lang="scss" scoped>
.IconFronV2{
  min-width: 60px;
  font-size: 18px;
}
.Ihover{
  cursor: pointer;
  &:hover > .iconfont{
    animation: HoverAnim 300ms  ease;
    animation-fill-mode: keywords;
  }
}
.hoverTitle{
  cursor: pointer;
  &:hover {
    animation: HoverAnim 300ms  ease;
    animation-fill-mode: keywords;
  }
}
@keyframes HoverAnim{
  0%{
    transform:translateY(0px);
  }
  50%{
    transform:translateY(-5px);
  }
  100%{
    transform:translateY(0px);
  }
}
</style>