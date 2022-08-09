import { AnyType, CommomListTableSortParams, CommonApi, getListParam, TableSort } from "@/api/modules/common/CommonApi";
import { ElMessage } from "element-plus";
import { Ref, ref , isRef } from "vue";

export interface TableFunc<T>{
  /**
   * 加载表格数据
   */
  loadElTableData: () => void;
  /**
   * 搜索表单
   */
  HandleSearch: () => void;
  /**
   * 搜索表单重置
   */
  HandleReset: () => void;
  /**
   * 表格排序事件
   * @param { ITableSortChange } TableSort
   */
  TableSortChange: (TableSort: ITableSortChange) => void;
  /**
   * 分页切换事件
   */
  pageChange: (currentPage: number, currrentLimit:number) => void;
  /**
   * 加载错误
   */
  dataLoadError: Ref<boolean>;
  /**
   * 列表多选
   */
  handleSelectionChange: (Collection: T[]) => void;
  /**
   * 多选列表value
   */
  SelectionsModules: Ref<T[] | undefined>;
}

export interface IuseCommonElTableList<T> {
  //表格函数
  TableFunction: TableFunc<T>
  //加载中
  isloading: Ref<boolean>;
  //表格数据
  dataSource: Ref<[]>;
  //总列表
  total: Ref<number>;
  //是否多选
  isSelections: Ref<boolean>;
}

export function useCommonElTableList<T extends CommonApi, S,M>(
  Api: new () => T,
  Paging: getPaging,
  search?: Ref<S>,
  query?: () => Record<string, AnyType>,
  sort?: CommomListTableSortParams): IuseCommonElTableList<M> {
  const TableApi = new Api();
  const total = ref(0);
  const dataSource = ref<[]>([]);
  const dataLoadError = ref(false);
  const isloading = ref(false);
  const isSelections = ref(false);
  const SelectionsModules = ref<M[]>();

  const TableQueryParam = ref<getListParam<S>>({
    limit: Paging.limit,
    offset: Paging.offset,
    search: search ? search.value : undefined,
    query: typeof query === "function" ? query() : undefined,
    sort: sort ? {
      column: sort.column,
      method: sort.method,
      defSortLock: sort.defSortLock
    } : undefined
  });

  function loadElTableData() {
    isloading.value = true;
    TableApi.getList(TableQueryParam.value).then(data => {
      setTimeout(() => {
        dataLoadError.value = false;
        isloading.value = false;
        dataSource.value = data.data.body as [];
        const Max = data.data.meta.count;
        if (typeof Max === "string") total.value = parseInt(Max);
        if (typeof Max === "number") total.value = Max;
      }, 800);
    }).catch(error => {
      dataLoadError.value = true;
      ElMessage.error(error);
    })
  }

  function pageChange(page:number,limit:number) {
    TableQueryParam.value.offset = page;
    TableQueryParam.value.limit = limit;
    loadElTableData();
  }

  function TableSortChange(TableSort: ITableSortChange) {
    if (sort?.defSortLock) {
      loadElTableData();
      return;
    }
    if (TableQueryParam.value.sort === undefined) {
      TableQueryParam.value.sort = {
        column: "id",
        method: "ascending",
        defSortLock: false,
      }
    }
    if (TableSort.prop && TableSort.order) {
      TableQueryParam.value.sort.column = TableSort.prop;
      TableQueryParam.value.sort.method = TableSort.order;
      loadElTableData();
      return;
    } else {
      TableQueryParam.value.sort.column = sort?.column || "";
      TableQueryParam.value.sort.method = sort?.method || "ascending";
      loadElTableData();
      return;
    }
  }

  function handleSelectionChange(obj: M[]) {
    SelectionsModules.value = obj;
    if (obj.length) {
      isSelections.value = true;
    } else {
      isSelections.value = false;
    }
  }

  function HandleSearch() {
    loadElTableData();
  }

  function HandleReset() {
    if (search && isRef(search)) {
      for (const k in search.value) {
        search.value[k] = null as unknown as S[Extract<keyof S, string>];
      }
    }
    loadElTableData();
  }

  return {
    dataSource,
    isloading,
    total,
    isSelections,
    TableFunction: {
      SelectionsModules,
      loadElTableData,
      TableSortChange,
      HandleSearch,
      HandleReset,
      dataLoadError,
      pageChange,
      handleSelectionChange,
    }
  }
}

export interface ITableSortChange{
  column: string;
  prop: string;
  order: TableSort
}

export interface getPaging{
  offset: number;
  limit: number;
}