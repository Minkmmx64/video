<template>
  <div class="icon flex flex-row items-center h-mid justify-center">
    <i :class="`iconfont `+icon" :style="{ fontSize: size ? size + 'px' : '16px' }" />
    <div v-if="title !== ''" class="ml-msm" style="font-size: 12px;">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps,toRefs } from "vue";
  const props = defineProps(['title','icon','size']);
  const { title,icon,size } = toRefs(props);
</script>

<style lang="scss" scoped>

</style>
