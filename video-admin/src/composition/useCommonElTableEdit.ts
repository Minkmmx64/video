import { CommonApi } from "@/api/modules/common/CommonApi";
import { CommonModules } from "@/api/modules/common/CommonModules";
import { deepClone } from "@/common/utils";
import { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import { TableFunc } from "./useCommonElTableList";

interface IuseCommonElTableEdit<T>{
  HandleEdit: (scoped: T) => void;
  HandleView: (scoped: T) => void;
  HandleDelete: (scoped: T) => void;
  HandleNew: () => void;
  isEditing: Ref<boolean>;
  isView: Ref<boolean>;
  EditProps: Ref<T | undefined>
  HandleCancel: () => void;
  HandleOK: () => void;
  isBtnloading: Ref<boolean>
  HandleSelectionsDelete: () => void;
}

export function useCommonElTableEdit<T>(Api: CommonApi,TablefuncTion: TableFunc<T>): IuseCommonElTableEdit<T> {
  const { loadElTableData, SelectionsModules } = TablefuncTion;
  const isEditing = ref(false);
  const isView = ref(false);
  const isEdit = ref(false);
  const isDel = ref(false);
  const isNew = ref(false);
  const EditProps = ref<T | undefined>();
  const isBtnloading = ref(false);
  
  //编辑
  function HandleEdit(scoped: T) {
    EditProps.value = deepClone(scoped);
    isEditing.value = true;
    
    isEdit.value = true;
    isView.value = false;
    isDel.value = false;
    isNew.value = false;
  }
  //查看
  function HandleView(scoped: T) {
    EditProps.value = deepClone(scoped);
    isEditing.value = true;


    isView.value = true;
    isEdit.value = false;
    isDel.value = false;
    isNew.value = false;
  }

  //批量删除
  function HandleSelectionsDelete() {
    const PromisFunc = [] as unknown as (Promise<AxiosResponse<CommonModules<T>>>)[];
    if (SelectionsModules.value) {
      SelectionsModules.value.map(v => {
        const Func = Api.delete.call(Api, v) as unknown as Promise<AxiosResponse<CommonModules<T>>>;
        PromisFunc.push(Func);
      })
      console.log(PromisFunc);
      Promise.all(PromisFunc).then((d) => {
        ElMessage.success(d[0].data.message);
        loadElTableData();
      }).catch(error => ElMessage.error(error));
    }
  }

  //删除
  function HandleDelete(scoped: T) {
    isDel.value = true;
    isView.value = false;
    isEdit.value = false;
    isNew.value = false;

    Api.delete(scoped).then((d) => {
      loadElTableData();
      ElMessage.success(d.data.message);
    }).catch(error => ElMessage.error(error));
  }

  //添加
  function HandleNew() {
    isEditing.value = true;
    EditProps.value = deepClone({} as T);

    isNew.value = true;
    isEdit.value = false;
    isDel.value = false;
    isView.value = false;
  }

  //取消
  function HandleCancel() {
    isEditing.value = false;
  }

  //确定按钮
  function HandleOK() {
    isBtnloading.value = true;
    let currentApi = null;
    if (isEdit.value) {
      currentApi = Api.update.bind(Api, EditProps.value);
    }else if (isNew.value) {
      currentApi = Api.create.bind(Api,EditProps.value);
    } else return;

    currentApi().then((d) => {
      setTimeout(() => {
        loadElTableData();
        ElMessage.success(d.data.message);
        isBtnloading.value = false;
        isEditing.value = false;
      }, 800);
    }).catch(error => ElMessage.error(error))
  }
  return {
    HandleEdit,
    HandleDelete,
    HandleView,
    isEditing,
    isView,
    EditProps,
    HandleCancel,
    HandleOK,
    HandleNew,
    isBtnloading,
    HandleSelectionsDelete
  }
}