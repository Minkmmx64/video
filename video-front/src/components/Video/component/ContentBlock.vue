<template>
  <div ref="ContentBlock" v-if="show" class="ContentBlock cursor-pointer absolute block" :style="{
    width: width + 'px',
    height: height + 'px',
    right: offsetX + 'px',
    top: offsetY + 'px'
  }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, toRefs, ref, watch, nextTick } from "vue";

interface ContentBlockProps{
  //宽度
  width: number;
  //高度
  height: number;
  //x偏移
  offsetX?: number;
  //y偏移
  offsetY?: number;
  //是否可见
  visible: boolean;
}

const show = ref(false);

const Props = withDefaults(
  defineProps<ContentBlockProps>(),
  {
    width: 100,
    offsetX: 0,
    offsetY: 0,
    height: 100,
    visible: false
  }
)

const ContentBlock = ref<HTMLElement | null>(null);

const { width, offsetX, offsetY, height, visible } = toRefs(Props);

watch(
  () => [visible.value],
  () => {
    if(visible.value)show.value = visible.value;
    nextTick(() => {
      if (visible.value && ContentBlock.value) {
        ContentBlock.value.classList.add("FadeIn");
      }
    })
    if (!visible.value && ContentBlock.value) {
      ContentBlock.value.classList.remove("FadeIn");
      ContentBlock.value.classList.add("FadeOut");
      setTimeout(() => {
        show.value = false;
      }, 300);
    }
  }
)
</script>

<style lang="scss" scoped>

.ContentBlock{
  background-color: #fff;
  z-index: 1000;
  border-radius: 8px;
  opacity: 0;
  box-shadow: 0 0 30px rgba(0,0,0,0.1);
  transform: translateY(0px);
}
.FadeIn{
  animation: FadeIn 300ms ease-in-out;
  animation-fill-mode: forwards;
}

.FadeOut{
  animation: FadeOut 300ms ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes FadeIn {
  0%{
    opacity: 0;
    transform: translateY(-20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes FadeOut {
  0%{
    opacity: 1;
    transform: translateY(0px);
  }
  100%{
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>