<template>
  <router-view />
  <div v-if="show" id="Teleport" class="fixed"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { User, useUserInfo } from "@/store";
import { ElMessage } from "element-plus";

const show = ref(false);
const router = useRouter();
const Users = useUserInfo();

router.beforeEach((to, from, next) => {
  show.value = to.name === "VideoPlayer";
  next();
})

onMounted(() => {
  const SerializeUInfo = sessionStorage.getItem("UserInfo");
  
  if (SerializeUInfo && typeof SerializeUInfo === "string") {
    try {
      const UserInfo = JSON.parse(SerializeUInfo) as User;
      Users.$state = UserInfo;
    } catch (error) {
      ElMessage.error("尝试获取用户信息失败，请重新登录" + JSON.stringify(error));
      Users.RemoverUserInfo();
    }
  } else {
    console.log("用户无登录");
  }
});

</script>

<style lang="scss">
*{
  padding:0px;
  margin:0px;
  outline: none;
}
li,ul{
  list-style: none;
}

#video-players-main{
  height: 400px;
}

#Teleport{
  width: 400px;
  height: 400px;
  right: 0px;
  overflow: hidden;
  bottom: 0px;
  background-color: transparent;
}

.el-message{
  z-index: 9999999 !important;
}
</style>
