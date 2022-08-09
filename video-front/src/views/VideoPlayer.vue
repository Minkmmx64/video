<template>
  <div class="main mt-bs mb-bs mx-auto flex flex-row justify-center relative">
    <div class="video w-4/5 flex flex-col relative items-center">
      <div id="video-player" class="video-player w-3/5 relative overflow-hidden">
        <Teleport to="#Teleport" :disabled="VideoPlayerIsVisible">
          <!-- 弹幕 -->
          <div @click="videoIconPlay" ref="BulletChat" id="BulletChat" class="absolute"
            style="width: 100%;height: calc(100% - 50px);">
            <div class="video-bullet-canvas w-full h-full relative">
              <BulletCollection v-if="currentTime > 0" :data="BulletCollections" :BulletStyle="BulletStyle"
                :isPlay="isPlay" />
            </div>
          </div>
          <!-- 视频 -->
          <video @canplay="videoAlready" @timeupdate="videoTimeupdate" @progress="VideoProgress" :poster="Resource.img"
            loop ref="VideoPlayer" id="video-players-main" class="cursor-pointer w-full relative">
            <source :src="Resource.uri" type="video/mp4" />
          </video>
        </Teleport>
        <div class="video-player-contxt absolute transition-all duration-300 w-full">
          <!-- 进度条 -->
          <div @click="VideoProgressClick" @mousedown="VideoProgressMouseDowm" ref="VideoProgressRef"
            class="progress w-full bg-white transition-all duration-300 cursor-pointer">
            <div class="current-progress h-full" :style="`width:${progress}%`"></div>
          </div>
          <!-- 操作栏 -->
          <div class="video-player-menu px-bs flex flex-row items-center w-full box-border">
            <!-- 开始/暂停按钮 -->
            <div class="video-start cursor-pointer">
              <img @click="videoIconPlay" :src="imagesSource[isPlay]" style="width:23px;height:23px">
            </div>
            <!-- 播放时间 -->
            <div class="video-player-time text-xs text-white ml-msm">
              {{ convertTime(currentTime) }} / {{ convertTime(duration) }}
            </div>
            <!-- 调节音量 -->
            <div @mousemove="VideoHornMouseMove" @mouseout="VideoHornMouseOut" class="video-horn relative ml-msm">
              <img src="@/images/horn.png" class="cursor-pointer" style="width:25px;height:25px">
              <div v-if="isShowVideoHorn"
                class="video-horn-change cursor-pointer left-0 text-xs text-white absolute transition-all duration-300 flex flex-col items-center justify-between">
                <div class="horn-top">{{ (volumn * 100).toFixed(0) }}</div>
                <MSlider v-model="volumn" @close="onChangeProgressClose" progressOutBgColor="transparent"
                  progressDisplay="vertical" :progressRadioSize="11" :progressOutWidth="30" progressBgColor="#fff"
                  :progressWidth="80" :progressMinData="0" :progressMaxData="1" type="primary" :progressHeight="3" />
              </div>
            </div>
            <!-- 调节倍速 -->
            <div @mousemove="VideoSpeedMouseMove" @mouseout="VideoSpeedMouseOut" class="video-speed relative ml-bs">
              <img src="@/images/dspeed.png" class="cursor-pointer" style="width:25px;height:25px">
              <div v-if="isShowVideoSpeed"
                class="video-speed-change absolute cursor-pointer flex flex-col items-center text-white">
                <div @click="ChangeVideoSpeed(item)"
                  class="video-speed-items w-full text-center transition-all duration-300"
                  v-for="(item, index) in VideoSpeedCollection" :key="index"
                  :style="`${item === playbackRate ? 'color:rgba(23, 157, 219, 0.8);' : ''}`">
                  {{ item }}x
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 发送弹幕 -->
      <BulletSend @SendBullet="EmitBullet" @ChangeStyle="ChangeStyle" />
    </div>
  </div>
  <div class="video-attr">
    <div>当前播放速度:{{ playbackRate }}</div>
    <div>当前播放时长:{{ currentTime.toFixed(2) }}</div>
    <div>视频总时长:{{ duration.toFixed(2) }}</div>
    <div>当前进度:{{ progress.toFixed(2) }}%</div>
    <div>当前音量:{{ volumn.toFixed(2) }}</div>
    <div>是否播放视频:{{ isPlay }}</div>
    <div>当前是否可见:{{ VideoPlayerIsVisible }}</div>
    <button @click="fullScreen">全屏</button><br />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { convertTime } from "@/common/utils";
import { useFullscreen } from '@vueuse/core'
import { useIntersectionObserver } from '@vueuse/core'
import BulletSend from '@/components/Bullet/BulletSend.vue';
import BulletCollection from '@/components/Bullet/BulletCollection.vue';
import { Bullets } from "@/Modules/Bullet";
import MSlider from '@/components/From/Slider/MSlider.vue';
import { CCBullet } from "@/Mock/Bullet";
import Emit,{ VideoEventType } from "@/Modules/Mitter";
import { useRoute } from "vue-router";
//事件处理参数
interface BaseEmit{
  SendBullet:{
    TextStyle:Bullets.CustomText,
  };
  onChangeProgress:number;
  ChangeStyle:Bullets.GlobalBullet;
}
type E<K extends keyof BaseEmit> = BaseEmit[K];
const route = useRoute();
const BulletCollections = ref<Bullets.CCBullet[]>([]) ;                     //所有弹幕集合
const VideoSpeedCollection = [ 4, 2, 1.5, 1.25, 1, 0.75, 0.5 ];             //倍速
const VideoProgressRef = ref<HTMLDivElement>(document.createElement("div"));//视频进度条
const VideoPlayer = ref<HTMLVideoElement>(document.createElement("video")); //音频元素
const Resource = ref({                                                          //视频路径和封面图片
  uri: "http://localhost:8000/static/video/2022_6_27/acf01d76b275ed80db27888bbcf69364.mp4",
  img: "http://cdn.minkm.top/base/16522527187175l5o6o7H1W8r2e1l1l7d227%E4%B8%8B%E8%BD%BD-(1).jpg"
})
const isShowVideoSpeed = ref(false);            //显示倍速
const isShowVideoHorn = ref(false);             //显示音量调节按钮
const playbackRate = ref(0);                    //倍速
const duration = ref(0);                        //视频时长
const currentTime = ref(0);                     //当前时长
const progress = ref(0);                        //进度
const volumn = ref(0.2);                          //音量
const isPlay = ref(0);                          //是否播放视频
const currentVideoPregressWidth = ref(0);       //当前进度条宽度 
const VideoPlayerIsVisible = ref(true)          //视频是否可见，当视频不可见进行传送到右下角
const CCB = ref<Bullets.CCBullet[][]>([]);      //跟随播放进度滚动弹幕
const BulletStyle = ref<Bullets.GlobalBullet>({
  size:0,
  speed:0,
  opacity:0,
})
const imagesSource = [                          //点击播放图片
  require("@/images/start.png"),
  require("@/images/stop.png")
]   

//是否超出可视范围
nextTick(() => {
  useIntersectionObserver(
    document.getElementById("video-player"),
    ([{ isIntersecting }]) => {
      VideoPlayerIsVisible.value = isIntersecting
    },
  )
})

//视频准备就绪
const videoAlready = () => {
  duration.value = VideoPlayer.value?.duration;
  playbackRate.value = VideoPlayer.value.playbackRate;
  VideoPlayer.value.volume = volumn.value;
  CCB.value = CCBullet(duration.value);//获取整个视频时长的弹幕,可以每秒或者每n秒请求一次后台获取弹幕
  /**
   * 准备就绪请求第一条
   */
  
}

//是否全屏
const fullScreen = () => {
  const { toggle } = useFullscreen(VideoPlayer)
  toggle();
}

//开始/暂停视频
const videoIconPlay = () => {
  isPlay.value = isPlay.value === 0 ? 1 : 0;
  if(isPlay.value === 1){
    VideoPlayer.value?.play();
  }else{
    VideoPlayer.value?.pause();
  }
}

//视频播放进度
const videoTimeupdate = () => {
  //音量
  VideoPlayer.value.volume = volumn.value;
  //当前时间
  currentTime.value = parseInt(VideoPlayer.value?.currentTime.toFixed(0));
  //进度条百分比
  progress.value = ((currentTime.value) / duration.value) * 100;
  //弹幕
  /**
   * 每次播放请求一次
   */
  BulletCollections.value.push(...CCB.value[currentTime.value])
  CCB.value[currentTime.value] = [];
}

//音量弹框显示
let VideoHornTimer = 0 as unknown as NodeJS.Timeout;
//播放速度弹框显示
let VideoSpeedTimer = 0 as unknown as NodeJS.Timeout;

//触碰音量图标显示进度条
const VideoHornMouseMove = () => {
  if(VideoHornTimer)clearTimeout(VideoHornTimer);
  isShowVideoHorn.value = true;
}

//移出过500ms隐藏进度条
const VideoHornMouseOut = () => {
  VideoHornTimer = setTimeout(() => {
    isShowVideoHorn.value = false;
  }, 500);
}

/**
 * 捕获弹幕信息
 */
const EmitBullet = (e:E<"SendBullet">) => {
  let Element:Bullets.Attribute = {
    size:e.TextStyle.size === 1 ? 16 : 12,
    color:e.TextStyle.color,
    speed: (Math.ceil(Math.random() * 10)) < 4 ? 4 : Math.ceil(Math.random() * 10),
    currentPoint:{
      x:0,
      y:Math.ceil(Math.random() * 400)
    },
    text:e.TextStyle.text,
    time: parseInt(currentTime.value.toFixed(0)),
    opacity:1,
    type:e.TextStyle.type,
    show: true,
  }
  BulletCollections.value.push(new Bullets.CCBullet(Element));
}

//显示倍速条件选项
const VideoSpeedMouseMove = () => {
  if(VideoSpeedTimer) clearTimeout(VideoSpeedTimer);
  isShowVideoSpeed.value = true;
}

//隐藏倍速条选项
const VideoSpeedMouseOut = () => {
  VideoSpeedTimer = setTimeout(() => {
    isShowVideoSpeed.value = false;
  }, 500);
}

//修改播放速度
const ChangeVideoSpeed = (speed:number) => {
  VideoPlayer.value.playbackRate = speed;
  playbackRate.value = speed;
  isShowVideoSpeed.value = false;
}

 //点击进度条,跳转该画面
const VideoProgressClick = (e:MouseEvent) => {
  const p =(e.clientX - VideoProgressRef.value.getBoundingClientRect().left) / currentVideoPregressWidth.value;
  VideoPlayer.value.currentTime = p * duration.value;
  progress.value = p * 100;
  //且视频当前进度也移动过去
}

//移出事件
document.addEventListener("click",() => {
  document.removeEventListener("mousemove",_VideoProgressMouseMove);
})

//初始化进度条宽度
const VideoProgressInit = () => {
  if(VideoProgressRef.value)currentVideoPregressWidth.value = VideoProgressRef.value.getBoundingClientRect().right - VideoProgressRef.value.getBoundingClientRect().left;
}

//鼠标拖曳进度条事件
const _VideoProgressMouseMove = (e:MouseEvent) => {
  //获取当前进度条百分比
  const p =(e.clientX - VideoProgressRef.value.getBoundingClientRect().left) / currentVideoPregressWidth.value;
  VideoPlayer.value.currentTime = p * duration.value;
  progress.value = p * 100;
  //且视频当前进度也移动过去
  //显示该幁的图片...
}

//移动鼠标切换音量
const VideoProgressMouseDowm = () => {
  document.addEventListener("mousemove",_VideoProgressMouseMove)
}

//关闭音量滚动条
const onChangeProgressClose = () => {
  isShowVideoHorn.value = false;
}

//视频播放进度
const VideoProgress = (e:Event) => {
  console.log(e);
}

const ChangeStyle = (e:E<"ChangeStyle">) => {
  BulletStyle.value = e;
}

window.addEventListener("resize",VideoProgressInit);

onMounted(() => {
  VideoProgressInit();
  (Emit as VideoEventType<"unShiftBullet">).on("unShiftBullet", () => BulletCollections.value.unshift());
  const { cover, href } = route.query;
  Resource.value.img = cover as string;
  Resource.value.uri = href as string;
})
</script>

<style lang="scss" scoped>
.video{
  user-select: none;
  .video-player{
    height: 450px;
    background-color: rgba(23,34,59,1);
    #video-players-main{
      height: 400px;
    }
    &:hover > .video-player-contxt{
      bottom: 0px;
      opacity: 1;
    }
    .video-player-contxt{
      height: 50px;
      bottom: -50px;
      background:rgba(4,0,0,1);
      opacity: 0;
      .progress{
        height: 3px;
        &:hover{
          transform: scaleY(2);
        }
        .current-progress{
          width: 0%;
          background-color: rgba(138,198,209,1);
        }
      }
    }
    .video-player-menu{
      height: calc(100% - 3px);
    }
    .video-horn{
      .video-horn-change{
        z-index: 100;
        top: -120px;
        height: 100px;
        width: 30px;
        animation: showHorn 400ms linear;
        animation-fill-mode: keywords;
        border-radius: 5px;
        background-color: rgba(0,0,0,0.8);
        padding-bottom: 5px;
        .video-horn-progress{
          width: 3px;
          height: 70px;
          background-color: #fff;
          .horn-drag{
            width: 11px;
            height: 11px;
            bottom: 0px;
            left: -4px;
            border-radius: 50%;
            background-color: rgb(0,161,214);
          }
        }
        .bottom-progress{
          width: 3px;
          left: 0px;
          bottom: 0px;
          background-color: rgb(0, 204, 255);
        }
      }
    }
    .video-speed{
      .video-speed-change{
        overflow: hidden;
        z-index: 100;
        width: 60px;
        left: -15px;
        background-color: rgba(0, 0, 0, 0.8);
        transform: translateY(-120%);
        animation: showHorn 400ms linear;
        animation-fill-mode: keywords;
        border-radius: 5px;
        .video-speed-items{
          height: 36px;
          line-height: 36px;
          &:hover{
            background-color: #fff;
            color: rgb(0, 0, 0);
          }
        }
      }
    }
  }
}
#BulletChat{
  left: 0px;
  top: 0px;
  z-index: 10;
}

.video-attr{
  height: 200vh;
}
@keyframes showHorn {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}

</style>