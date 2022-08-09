<template>
  <div class="Render fixed">render组件 {{title}}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      default:"Title"
    }
  },
  setup() {
    
    return {}
  }
})
</script>

<style lang="scss" scoped>
.Render{
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 100px;
  height: 100px;
  background-color: rgb(255, 255, 255);
}
</style>