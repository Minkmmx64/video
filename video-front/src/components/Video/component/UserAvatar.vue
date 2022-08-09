<template>
  <div class="clear-both inline-block">
    <div
      v-if="user.Auth.AuthToken" 
      @mousemove="mousemove"
      @mouseout="mouseout"
      class="UserAvatar relative transition-all duration-300 cursor-pointer text-white">
      <img :src="user.Info.avatar" ref="AvatarSmall" class="absolute transition-all duration-300" />
      <img :src="user.Info.avatar" ref="AvatarBig" class="absolute transition-all duration-300"/>
      <ContentBlock
        @mousemove="mousemove"
        class="UserContentBlock flex flex-col items-center pt-mid"
        @mouseout="mouseout"
        :offset-y="60" :offset-x="-100" :width="300" :height="500" :visible="isShowBlock" >
          <div class="UserInfoHeader">
            <span style="color: rgba(254,95,85,1);">{{ user.Info.UserName }}</span>
          </div>
          <div class="UserCeil">
            <IconFontV2 textColor="#000" :space="15" hover icon="icon-wodedahuiyuan" title="大会员" />
            <IconFontV2 textColor="#000" center icon="icon-jiantou_liebiaoxiangyou_o" />
          </div> 
          <div class="UserCeil"> 
            <IconFontV2 textColor="#000" :space="15" hover icon="icon-xiaoxi" title="消息" />
            <IconFontV2 textColor="#000" center icon="icon-jiantou_liebiaoxiangyou_o" />
          </div> 
          <div class="UserCeil"> 
            <IconFontV2 textColor="#000" :space="15" hover icon="icon-dongtai" title="动态" />
            <IconFontV2 textColor="#000" center icon="icon-jiantou_liebiaoxiangyou_o" />
          </div> 
          <div class="UserCeil"> 
            <IconFontV2 textColor="#000" :space="15" hover icon="icon-lishi" title="历史" />
            <IconFontV2 textColor="#000" center icon="icon-jiantou_liebiaoxiangyou_o" />
          </div>
          <div class="UserCeil">
            <IconFontV2 textColor="#000" :space="15" hover icon="icon-chuangzuozhongxin" title="创作中心" />
            <IconFontV2 textColor="#000" center icon="icon-jiantou_liebiaoxiangyou_o" />
          </div>
      </ContentBlock>
  </div>
    <div 
      v-else
      @click="goLogin" 
      class="UserAvatar Login cursor-pointer text-center text-white flex flex-row justify-center items-center">登录</div>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfo } from "@/store";
import { ref } from "vue";
import ContentBlock from "./ContentBlock.vue";
import { useRouter } from "vue-router";
import IconFontV2 from '../../Icon/IconFontV2.vue';

const User = useUserInfo();
const user = User.UserGetter;
const AvatarSmall = ref<HTMLElement | null>(null);
const AvatarBig = ref<HTMLElement | null>(null);
const isShowBlock = ref(false);
const isMove = ref(false);
const router = useRouter();

const mousemove = () => {
  if (AvatarSmall.value && AvatarBig.value) {
    isMove.value = true;
    isShowBlock.value = true;
    AvatarSmall.value.classList.add("AvatarBig")
    AvatarBig.value.classList.add("AvatarAnimBig");
    AvatarBig.value.classList.remove("AvatarAnimSmall"); 
    AvatarSmall.value.classList.remove("AvatarSmall");
  }
}

const mouseout = () => {
  isMove.value = false;
  setTimeout(() => {
    if (AvatarSmall.value && AvatarBig.value && isMove.value === false) {
      isShowBlock.value = false;
      AvatarSmall.value.classList.remove("AvatarBig")
      AvatarBig.value.classList.remove("AvatarAnimBig");
      AvatarBig.value.classList.add("AvatarAnimSmall");
      AvatarSmall.value.classList.add("AvatarSmall");
    }
  }, 500);
}

const goLogin = () => {
  router.push("Login");
}

</script>

<style lang="scss" scoped>
.UserContentBlock{
  .UserCeil{
    width: 80%;
    margin-top: 5px;
    height: 40px;
    border-radius: 10px;
    transition: all ease 500ms;
    display: flex;
    flex-direction:row;
    align-items: center;
    justify-content: space-between;
    &:hover{
      background-color: rgba(0, 0, 0,.1);
    }
  }
}
.UserAvatar{
  width: 40px;
  height: 40px;
  background-color: transparent;
  border-radius: 50%;
  color: rgb(0, 0, 0);
  font-size: 12px;
  display: inline-block;
  transform: translate(0px, 0px) scale(1);
  &:hover > img{
    display: block;
  }
  img{
    width: 100%;
    border-radius: 50%;
    z-index: 10000;
  }
}
.Login{
  background-color: aliceblue;
  line-height: 40px;
}
.AvatarAnimBig{
  animation: Animb 400ms both;
  animation-fill-mode: keywords;
}
.AvatarAnimSmall{
  animation: Anims 400ms both;
  animation-fill-mode: keywords;
}
.AvatarBig{
  animation: AnimOpacityb 400ms both;
  animation-fill-mode: keywords;
}
.AvatarSmall{
  animation: AnimOpacitys 400ms both;
  animation-fill-mode: keywords;
}

@keyframes Animb{
  0%{
    transform: translate(0px,0px) scale(1);
  }
  100%{
    transform: translate(-30px, 40px) scale(2.2);
  }
}
@keyframes Anims {
  0% {
    transform: translate(-30px, 40px) scale(2.2);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
@keyframes AnimOpacityb{
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
@keyframes AnimOpacitys{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}

</style>