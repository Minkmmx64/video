<template>
  <div class="TableContent TableScroll">
    <div class="TableSearchFrom">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px" class="demo-ruleForm" size="default" status-icon>
        <el-row :gutter="20" align="middle">
          <el-col :span="6">
            <el-form-item label="视频Id:">
              <el-input v-model="FromSearch.id" placeholder="id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="视频名称:">
              <el-input v-model="FromSearch.name" placeholder="name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="视频时长:">
              <el-select v-model="FromSearch.time" class="m-2" placeholder="Select">
                <el-option v-for="(item,index) in TimeSelect" :key="index" :label="item.name" :value="item.type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="md5">
              <el-input v-model="FromSearch.md5" placeholder="md5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" align="middle">
          <el-col :span="24" :style="{ textAlign:'right' }">
            <el-button @click="HandleSearch">搜索</el-button>
            <el-button type="danger" @click="HandleReset">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <TablePagingWapper :isSelections="isSelections" @HandleSelectionsDelete="HandleSelectionsDelete"
      @pageChange="pageChange" @load="loadElTableData" :isloading="isloading" :total="total">
      <!-- 表格 -->
      <el-table @selection-change="handleSelectionChange" class="TableList" v-loading="isloading" stripe
        :data="dataSource" element-loading-text="Loading..." style="width: 100%;" @sort-change="TableSortChange">
        <el-table-column align="center" type="selection" width="40" />
        <el-table-column align="center" fixed="left" type="index" label="索引" width="150" />
        <el-table-column align="center" prop="video_id" label="视频id" width="150" />
        <el-table-column align="center" prop="video_upload_user" label="上传用户" width="150" />
        <el-table-column align="center" prop="video_name" label="视频名称" width="150" />
        <el-table-column align="center" show-overflow-tooltip prop="video_href" label="视频路径" width="300" />
        <el-table-column align="center" prop="video_cover" label="视频封面" width="150">
          <template #default="{ row }">
            <div class="demo-image__preview">
              <el-image
                :preview-teleported="true"
                style="width: 50px; height: 50px;"
                :src="row.video_cover"
                :preview-src-list="[row.video_cover]"
                :initial-index="4"
                fit="cover"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="video_gif" label="视频gif" width="150">
          <template #default="{ row }">
            <div class="demo-image__preview">
              <el-image
                :preview-teleported="true"
                style="width: 50px; height: 50px;"
                :src="row.video_gif"
                :preview-src-list="[row.video_gif]"
                :initial-index="4"
                fit="cover"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="video_describe" label="视频描述" width="150" />
        <el-table-column align="center" prop="video_time" sortable="custom" label="时长" width="150" />
        <el-table-column align="center" prop="video_size" sortable="custom" label="视频大小(字节)" width="150" />
        <el-table-column align="center" prop="video_type" label="类型" width="150" />
        <el-table-column align="center" prop="video_bullet_count" label="弹幕数" width="150" />
        <el-table-column align="center" prop="video_collection_count" label="收藏数" width="150" />
        <el-table-column align="center" prop="video_comment_count" label="评论数" width="150" />
        <el-table-column align="center" prop="video_forward_count" label="转发数" width="150" />
        <el-table-column align="center" prop="video_like_count" label="点赞数" width="150" />
        <el-table-column align="center" prop="video_player_count" label="播放次数" width="150" />
        <el-table-column align="center" prop="video_md5" label="视频md5" width="350" />
        <el-table-column align="center" prop="created_at" sortable="custom" label="创建时间" width="150" />
        <el-table-column align="center" prop="updated_at" sortable="custom" label="修改时间" width="150" />
        <el-table-column align="center" fixed="right" label="操作" width="300">
          <template #default="{ row }">
            <el-button @click="HandleEdit(row)" type="primary" size="small">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button @click="HandleView(row)" size="small" type="success">查看</el-button>
            <el-divider direction="vertical" />
            <el-button @click="HandleDelete(row)" size="small" type="danger">删除</el-button>
            <el-divider direction="vertical" />
            <el-button @click="HandleUpload(row)" size="small" type="info">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePagingWapper>

    <el-dialog v-model="isEditing" destroy-on-close>
      <template #header>
        <div class="ElDialogHeader">
          {{ (isView ? '查看' : '编辑') + '视频' }}
        </div>
      </template>
      <el-form v-if="EditProps" :model="EditProps" label-width="120px">
        <el-form-item label="上传用户">
          <el-input v-model="EditProps.video_upload_user" />
        </el-form-item>
        <el-form-item label="视频名称">
          <el-input v-model="EditProps.video_name" />
        </el-form-item>
        <el-form-item label="视频描述">
          <el-input v-model="EditProps.video_describe" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="ElDialogFooter">
          <el-button @click="HandleCancel">关闭</el-button>
          <el-button type="primary" @click="HandleOK" v-if="!isView" :loading="isBtnloading">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import VideoApis, { VideoModule, VideoSearch, VideoApi } from "@/api/modules/VideoModules";
import { useCommonElTableList } from "@/composition/useCommonElTableList";
import { useCommonElTableEdit } from "@/composition/useCommonElTableEdit";
import TablePagingWapper from '../../component/TablePagingWapper.vue';

const ruleForm = reactive({});
const FromSearch = ref<VideoSearch>({
  id: null,
  name: null,
  time: null,
  md5: null
})
const { dataSource, isloading, TableFunction, total, isSelections } = useCommonElTableList<VideoApi, VideoSearch, VideoModule>(VideoApi, { limit: 10, offset: 1 }, FromSearch );
const { loadElTableData, TableSortChange, HandleReset, HandleSearch, pageChange, handleSelectionChange } = TableFunction;
const { HandleDelete, HandleEdit, HandleView, isEditing, isView, EditProps, HandleCancel, HandleOK, isBtnloading, HandleSelectionsDelete } = useCommonElTableEdit<VideoModule>(VideoApis, TableFunction);
const TimeSelect:{
    name:string,
    type:number
  }[] = [
  {
    name: "小于1分钟",
    type: 1,
  },
  {
    name: "1分钟-10分钟",
    type: 2,
  },
  {
    name: "10分钟-30分钟",
    type: 3,
  },
  {
    name: "30分钟-1小时",
    type: 4,
  },
  {
    name: "大于1小时",
    type: 5,
  }
]

const HandleUpload = (row: VideoModule) => {
  let a = document.createElement("a");
  a.href = row.video_href;
  a.download = `${row.video_md5}.mp4`;
  document.body.appendChild(a);
  a.click();
}

onMounted(() => {
  loadElTableData();
})
</script>

<style lang="scss" scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.demo-image__preview /deep/ .el-image-viewer__wrapper{
  z-index: 1000;
}
</style>