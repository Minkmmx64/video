<template>
  <div class="System flex flex-row">
    <el-menu style="user-select:none;overflow: scroll;" active-text-color="#ffd04b" background-color="rgba(44,44,44,1)"
      class="scroll el-menu-vertical-demo relative" :default-active="MenuAC" text-color="#fff" :collapse="isCollapse"
      @select="menuSelect" mode="vertical" unique-opened>
      <div class="SystemTitle text-center text-white justify-center cursor-pointer flex flex-row items-center">
        <IconFont :size="25" title="" icon="icon-guanli" />
      </div>
      <!-- 一级菜单 -->
      <template v-for="(Item, index) in menu" :key="index">
        <template v-if="Item.children">
          <el-sub-menu :index="Item.route">
            <template #title>
              <IconFont title="" :icon="Item.icon" />
              <span class="ml-msm">{{Item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <template v-for="(child, index2) in Item.children" :key="index2">
              <template v-if="child.children">
                <el-sub-menu :index="child.route">
                  <template #title>
                    <IconFont title="" :icon="child.icon" />
                    <span class="ml-msm">{{child.name}}</span>
                  </template>
                  <!-- 三级菜单 -->
                  <template v-for="(child2, index3) in child.children" :key="index3">
                    <el-menu-item :index="child2.route">
                      <IconFont title="" :icon="child2.icon" />
                      <span class="ml-msm">{{child2.name}}</span>
                    </el-menu-item>
                  </template>
                </el-sub-menu>
              </template>
              <template v-else>
                <el-menu-item :index="child.route">
                  <IconFont title="" :icon="child.icon" />
                  <span class="ml-msm">{{child.name}}</span>
                </el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="Item.route">
            <IconFont title="" :icon="Item.icon" />
            <span class="ml-msm">{{Item.name}}</span>
          </el-menu-item>
        </template>
      </template>
      <!-- 左下方自定义 -->
      <div class="goOut cursor-pointer w-full text-center text-white transition-all duration-200"
        style="left: 0px;bottom: 0px;" @click="$router.push('/')">退出</div>
    </el-menu>
    <!-- 右侧内容 -->
    <div class="SystemR pt-msm flex flex-col w-full">
      <!-- 面包屑导航 -->
      <img @click="isCollapse = !isCollapse" src="@/images/collapse.png"
        class="collapse ml-bs cursor-pointer transition-all duration-500" :style="{
              transform: isCollapse ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }" />
      <div class="BreadNav pl-msm flex flex-row items-center">
        <div class="NavItem relative ml-msm flex cursor-pointer flex-row items-center transition-all duration-300"
          :style="{
              backgroundColor: item.route === MenuAC ? 'rgba(65,182,230,0.1)' : 'rgba(255,255,255,1)',
                color: item.route === MenuAC ? 'rgb(64,158,255)' : 'rgba(0,0,0,1)',
          }" v-for="(item,index) in Nav" @click="BreadNavTag(item.route)" :key="index">
          <IconFont :title="item.name" :icon="item.icon" :size="14" />
          <div @click.stop="BreadClose(item,index)"
            class="close absolute text-center flex flex-row justify-center items-center transition-all duration-200"
            :style="{
              right: item.route === MenuAC ? '5px' : '-20px', 
            }">×</div>
        </div>
      </div>
      <!-- 主页面 -->
      <div class="ManageView pt-bs pl-msm pr-mid">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { menu } from "@/Mock/Menu";
import IconFont from '@/components/Icon/IconFont.vue';
import { useBreaDNav, SetSession } from "../component/BreadNAV";

const isCollapse = ref(false);
const { menuSelect, Nav, MenuAC, BreadNavTag, BreadClose, BeforDestory } = useBreaDNav();

onMounted(() => {
  const BreadHistory = sessionStorage.getItem("Bread");
  if (BreadHistory) {
    try {
      const Bread: SetSession = JSON.parse(BreadHistory);
      Nav.value = Bread.Nav;
      MenuAC.value = Bread.MenuAC;
      menuSelect(MenuAC.value)
    } catch (error) {
      menuSelect(MenuAC.value)
    }
  }
  else{
    menuSelect(MenuAC.value)
  }
})

window.addEventListener("beforeunload", BeforDestory)

onBeforeUnmount(() => window.removeEventListener("beforeunload", BeforDestory))
</script>
<style lang="scss" scoped>
.System{
  height: 100vh;
}

.scroll{
  &::-webkit-scrollbar {
    width: 1px; //对垂直方向滚动条
    height: 0px; //对水平方向滚动条
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(255, 255, 255,.1) //滚动条的颜色
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.goOut{
  height: 40px;
  line-height: 40px;
  background-color: rgba(64, 158, 255,0.8);
  font-size: 16px;
  font-weight: 100;
  &:hover{
    background-color: rgba(64, 158, 255, 1);
  }
}
.BreadNav{
  background-color: rgba(240, 240, 240,0.5);
  height: 40px;
  border-top: 1px rgba(129, 129, 129, 0.6) dashed;
  border-bottom: 1px dashed rgba(129, 129, 129, 0.6);
  .NavItem{
    user-select: none;
    font-size: 12px;
    height: 30px;
    background-color: rgba(255, 255, 255, 1);
    line-height: 35px;
    padding:5px 10px;
    padding-right: 30px;
    border-radius: 5px;
    overflow: hidden;
    &:hover > .close{
      right: 5px;
    }
    .close{
      right:-20px;
      top: 0px;
      bottom: 0px;
      margin: auto;
      width: 14px;
      font-size: 12px;
      height: 14px;
      border: rgba(0, 0, 0, 1) 1px solid ;
      color: #000;
      border-radius: 50%;
      &:hover{
        background-color: #fff;
      }
    }
  }
}
.collapse{
  width: 25px;
  height: 25px;
  background-color: rgba(228,44,100,1);
  padding: 7px;
  box-sizing: border-box;
  border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.ManageView{
  max-width: calc(100vw - 200px);
}

</style>