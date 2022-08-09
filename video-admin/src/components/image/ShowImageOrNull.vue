<template>
  <div class="Image flex flex-col justify-center items-center">
    <img v-if="imgUrl" :src="imgUrl" @error="onError" :style="{ width: width + 'px', height: width + 'px' }" />
  </div>
</template>

<script lang="ts">
import { isNullOrEmpty } from '@/common/utils';
import { defineComponent } from 'vue';

export default defineComponent({
  name: "ShowImageOrNull",
  props: {
    nullImage: {
      type: String,
      default: () => require('@/assets/images/none.png'),
    },
    failImage: {
      type: String,
      default: () => require('@/assets/images/failed.svg'),
    },
    src: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default:50,
    }
  },
  data() {
    return {
      imgUrl: '',
    }
  },
  mounted() {
    setTimeout(() => { this.loadImage(); }, 100);
  },
  watch: {
    src() { this.loadImage(); }
  },
  methods: {
    loadImage() {
      if (isNullOrEmpty(this.src))
        this.imgUrl = this.nullImage as string;
      else
        this.imgUrl = this.src as string;
    },
    onError() {
      if (this.imgUrl != this.failImage)
        this.imgUrl = this.failImage as string;
    }
  }
});
</script>