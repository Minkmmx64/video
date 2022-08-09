<template>
  <!-- 视频头部 -->
  <div class="VideoHeader fixed flex flex-row items-center">
    <div class="VideoHeaderLeft pl-bs flex flex-row items-center flex-shrink">
      <span 
        class=" relative"
        v-for="(item,index) in HeadArr" :key="index">
        <IconFontV2 
          @mousemove="mousemove(index)"
          @mouseout="mouseout(index)"
          :show="index === 0 ? true : false" :hoverTitlt="index === 0 ? false : true" center :icon="item.icon" :title="item.title" />
        <ContentBlock 
          v-if="item.component"
          @mousemove="mousemove(index)"
          @mouseout="mouseout(index)"
          :offsetY="45"
          :offsetX="-160"
          :width="300" :height="200" :visible="item.show" >
            <component :is="item.component"></component>
        </ContentBlock>
      </span>
    </div>
    <div class="VideoHeaderCenter flex flex-row items-center flex-shrink">
      
    </div>
    <div class="VideoHeaderRight flex flex-row items-center flex-shrink">
      <UserAvatar />
      <IconFontV2 hover align="vertical" center icon="icon-wodedahuiyuan" title="大会员" />
      <IconFontV2 hover align="vertical" center icon="icon-xiaoxi" title="消息" />
      <IconFontV2 hover align="vertical" center icon="icon-dongtai" title="动态" />
      <IconFontV2 hover align="vertical" center icon="icon-lishi" title="历史" />
      <IconFontV2 hover align="vertical" center icon="icon-chuangzuozhongxin" title="创作中心" />
      <MButton type="danger" @click="router.push('ContributionScreen')" class="ml-bs">
        <IconFontV2  center icon="icon-chuangzuozhongxin" title="投稿" />
      </MButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconFontV2 from '../Icon/IconFontV2.vue';
import MButton from '../Button/MButton.vue';
import UserAvatar from './component/UserAvatar.vue';
import TelecastScreen from "./component/VideoHeader/TelecastScreen.vue";
import GameScreen from "./component/VideoHeader/GameScreen.vue";
import CartoonScreen from "./component/VideoHeader/CartoonScreen.vue";
import ContentBlock from './component/ContentBlock.vue';
import { ref, Ref } from 'vue';
import { useRouter } from "vue-router";

interface Head{
  icon: string;
  title: string;
  show: boolean;
  ism: boolean;
  component?: unknown;
}

const HeadArr: Ref<Head[]> = ref([
  {
    icon: "icon-guanli",
    title: "首页",
    show: false,
    ism: false,
  },
  {
    icon: "icon-xiaoxi",
    title: "番剧",
    show: false,
    ism: false,
  },
  {
    icon: "icon-dongtai",
    title: "直播",
    show: false,
    ism: false,
    component:TelecastScreen,
  },
  {
    icon: "icon-lishi",
    title: "游戏中心",
    show: false,
    ism: false,
    component:GameScreen,
  },
  {
    icon: "icon-chuangzuozhongxin",
    title: "会员购",
    show: false,
    ism: false,
  },
  {
    icon: "icon-dongtai",
    title: "漫画",
    show: false,
    ism: false,
    component:CartoonScreen,
  },
  {
    icon: "icon-chuangzuozhongxin",
    title: "下载客户端",
    show: false,
    ism: false,
  }
])

const router = useRouter();

const mousemove = (index:number) => {
  HeadArr.value[index].ism = true;
  HeadArr.value[index].show = true;
}

const mouseout = (index:number) => {
  HeadArr.value[index].ism = false;
  setTimeout(() => {
    if (HeadArr.value[index].ism === false) {
      HeadArr.value[index].show = false;
    }
  }, 500);
}

</script>

<style lang="scss" scoped>

.VideoHeader{
  min-width: 100vw;
  height: 60px;
  background-color: rgba(27,26,26,1);
  top:0px;
  left: 0px;
  z-index: 10000;
  .VideoHeaderLeft,.VideoHeaderCenter{
    width: 35%;
  }
  .VideoHeaderRight{
    width:30%;
  }
}
</style>