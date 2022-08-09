<template>
  <div class="BulletSend w-full flex flex-col justify-center items-center">
    <div class="BulletGroup flex flex-row items-center">
      <!-- 自定义弹幕 -->
      <BulletEditor @ChangeFrom="ChangeFrom"/>
      <div @mousemove="EditMouseMove" @mouseout="EditMouseOut" class="BulletTextEditor relative">
        <img class="cursor-pointer" :src="imgs" width="20" height="20">
        <!-- 编辑弹幕 -->
        <div v-if="isShowEdit" class="CustomEdit absolute z-50 flex flex-col items-center transition-all duration-100">
          <div class="CustomEditCollection">
            <div class="CustomEditCollection-Text text-white">字号</div>
            <div class="flex flex-row items-center w-full justify-between text-center mt-msm">
              <div 
                @click="Fontsize = index" 
                :style="`background-color:${Fontsize === index ? 'rgba(0,161,214,1);' : 'rgba(0, 0, 0,0.6);'} `" 
                class="CustomEditCollection-1-item text-center cursor-pointer transition-all duration-300 text-white" 
                v-for="(item,index) in ['小','标准']" :key="index">{{item}}</div>
            </div>
          </div>
          <div class="CustomEditCollection">
            <div class="CustomEditCollection-Text text-white">模式</div>
            <div class="flex flex-row items-center w-full">
              <div 
                @click="FontModel = index" 
                class="CustomEditCollection-2-item flex flex-col items-center justify-between cursor-pointer" 
                v-for="(item,index) in FontPosition" :key="index">
                <img :src=" FontModel === index ? item.ac :item.no" width="25" height="25" />
                <div class="text-white" :style="`color: ${FontModel === index ? 'rgb(0,161,214)' : '#fff'}`">{{item.title}}</div>
              </div>
            </div>
          </div>
          <div class="CustomEditCollection">
            <div class="CustomEditCollection-Text text-white">颜色</div>
            <div class="flex flex-col">
              <div class="flex flex-row items-center justify-between" style="height: 30px;">
                <input ref="Inp" @keydown="BulletKeyDown" maxlength="7" class="CustomEditCollection-3-inp" v-model="Colors" />
                <div class="CustomEditCollection-3-color" :style="{backgroundColor:Colors}"></div>
              </div>
              <div class="flex flex-row items-center flex-wrap justify-between pr-msm">
                <div @click="Colors = item" class="CustomEditCollection-3-Colors cursor-pointer" :style="{backgroundColor:item}" v-for="(item,index) in COlorsCollection" :key="index" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <input placeholder="输入弹幕" v-model="textarea" class="textarea pl-msm transition-all duration-100" />
      <div     
        @click="BulletChat"
        class="send bg-black cursor-pointer text-center text-white">发送弹幕</div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref,defineEmits, watch ,onMounted} from 'vue';
import { Bullets } from "@/Modules/Bullet";
import BulletEditor, { From } from './BulletEditor.vue';
const Emit = defineEmits(["SendBullet","ChangeStyle"])
const textarea = ref();
const imgSrc = [
  require("../../images/edit.png"),
  require("../../images/aedit.png")
]
const imgs = ref(imgSrc[0]);
const isShowEdit = ref(false);
const Fontsize = ref(0);  //字体大小 0小 1标准
const FontModel = ref(0); //字体模式 顶部 滚动 底部
const Colors = ref('#FFFFFF');
const Inp = ref<HTMLInputElement>(document.createElement("input"));

//自定义弹幕样式
const BulletFrom = ref<Bullets.GlobalBullet>({
  opacity:1,
  speed:1,
  size:50,
});

watch(
  () => [BulletFrom.value.opacity,BulletFrom.value.size,BulletFrom.value.speed],
  () => Emit("ChangeStyle",BulletFrom.value)
)

const FontPosition:{ title:string,ac:string,no:string,type:Bullets.Tpye }[] = [
  {
    title:'顶部',
    ac:require("@/images/txt_top_ac.png"),
    no:require("@/images/txt_top_no.png"),
    type: "top",
  },
  {
    title: '滚动',
    ac:require("@/images/txt_scroll_ac.png"),
    no:require("@/images/txt_scroll_no.png"),
    type: "scroll",
  },
  {
    title: '底部',
    ac:require("@/images/txt_bottom_ac.png"),
    no:require("@/images/txt_bottom_no.png"),
    type: "bottom",
  }
]

const COlorsCollection = [
  "#f9bcdd","#f5587b",
  "#8134af","#B9EDF8",
  "#57D1C9","#f1ac9d",
  "#dd0a35","#ffb6b9",
  "#FFFFFF","#000000"
];

let Timer = 0;
const EditMouseOut = () => {
  imgs.value = imgSrc[0];
  Timer = setTimeout(() => {
    isShowEdit.value = false;
  }, 300) as unknown as number;
}

const EditMouseMove = () => {
  if(Timer)clearTimeout(Timer);
  imgs.value = imgSrc[1];
  isShowEdit.value = true
}

const ChangeFrom = (e:From) => {
  BulletFrom.value.opacity = e.opacity;
  BulletFrom.value.speed = e.speed;
  BulletFrom.value.size = e.size;
}

const BulletChat = () => {
  if(textarea.value === "" || textarea.value === undefined){
    alert("不能为空")
  }
  else{
    let TextStyle:Bullets.CustomText = {
      size:Fontsize.value,
      type: FontPosition[FontModel.value].type,
      color:Colors.value,
      text:textarea.value
    }
    Emit("SendBullet",{ TextStyle });
    textarea.value = "";
  }
}

const BulletKeyDown = (e:(KeyboardEvent)) => {
  if(((e.target as HTMLInputElement).value) === ""){
    Colors.value = '#';
  }
  if(e.code === "Backspace" && Colors.value === "#" || Inp.value.selectionStart === 0 || (Inp.value.selectionStart === 1 && e.code === "Backspace")){
    e.preventDefault();
  }
}

onMounted(() => Emit("ChangeStyle",BulletFrom.value))

</script>

<style lang="scss" scoped>
.textarea{
  height: 150px;
  border: 1px solid rgb(212, 212, 212);
  color: rgb(158, 158, 158);
  border-radius: 5px;
  height: 40px;
  width: 200px;
  line-height: 30px;
  font-size: 0.1rem;
  &:focus {
    border-color: rgba(255, 115, 0, 0.7);
  }
}
.send{
  width: 60px;
  font-size: 0.1rem;
  height: 30px;
  line-height: 30px;
  border-radius: 10px;
  margin-left: 20px;
}
.BulletTextEditor{
  margin-right: 20px;
}
.BulletSend {
  margin-top: 5px;
}
.CustomEdit{
  width: 200px;
  height: 270px;
  background-color: rgba(0, 0, 0,0.6);
  transform: translateX(-90px) translateY(-310px);
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  opacity: 1;
  box-sizing: border-box;
  .CustomEditCollection {
    width: 100%;
    margin-top: 10px;
    .CustomEditCollection-Text {
      font-size: 13px;
    }
    .CustomEditCollection-1-item {
      width: 45%;
      height: 20px;
      line-height: 20px;
      background-color: rgba(66,66,66,0.5);
      font-size: 12px;
      opacity: 1;
      border-radius: 5px;
    }
    .CustomEditCollection-2-item{
      margin-top: 5px;
      font-size: 12px;
      width: 25%;
      height: 50px;
      margin-left: 5px;
    }
    .CustomEditCollection-3-inp{
      width: 50%;
      font-size: 12px;
      background-color:transparent;
      border: 1px solid rgba(228, 228, 228,.5);
      color: #fff;
      padding-left: 10px;
      border-radius: 5px;
    }
    .CustomEditCollection-3-color{
      width: 30%;
      height: 80%;
      border-radius: 5px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .CustomEditCollection-3-Colors {
      width: 20px;
      height: 20px;
      margin-left:10px;
      margin-top: 5px;
      border-radius: 5px;
    }
  }
}
</style>