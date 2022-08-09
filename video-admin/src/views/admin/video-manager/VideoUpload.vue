<template>
  <div class="TableContent TableScroll">
    <!-- 视频上传 -->
    <!-- <VideoUpload /> -->
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm" size="default"
      status-icon>
      <el-form-item label="视频名称" prop="video_name">
        <el-input v-model="ruleForm.video_name" />
      </el-form-item>
      <el-form-item label="视频描述" prop="video_describe">
        <el-input rows="5" v-model="ruleForm.video_describe" type="textarea" />
      </el-form-item>
      <el-form-item label="上传用户" prop="video_upload_user">
        <el-input v-model="ruleForm.video_upload_user" />
      </el-form-item>
    </el-form>
    <div class="videoupload flex flex-row pl-mid mt-mid">
      <div class="upload w-full flex flex-col ">
        <el-upload class="upload-demo" drag :before-upload="BeforUpload">
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>
        <div v-if="isExist" class="w-full flex flex-col justify-start items-start">
          <el-button link type="success" style="margin-left: 12px;">文件已存在</el-button>
          <el-button link type="primary">路径:&nbsp;&nbsp;&nbsp;&nbsp;<a :href="Video?.video_href"
              target="_blank">{{Video?.video_href}}</a></el-button>
          <el-button link type="danger">md5:&nbsp;&nbsp;&nbsp;&nbsp;{{ Video?.video_md5}}</el-button>
        </div>
      </div>
      <div class="FileParam flex flex-col cursor-pointer px-msm">
        <div class="FileItem">当前文件: {{ File?.name }}</div>
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
        <el-button @click="HandleStops" >{{ isStart ? '暂停' : '继续'}}</el-button>
      </div>
    </div>
    <el-row class="mt-bs" justify="center">
      <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="isloading">Upload</el-button>
      <el-button @click="resetForm(ruleFormRef)" :disabled="isloading">清除</el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { CommonModules } from "@/api/modules/common/CommonModules";
import VideoApi, { VideoFrom, VideoModule } from "@/api/modules/VideoModules";
import { isValidKey } from "@/common/utils";
import { useCommonUpload } from "@/composition/useCommonUpload";
import { UploadFilled } from '@element-plus/icons-vue'
import { AxiosResponse } from "axios";
import { ElMessage, FormInstance, FormRules, UploadRawFile } from 'element-plus'
import { reactive, Ref, ref } from "vue";

const ruleFormRef = ref<FormInstance>();
const File = ref<UploadRawFile>();
const isExist = ref(false);
const Video = ref<VideoModule>();
const ruleForm = reactive<VideoFrom>({
  video_describe: '',
  video_href: '',
  video_name: '',
  video_upload_user: '',
  video_time: 0,
  video_type: '',
  video_md5: '',
  video_size: 0,
})

const isloading = ref(false);

const loadStart = () => {
  isloading.value = true;
}

const loadEnd = () => {
  isloading.value = false;
}

const rules = reactive<FormRules>({
  video_name: [
    { required: true, message: 'Please input Activity video_name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  video_describe: [
    { required: true, message: 'Please input Activity video_describe', trigger: 'blur' },
    { min: 5, max: 50, message: 'Length should be 5 to 50', trigger: 'blur' },
  ],
  video_upload_user: [
    { required: true, message: 'Please input Activity video_upload_user', trigger: 'blur' },
    { min: 2, max: 10, message: 'Length should be 2 to 10', trigger: 'blur' },
  ],
})

const { HandleStart, md5V, ComputerMd5process, UploadProgress, UploadSpeed, HandleStop, isStart, HandleReset } = useCommonUpload<VideoModule>(VideoApi, File as Ref<UploadRawFile>, "Slicing", 2);

const HandleStops = async () => {
  if (File.value) {
    try {
      const res = await HandleStop();
      if (typeof res !== "number" && res.data.code === 201) {
        create(res);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const create = (res: AxiosResponse<CommonModules<VideoModule | VideoModule[]>>) => {
  if (File.value) {
    isExist.value = false;
    ElMessage.success(res.data.message);
    if (!(res.data.body instanceof Array)) {
      ruleForm.video_href = res.data.body.video_href;
      ruleForm.video_time = res.data.body.video_time;
      ruleForm.video_size = File.value.size;
    } else {
      Video.value = res.data.body[0];
    }
    ruleForm.video_md5 = md5V.value;
    //文件上传成功，上传全部信息
    setTimeout(() => {
      ElMessage.success("上传视频参数loading.....")
      setTimeout(() => {
        VideoApi.create<VideoModule, VideoFrom>(ruleForm).then(data => {
          ElMessage.success(data.data.message);
          resetForm(ruleFormRef.value);
          loadEnd();
        }).catch(error => {
          ElMessage.error(error);
          loadEnd();
        })
      }, 800);
    }, 800);
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate( async (valid, fields) => {
    if (valid) {
      try {
        if (File.value) {
          loadStart();
          const uploadData = await HandleStart();
          if (typeof uploadData === "number") {
            console.log(uploadData);
          } else {
            if (uploadData.data.code === 202) {
              isExist.value = true;
              if (uploadData.data.body instanceof Array) {
                Video.value = uploadData.data.body[0];
                loadEnd();
                return ElMessage.info(
                  ` ${uploadData.data.message}\n
                  视频路径:${Video.value.video_href}\n
                  视频Id:${Video.value.video_id}
                `);
              }
            } else {
              create(uploadData);
            }
          }
        } else {
          throw new Error("File Empty!");
        }
      } catch (error) {
        loadEnd();
        resetForm(ruleFormRef.value);
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
  ruleForm.video_type = F.type;
  return false;
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  for (const k in Video.value) {
    if (isValidKey(k, Video.value)){
      Video.value[k] = "" as never;
    }
  }
  isExist.value = false;
  HandleReset();
}

</script>

<style scoped lang="scss">
.upload-demo{
 width: 1000px;
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