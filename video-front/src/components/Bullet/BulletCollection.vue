<template>
  <li v-for="(item,index) in data" :key="index">
    <BulletItem :Bullet="item" :BulletStyle="BulletStyle" :isPlay="isPlay"/>
  </li>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from 'vue';
import BulletItem from "@/components/Bullet/BulletItem.vue";

const Props = defineProps(["data","BulletStyle","isPlay"])

const { data,BulletStyle,isPlay } = toRefs(Props);

</script>
