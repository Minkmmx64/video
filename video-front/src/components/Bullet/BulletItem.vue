<template>
  <template v-if="Bullet && Bullet.show">
    <div 
      @mouseover.stop="BulletMove" 
      @mouseout="BulletOut" 
      @click.stop="BulletClick" 
      ref="BulletEntity" 
      class="bullet-items absolute cursor-pointer" 
      :style="selectPosition(Bullet.type)">{{Bullet.text}}</div>
  </template>
</template>

<script lang="ts" setup>
import { Bullets } from '@/Modules/Bullet';
import { defineProps, onMounted, toRefs , ref, watch } from 'vue';
import Emit,{VideoEventType} from "@/Modules/Mitter";

const Props = defineProps({
  Bullet:Bullets.CCBullet,
  BulletStyle: Object,
  isPlay:Number,
})

const BulletEntity = ref<HTMLDivElement | null>(null);
const { Bullet , BulletStyle , isPlay} = toRefs(Props);

const selectPosition = (T:Bullets.Tpye) => {
  if(Bullet?.value !== undefined && BulletStyle?.value){
    switch (T) {
      case "bottom":{
        return {
          bottom: Math.random() * 100 + 'px',
          left:"50%",
          transform: "translate(-50%)",
          color: Bullet.value.color,
          fontSize: (Bullet.value.size) * (BulletStyle?.value.size / 50) + 'px',
          opacity: BulletStyle?.value.opacity ? BulletStyle?.value.opacity : 1
        }
      }
      case "scroll":{
        return {
          animationDuration:(Bullet.value.speed / BulletStyle?.value.speed) + 's',
          top: Bullet.value.currentPoint.y + 'px',
          color: Bullet.value.color,
          fontSize: (Bullet.value.size) * (BulletStyle?.value.size / 50) + 'px',
          opacity: BulletStyle?.value.opacity ? BulletStyle?.value.opacity : 1
        }
      }
      case "top":{
        return {
          top: Math.random() * 100 + 'px',
          left:"50%",
          transform: "translate(-50%)",
          color: Bullet.value.color,
          fontSize: (Bullet.value.size) * (BulletStyle?.value.size / 50) + 'px',
          opacity: BulletStyle?.value.opacity ? BulletStyle?.value.opacity : 1
        }
      }
    }
  }
}

watch(
  () => [Props.Bullet?.show],
  () => (Emit as VideoEventType<"unShiftBullet">).emit("unShiftBullet")
)

watch(
  () => [isPlay?.value],
  () => {
    if(isPlay?.value === 0 && BulletEntity.value)BulletEntity.value.style.animationPlayState = "paused";
    else if(BulletEntity.value)BulletEntity.value.style.animationPlayState = "running";
  }
)

const BulletClick = () => {
  console.log("Click");
}

const BulletMove = () => {
  if(BulletEntity.value){
    BulletEntity.value.style.zIndex = "100000";
    BulletEntity.value.style.animationPlayState = "paused";
  }
}

const BulletOut = () => {
  if(BulletEntity.value){
    BulletEntity.value.style.zIndex = "100";
    BulletEntity.value.style.animationPlayState = "running";
  }
}

onMounted(() => {
  if(Bullet?.value?.type === "scroll"){
    BulletEntity.value?.addEventListener("webkitAnimationIteration",() => {
      Bullet?.value?.Stop();
    })
  }else Bullet?.value?.Start();
});

</script>

<style lang="scss" scoped>
.bullet-items{
  word-break:keep-all;
  white-space:nowrap;
  animation-name: bullet;
  text-align: center;
  animation-timing-function: linear;
  animation-fill-mode: keywords;
  animation-iteration-count: infinite;
  z-index: 100;
}
@keyframes bullet {
  0%{
    right: 0%;
  }
  100%{
    right: 200%;
  }
}
</style>