<template>
  <div class="icon flex flex-row items-center justify-center" 
    :style="{
      height: h? h + 'px' : '60px',
      justifyContent: center ? 'center' : 'start'
    }">
      <i :class="`iconfont `+icon" 
        :style="{
          fontSize: size ? size + 'px' : '16px'
        }" />
        <div v-if="title !== undefined && title !== ''" :class="{'ml-msm' : ml }" 
          :style="{
            fontSize: '12px',
            color: TextColor ? TextColor : '#fff'
          }">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps,toRefs,withDefaults } from "vue";
interface IProps{
  //文字
  title?: string | number;
  //图标
  icon?: string; 
  //图标
  size?: number;
  //内容高度
  h?: number;
  //居中
  center?: boolean;
  //文字颜色
  TextColor?: string;
  //左边距
  ml?:boolean;
}
const props = withDefaults(
  defineProps<IProps>(),
  {
    ml:true
  }
);
const { title, icon, size, h , center , TextColor , ml } = toRefs(props);
</script>

<style lang="scss" scoped>

</style>
