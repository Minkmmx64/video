<template>
  <div class="ContributionScreen w-full">
    <div class="ContributionScreenHeader px-mid w-full flex flex-row justify-between items-center">
      <div class="Menu cursor-pointer" @click="Router.push('Home')">
        返回首页
      </div>
      <div class="avatar flex flex-row items-center">
        <img :src="User.Info.avatar" alt="">
        <div class="user text-center">
          {{ User.Info.UserName }}
        </div>
      </div>
    </div>

    <StepBar class="StepBar" :width="600" :StepData="data" :current-step="Step" >
      <StepBarContent>
        <div> 当前文件: {{ File?.name }}</div>
        <div class="FileItem">
          <div>计算md5速度: {{ ComputerMd5process }} %</div>
          <progress id="Progress" :value="ComputerMd5process" max="100"></progress>
        </div>
        <div class="FileItem">文件md5: {{ md5V }}</div>
        <div class="FileItem">
          <div>上传进度:</div>
          <progress id="Progress" :value="UploadProgress" max="100"></progress>
        </div>
        <div class="FileItem">上传速度: {{ UploadSpeed}} Mb / s</div>
        <el-button disabled >{{ isStart ? '暂停' : '继续'}}</el-button>
        <el-upload class="upload-demo mt-bs" drag :before-upload="BeforUpload">
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>
        <el-button @click="submit"  type="primary" :loading="isloading" :disabled="!File">开始上传</el-button>
        <br />
        <el-button @click="HandleResets"  type="primary"  :disabled="isloading && !isComplete">重置</el-button>
      </StepBarContent>
      <StepBarContent>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="default" status-icon>
          <el-form-item label="视频路径:" prop="video_href">
            <el-input disabled  v-model="ruleForm.video_href" />
          </el-form-item>
          <el-form-item label="视频时长:" prop="video_time">
            <el-input disabled  v-model="ruleForm.video_time" />
          </el-form-item>
          <el-form-item label="视频大小:" prop="video_size">
            <el-input disabled  v-model="ruleForm.video_size" />
          </el-form-item>
          <el-form-item label="视频类型:" prop="video_type">
            <el-input disabled  v-model="ruleForm.video_type" />
          </el-form-item>
          <el-form-item label="视频md5:" prop="video_md5">
            <el-input disabled  v-model="ruleForm.video_md5" />
          </el-form-item>
          <el-form-item label="上传用户:" prop="video_upload_user">
            <el-input disabled  v-model="ruleForm.video_upload_user" />
          </el-form-item>
          <el-form-item label="视频名称:" prop="video_name">
            <el-input v-model="ruleForm.video_name" />
          </el-form-item>
          <el-form-item label="视频描述:" prop="video_describe">
            <el-input v-model="ruleForm.video_describe" />
          </el-form-item>
        </el-form>
        <el-button @click="submitForm(ruleFormRef)"  type="primary">发起审核</el-button>
      </StepBarContent>
      <StepBarContent>
        3
      </StepBarContent>
      <StepBarContent>
        4
      </StepBarContent>
    </StepBar>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfo } from "@/store";
import { reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import StepBar, { DataProps } from "../components/Display/StepBar.vue";
import StepBarContent from "@/components/Display/StepBarContent.vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { UploadRawFile , FormRules, FormInstance, ElMessage} from "element-plus";
import { useCommonUpload } from "@/components/useCommonUpload";
import VideoApi , { VideoModule, VideoFrom } from "@/api/Apis/video";

const Router = useRouter();
const User = useUserInfo();
const Step = ref(1);
const File = ref<UploadRawFile>();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<VideoFrom>({
  video_describe: '',
  video_href: '',
  video_name: '',
  video_upload_user: '',
  video_time: 0,
  video_type: '',
  video_md5: '',
  video_size: 0,
  user_id: 0,
})
const isloading = ref(false);

const { HandleStart, md5V, ComputerMd5process, UploadProgress, UploadSpeed, isStart, isComplete, HandleReset } =
  useCommonUpload<VideoModule>(VideoApi, File as Ref<UploadRawFile>, "Slicing", 2);

const loadStart = () => {
  isloading.value = true;
}

// const loadEnd = () => {
//   isloading.value = false;
// }

const data: (DataProps)[] = [
  {
    name: "上传视频",
    step: 1,
  },
  {
    name: "获取信息",
    step: 2,
  
  },
  {
    name: "等待审核",
    step: 3,
  },
  {
    name: "审核完毕",
    step: 4,
  }
]

const rules = reactive<FormRules>({
  video_name: [
    { required: true, message: 'Please input Activity video_name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  video_describe: [
    { required: true, message: 'Please input Activity video_describe', trigger: 'blur' },
    { min: 5, max: 50, message: 'Length should be 5 to 50', trigger: 'blur' },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate( async (valid, fields) => {
    if (valid) {
      try {
        if (File.value) {
          console.log(ruleForm);
          /**
           * 获取视频信息，发起审核申请,审核状态设置为2表示正在申请
           */
          VideoApi.exvideo("1",ruleForm).then( exvideo => {
            console.log(exvideo);
            Step.value = Step.value + 1;
          }).catch(error => {
            ElMessage.error(error);
          })
        } else {
          throw new Error("File Empty!");
        }
      } catch (error) {
        ElMessage.error(new Error(error as string).message);
      }
    } else {
      ElMessage.error("字段未输入");
      console.warn(fields);
    }
  })
}

const BeforUpload = async (F: UploadRawFile) => {
  File.value = F;
  return false;
};

// const HandleStops = async () => {
//   if (File.value) {
//     try {
//       const res = await HandleStop();
//       if (typeof res !== "number" && res.data.code === 201) {
//         loadEnd();
//         ElMessage.success("上传成功");
//         console.log(res);
//         Step.value = Step.value + 1;
//       }
//     } catch (error) {
//       ElMessage.error((error as string));
//       loadEnd();
//     }
//   }
// }

const submit = async () => {
  if (!File.value || !User.Auth) return;
  loadStart();
  const uploadData = await HandleStart();
  if (typeof uploadData !== "number") {
    if (!(uploadData.data.body instanceof Array)) {
      /**
       * 上传视频成功获取视频信息，审核状态设置为1（上传视频）
       */
      ruleForm.video_href = uploadData.data.body.video_href;
      ruleForm.video_time = uploadData.data.body.video_time;
      ruleForm.video_size = File.value.size;
      ruleForm.video_upload_user = User.Info.UserName;
      ruleForm.video_type = File.value.type;
      ruleForm.video_md5 = md5V.value;
      ruleForm.user_id = User.Auth.userId;
      VideoApi.exvideo("2",ruleForm).then( exvideo => {
        console.log(exvideo);
        Step.value = Step.value + 1;
      }).catch(error => {
        ElMessage.error(error);
      })
    }
  }
}

const HandleResets = () => {
  HandleReset();
  File.value = undefined;
}
</script>

<style lang="scss" scoped>
.ContributionScreenHeader{
  height: 60px;
  box-shadow: 0 2px 30px rgba(0, 0, 0,.1);
  .avatar{
    height: 40px;
    img{
      width: 40px;
    }
  }
  .user{
    background-color: rgb(254,243,238);
    height: 30px;
    line-height: 30px;
    width: 140px;
    border-radius: 40px;
    font-size: 12px;
    color: #fa8e57;
    border: 1px solid rgba(250,142,87,.43);
    margin-left: 20px;
  }
}
.StepBar{
  margin: 0 auto;
}

progress::-webkit-progress-bar {
  background-color: lightsalmon;
  border-radius: 10px;
  height: 5px;
}

progress::-webkit-progress-value {
  background: rgb(64, 158, 255);
  border-radius: 10px;
}

.FileParam{
  color: #78797c;
  user-select: none;
  margin-left: 120px;
  background-color: rgba(252, 252, 252, 1);
  .FileItem{
    font-weight: 100;
    height: 50px;
    padding: 5px 10px;
    margin-top: 10px;
    box-sizing: border-box;
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &:hover {
    border-color: rgb(64, 158, 255);
  }
  border-radius: 10px;
  border: 1px dashed #dcdfe6;
}
</style>
