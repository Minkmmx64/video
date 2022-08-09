<template>
  <div class="LoginScreen absolute w-full">
    <div class="LoginScreenFrom overflow-hidden relative">
      
      <div class="Login w-full h-full absolute transition-all duration-1000 flex flex-col justify-between items-center" :style="{
        left: (currentIndex - 1) * 100 + '%',
        top: 0 + 'px'
      }">
      <div style="margin-top: 100px;">登录</div>
      <!-- 登录 -->
        <el-form
          ref="FromLoginRef"
          class="Content"
          label-width="120px"
          :rules="FromLoginRules"
          :model="UserFrom.login">
            <el-form-item label="mobilephone :" prop="mobilephone">
              <el-input v-model="UserFrom.login.mobilephone" />
            </el-form-item>
            <el-form-item label="password :" prop="password">
              <el-input v-model="UserFrom.login.password" />
            </el-form-item>
            <el-row :gutter="20" justify="center" align="middle">
              <el-col :span="18">
                <el-form-item label="code :" prop="code">
                  <el-input v-model="UserFrom.login.code" />
                </el-form-item>
              </el-col>
              <el-col :span="6" justify="center" align="middle">
                <div class="Vcode flex flex-row justify-center items-center" ref="Vcode"></div>
                <div class="VcodeText transition-all duration-500" style="font-size: 14px; cursor: pointer;" @click="refreshVcode" >看不清换一个</div>
              </el-col>
            </el-row>
            <el-row>
              <el-button type="primary" @click="onLogin" style="width: 100px;margin: 0 auto;">submit</el-button>
            </el-row>
        </el-form>
      </div>

      <div class="Register w-full h-full absolute transition-all duration-1000 flex flex-col justify-between items-center" :style="{
        left: (currentIndex - 2) * 100 + '%',
        top: 0 + 'px'
      }">
      <div style="margin-top: 60px;">注册</div>
      <!-- 注册 -->
        <el-form
          ref="FromRegisterRef"
          class="Content"
          :rules="FromRegisterRules"
          label-width="120px"
          :model="UserFrom.register">
            <el-form-item label="username :" prop="username" placeholder="中文数字字母下划线2-10个字符">
              <el-input v-model="UserFrom.register.username" />
            </el-form-item>
            <el-form-item label="password :" prop="password">
              <el-input v-model="UserFrom.register.password" />
            </el-form-item>
            <el-form-item label="rpassword :" prop="rpassword">
              <el-input v-model="UserFrom.register.rpassword" />
            </el-form-item>
            <el-form-item label="mobilephone :" prop="mobilephone">
              <el-input v-model="UserFrom.register.mobilephone" />
            </el-form-item>
            <el-form-item label="email :" prop="email">
              <el-input v-model="UserFrom.register.email" />
            </el-form-item>
            <el-row>
              <el-button type="primary" @click="onRegister" style="width: 100px;margin: 0 auto;">submit</el-button>
            </el-row>
        </el-form>
      </div>
      
      <div class="Forget w-full h-full absolute transition-all duration-1000 flex flex-col justify-between items-center" :style="{
        left: (currentIndex - 3) * 100 + '%',
        top: 0 + 'px'
      }">
      <div style="margin-top: 100px;">忘记密码</div>
      <!-- 忘记密码 -->
        <el-form
          ref="FromForgetRef"
          class="Content"
          :rules="FromForgetRule"
          label-width="120px"
          :model="UserFrom.forget">
            <el-form-item label="username :" prop="username">
              <el-input v-model="UserFrom.forget.username" />
            </el-form-item>
            <el-form-item label="mobilephone :" prop="mobilephone">
              <el-input v-model="UserFrom.forget.mobilephone" />
            </el-form-item>
            <el-form-item label="email :" prop="email">
              <el-input v-model="UserFrom.forget.email" />
            </el-form-item>
            <el-form-item label="code :" prop="code">
              <el-input v-model="UserFrom.forget.code" />
            </el-form-item>
            <el-row>
              <el-button type="primary" @click="onForget" style="width: 100px;margin: 0 auto;">submit</el-button>
            </el-row>
        </el-form>
      </div>

    </div>
    <div class="LoginScreenBtn w-full flex flex-row items-center relative justify-center">
      <div plain @click="SelectFrom(1)" class="relative" style="width: 100px;">登录
        <div class="line absolute transition-all duration-1000" :style="{
          left: (currentIndex - 1) * 120 + 'px'
        }"/>
        <div class="aborder absolute transition-all duration-1000" :style="{
          left: (currentIndex - 1) * 120 + 'px'
        }"/>
      </div>
      <div plain @click="SelectFrom(2)" style="width: 100px;">注册</div>
      <div plain @click="SelectFrom(3)" style="width: 100px;">忘记密码</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import UserApi,{ Login, Register, Forget } from "@/api/Apis/user";
import { isValidKey } from '@/common/utils';
import { useUserInfo, UserStore } from "@/store";
import { useRouter } from "vue-router";

const currentIndex = ref(1);

const FromLoginRef = ref<FormInstance>();
const FromRegisterRef = ref<FormInstance>();
const FromForgetRef = ref<FormInstance>();
const Vcode = ref<HTMLElement | null>(null);
const User = useUserInfo();
const Router = useRouter();

const FromLoginRules:FormRules = {
  mobilephone:[
    { required: true , message: 'Please input username', trigger: 'blur' }
  ],
  password: [
    { required: true , message: 'Please input password', trigger: 'blur' }
  ],
  code: [
    { required: true , message: 'Please input code', trigger: 'blur' }
  ],
}

const FromRegisterRules:FormRules = {
  username:[
    { required: true , message: 'Please input username', trigger: 'blur' }
  ],
  password: [
    { required: true , message: 'Please input password', trigger: 'blur' }
  ],
  rpassword: [
    { required: true , message: 'Please input rpassword', trigger: 'blur' }
  ],
  mobilephone: [
    { required: true , message: 'Please input mobilephone', trigger: 'blur' }
  ],
  email: [
    { required: true , message: 'Please input email', trigger: 'blur' }
  ]
}

const FromForgetRule:FormRules = {
  username:[
    { required: true , message: 'Please input username', trigger: 'blur' }
  ],
   mobilephone: [
    { required: true , message: 'Please input mobilephone', trigger: 'blur' }
  ],
  email: [
    { required: true , message: 'Please input email', trigger: 'blur' }
  ],
  code: [
    { required: true , message: 'Please input code', trigger: 'blur' }
  ]
}

const UserFrom = reactive<{
  login:Login,
  register:Register,
  forget:Forget
}>({
  login:{
    mobilephone: "",
    password: "",
    code: ""
  },
  register: {
    username: "",
    password: "",
    rpassword: "",
    email: "",
    mobilephone: ""
  },
  forget: {
    username: "",
    code: "",
    email: "",
    mobilephone: ""
  }
})

const SelectFrom = (index: number) => {
  currentIndex.value = index;
}

const onLogin = async () => {
  if(!FromLoginRef.value)return;
  await FromLoginRef.value.validate( async (valid, fields) => {
    if (valid) {
      UserApi.vcodef(UserFrom.login.code).then( () => {
        UserApi.login(UserFrom.login).then( user => {
          setTimeout(() => {
            //登录成功
            ElMessage.success(user.data.message);
            for (const k in UserFrom.login) {
              if (isValidKey(k, UserFrom.register)) {
                UserFrom.login[k] = null as never;
              }
            }
            const { access_token, user_id } = user.data.body;
            const UserInfo: UserStore = {
              AuthToken: access_token,
              userId: user_id,
            };
            User.SetAuthToken(UserInfo).then(() => {
              Router.push("Home");
            }).catch(error => {
              ElMessage.error(error);
              refreshVcode();
            });
          }, 500);
        }).catch(error => {
          ElMessage.error(error);
          refreshVcode();
        });
      }).catch(error => {
        refreshVcode();
        ElMessage.error(error);
      })
      console.log('submit!',UserFrom.login);
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onRegister = async () => {
  if(!FromRegisterRef.value)return;
  await FromRegisterRef.value.validate((valid, fields) => {
    if (valid) {
      UserApi.register(UserFrom.register).then( register => {
        setTimeout(() => {
          ElMessage.success(register.data.message);
          currentIndex.value = 1;
          for (const k in UserFrom.register) {
            if (isValidKey(k, UserFrom.register)) {
              UserFrom.register[k] = null as never;
            }
          }
        }, 500);
      }).catch(error => {
        console.log(error);
        ElMessage.error(error);
      });
      console.log('submit!',UserFrom.register);
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onForget = async () => {
  if(!FromForgetRef.value)return;
  await FromForgetRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!',UserFrom.forget);
      UserApi.forget(UserFrom.forget).then( forget => {
        console.log(forget);
      }).catch(error => {
        console.log(error);
        ElMessage.error(error);
      });
    } else {
      console.log('error submit!', fields)
    }
  })
}

const refreshVcode = async () => {
  const data = (await UserApi.vcode()).data.body;
  if (Vcode.value) {
    Vcode.value.innerHTML = data as unknown as string;
  }
}

onMounted( async () => {
  refreshVcode();
})


</script>

<style lang="scss" scoped>
.LoginScreen{
  width: 40%;
  height: 500px;
  transform: translate(-50%,-50%);
  top: 50%;
  left: 50%;
  box-shadow: 0 0 30px rgba(0,0,0,0.1);
  border-radius: 10px;
  .LoginScreenFrom{
    height: 400px;
  }
  .LoginScreenBtn{
    height: calc(100% - 400px);
    font-size: 14px;
    text-align: center;
    color: #606266;
    div{
      height: 30px;
      line-height: 30px;
      border-color: #dcdfe6;
      border-style: solid;
      border-width: 1px;
      margin: 0 10px;
      border-radius: 5px;
      cursor: pointer;
    }
    .line{
      top: 60px;
      bottom: 0px;
      margin: auto;
      width: 100px;
      height: 1px;
      border: none;
      background-color: rgb(64,158,255);
    }
    .aborder{
      top: 0px;
      bottom: 0px;
      margin: auto;
      width: 100px;
      height: 30px;
      background-color: transparent;
      border: 1px solid rgb(103,194,58);
    }
  }
  .Login,.Register,.Forget{
    .Content{
      width: 80%;
    }
  }
}
.VcodeText{
  color: black;
  &:hover{
    color: rgb(64,158,255);
  }
}
</style>
