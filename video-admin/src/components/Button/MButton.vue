<template>
  <button @mousemove="MouseMove" @mouseout="MouseOut" ref="MButton" class="Button" :style="{
    ...SelectStyle,
    background: Color[type].base,
    borderWidth: '1px',
    borderColor: Color[type].base,
  }">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, toRefs, ref } from "vue";
interface IProps{
  type: keyof Colors
}

interface Colors{
  primary: {
    base: string,
    hover: string,
  };
}

const props = withDefaults(
  defineProps<IProps>(),
  {
    type: "primary",
  }
)

const { type } = toRefs(props);

const MButton = ref<HTMLElement | null>(null);

const SelectStyle = () => {
  return {

  }
}

const MouseMove = () => {
  if (MButton.value) {
    MButton.value.style.backgroundColor = Color[type.value].hover
  }
}

const MouseOut = () => {
  if (MButton.value) {
    MButton.value.style.backgroundColor = Color[type.value].base
  }
}

const Color: Colors = {
  primary: {
    base: "rgba(64,158,255,1)",
    hover: "rgb(121,187,255)"
  }
}

</script>

<style lang="scss" scoped>
.Button{
  cursor: pointer;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 16px;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition:  100ms all ease;
}
</style>