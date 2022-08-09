<template>
  <div class="VideoListScreen relative grid">
    <div class="VideoListBanner relative">
      <!-- 轮播图 -->
      <img class="w-full" :src="bannerList[1]" />
    </div>
    <!-- 换一换 -->
    <div @click="VideoChange"  class="VideoListChange cursor-pointer absolute flex flex-col justify-center items-center">
      <IconFont center class="transition-all duration-500" :h="35"  icon="icon-huanyihuan" 
        :style="{
          transform: `rotate(${isChangePlayer}deg)`
        }" />
      <div>换一换</div>
    </div>
    <li class="VideoListItem transition-all duration-200 cursor-pointer" 
      @click="VideoClick(item)" v-for="(item, index) in list" :key="index">
      <div class="VideoListItemImg relative">
        <img 
          @mousemove="currentIndex = index"
          @mouseout="currentIndex = -1"
          class="w-full h-full" :src="currentIndex === index ? item.video_gif:item.video_cover" />
        <IconFont class="VideoListItemCreated transition-all duration-300 absolute" :h="25" :size="16" icon="icon-shangchuan" :title=" item.created_at" />
        <div class="VideoListItemShowDetail transition-all duration-300 text-white absolute flex flex-row justify-between items-center px-msm">
          <!-- 显示播放次数和评论 -->
          <div class="flex flex-row justify-between items-center">
            <IconFont :h="40" :size="20" icon="icon-guankan" :title="item.video_comment_count" />
            <IconFont class="ml-msm" :h="40" :size="15" icon="icon-yinpinbofang" :title="item.video_player_count" />
          </div>
          <div><span>{{ convertTime(item.video_time) }}</span></div>
        </div>
      </div>
      <div class="VideoListItemContent mt-msm">
        <div class="VideoListItemDescribe">{{ item.video_name }}</div>
        <div class="VideoListItemUser">
          <IconFont TextColor="#8a8a8a" :ml="false"  :h="30" :size="16" icon="icon-UPzhu" :title="item.video_upload_user" />
        </div>
      </div>
    </li>
  </div>
</template>

<script lang="ts" setup>
import video, { VideoModule } from "@/api/Apis/video";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { convertTime } from "@/common/utils";
import IconFont from "../Icon/IconFont.vue";

const router = useRouter();
const list = ref<VideoModule[]>();
const isChangePlayer = ref(0);

const VideoClick = (item: VideoModule) => {
  const v = {
    href: item.video_href,
    cover: item.video_cover
  }
  router.push({ name: "VideoPlayer", query: v })
}

let VideoChangeTimer = 0;
const VideoChange = () => {
  isChangePlayer.value += 360;
  if (VideoChangeTimer === 0) {
    loadVideo();
    VideoChangeTimer = setTimeout(() => {
      VideoChangeTimer = 0;
    }, 1000) as unknown as number;
  }
}

const loadVideo = () => {
  list.value = [];
  video.client().then(data => {
    list.value = data.data.body;
  }).catch(error => {
    ElMessage.error(error);
  })
}

const currentIndex = ref(-1);

const bannerList = [
  "http://cdn.minkm.top/base/16522527187175l5o6o7H1W8r2e1l1l7d227%E4%B8%8B%E8%BD%BD-(1).jpg",
  "https://i0.hdslb.com/bfs/banner/cdf84f865d845ed92b995b30257542a91797a1c2.png@976w_550h_1c.webp",
  "http://cdn.minkm.top/base/16522527651414d7W5o2o6e1l1l2r6H5l512%E4%B8%8B%E8%BD%BD-(4).jpg",
  "http://cdn.minkm.top/base/16522527578265l8l6o7d2o7e6l1W2r2H255%E4%B8%8B%E8%BD%BD-(3).jpg",
  "http://cdn.minkm.top/base/16522527506027H0r0l6e2o1W6d2l2l5o255%E4%B8%8B%E8%BD%BD-(2).jpg",
  "http://last.minkm.top/base/16494809907777l9l9l0e4r4o7d6H1o0W987chahua%20(5)-f26dcd4eceac41edbb56322171363a88.jpg"
]

onMounted(() => {
  loadVideo();
})

</script>

<style lang="scss" scoped>
@keyframes TrasnForm{
  0%{
    transform: translateX(-10px);
    opacity: 0;
  }
  100%{
    transform: translateX(0px);
    opacity: 1;
  }
}
.VideoListBanner{
  grid-column: span 2;
  grid-row: 1/3;
  border-radius: 10px;
  overflow: hidden;
  > img{
    border-radius: 5px;
    height: 405px;
  }
}
.VideoListScreen{
  min-width: 1500px;
  width: 92%;
  grid-gap: 20px 12px;
  margin:  0 auto;
  margin-top: 160px;
  box-sizing: border-box;
  grid-template-columns: repeat(6,1fr);
  justify-content: end;
  .VideoListChange{
    padding: 5px;
    right: -50px;
    box-sizing: border-box;
    padding-bottom: 5px;
    font-size: 12px;
    border: 1px solid #E3E5E7;
    border-radius: 5px;
    background-color: rgb(255,255,255);
    > div{
      writing-mode: vertical-rl;
    }
  }
  .VideoListItem{
    animation: TrasnForm 1000ms ease;
    animation-fill-mode: keywords;
    .VideoListItemImg{
      width: 100%;
      height: 150px;
      border-radius: 10px;
      overflow: hidden;
      &:hover > .VideoListItemShowDetail,&:hover > .VideoListItemCreated{
        opacity: 0;
      }
      .VideoListItemShowDetail{
        height: 30px;
        bottom: 0px;
        left: 0px;
        width: 100%;
        font-size: 12px;
        background: linear-gradient(180deg,rgba(255,255,255,0),#000);
      }
    }
    .VideoListItemDescribe{
      width: 100%;
      padding-right: 10px;
      font-weight: 100;
      height: 45px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp:2;
      word-break: break-all;
      -webkit-box-orient:vertical;
      display:-webkit-box;
      font-size: 100%;
    }
    .VideoListItemCreated{
      right: 10px;
      font-size: 14px;
      top: 0%;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>