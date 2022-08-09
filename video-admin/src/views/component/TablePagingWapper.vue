<template>
  <div>
    <slot />
    <div class="TablePagingWapper mt-msm w-full flex flex-row justify-between items-center px-msm">
      <el-row>
        <el-button 
          @click="$emit('load')" 
          type="primary" 
          :loading="isloading">刷新</el-button>
        <el-button 
          @click="$emit('HandleSelectionsDelete')"
          v-if="isSelections" 
          type="danger" 
          :loading="isloading">批量删除</el-button>
      </el-row>
      <el-pagination 
        v-model:current-page="currentPage" 
        v-model:page-size="currrentLimit" 
        background
        layout="total, sizes, prev, pager, next" 
        :page-sizes="[10, 20, 30, 40]" 
        :total="total" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, toRefs, watch, withDefaults, defineEmits } from "vue";

interface IProps {
  isloading: boolean;
  total: number;
  isSelections: boolean;
}

const props = withDefaults(
  defineProps<IProps>(),
  {
    isloading: false,
    total: 0,
    isSelections:false
  }
)
const emits = defineEmits(["pageChange", "load","HandleSelectionsDelete"])
const { isloading, total } = toRefs(props);
const currentPage = ref(1);
const currrentLimit = ref(10);

watch(
  () => [currentPage.value, currrentLimit.value],
  () => 
    emits("pageChange", currentPage.value, currrentLimit.value)
)
</script>

<style lang="scss" scoped>

</style>