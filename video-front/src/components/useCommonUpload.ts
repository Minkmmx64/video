import { ElMessage, UploadRawFile } from "element-plus";
import { Ref, ref } from "vue";
import md5 from "spark-md5";
import { CommonApi } from "@/api/Apis/CommonApi";
import { uuid } from "@/common/utils";
import { AxiosResponse } from "axios";
import { CommonModules } from "@/api/Apis/common";

type AT<T> = AxiosResponse<CommonModules<T | T[]>> | number;

type QueueCallBack<T> = () => Promise<AxiosResponse<CommonModules<T>>>;

export interface IuseCommonUpload<T> {
  /**
   * 重置
   */
  HandleReset: () => void;
  /**
  * 中断上传操作
  */
  HandleStop: () => Promise<AT<T>>;
  /**
   * 开始上传
   */
  HandleStart: () => Promise<AT<T>>;
  /**
  * 分片获取文件md5
  */
  ComputeMd5: () => Promise<string>;
  /**
   * md5值
   */
  md5V: Ref<string>;
  /**
   * 计算md5进度
   */
  ComputerMd5process: Ref<number>;
  /**
   * 上传速度
   */
  UploadSpeed: Ref<number>;
  /**
   * 上传进度
   */
  UploadProgress: Ref<number>;
  /**
   * 是否暂停
   */
  isStart: Ref<boolean>;
  /**
   * 暂停时的索引
   */
  StopIndex: Ref<number>;
  /**
   * 队列回调函数
   */
  CallBackQueue: Ref<QueueCallBack<T>[]>;
  /**
   * 是否上传完成
   */
   isComplete: Ref<boolean>;
}

export function useCommonUpload<T>(
  ApiUpload: CommonApi,
  File: Ref<UploadRawFile> | undefined,
  type: "Slicing" | "NoSlicing",
  Slicing?: number): IuseCommonUpload<T> {

  const md5V = ref<string>("");                                                           //md5
  const ComputerMd5process = ref<number>(0);                                              //md5计算进度
  const SlicingSize = (typeof Slicing === "number" ? (Slicing > 0 ? Slicing : 2) : 2);    //分片大小
  const UploadSpeed = ref(0);                                                             //上传速度
  const UploadProgress = ref(0);                                                          //上传进度
  const uuidV = ref<string>("");                                                          //uuid
  const isStart = ref(true);                                                              //是否暂停
  const StopIndex = ref(0);                                                               //暂停时的index
  const currentSize = ref(0);                                                             //文件大小
  const MaxSlicing = ref(0);                                                              //最大分片
  const isComplete = ref(false);                                                          //是否完成
  const CallBackQueue = ref<QueueCallBack<T>[]>([]);                                           //函数队列

  function ComputeMd5(): Promise<string> {
    if (File && File.value) {
      const spark = new md5.ArrayBuffer();
      const filesize = Math.ceil(File.value.size / 10000);
      return new Promise((resolve, reject) => {
        const slicingRead = (currentSize: number) => {
          if (currentSize > 10000)
            return resolve(spark.end());
          else {
            const fileReader = new FileReader();
            if (currentSize * filesize > File.value.size)
              fileReader.readAsArrayBuffer(File.value.slice((currentSize - 1) * filesize, File.value.size));
            else
              fileReader.readAsArrayBuffer(File.value.slice((currentSize - 1) * filesize, currentSize * filesize));

            fileReader.onload = function (e: ProgressEvent<FileReader>) {
              if (e.target)
                spark.append(e.target.result as ArrayBuffer);
            };
            fileReader.onloadend = function () {
              ComputerMd5process.value = parseFloat(((currentSize / 10000) * 100).toFixed(2));
              slicingRead(currentSize + 1);
            };
            fileReader.onerror = (e) => reject(e);
          }
        }
        slicingRead(1);
      })
    } else return Promise.reject();
  }

  async function HandleStop(): Promise<AT<T>>{
    isStart.value = !isStart.value;
    if (isStart.value && File && uuidV.value && !isComplete.value && md5V.value) {
      return await LoopUploadQueueFunc(StopIndex.value);
    } return Promise.reject("Error");
  }

  async function LoopUploadQueueFunc(Index?: number): Promise<AT<T>> {
    for (let i = (Index ? Index : 0); i < MaxSlicing.value; i++) {
      if (!isStart.value) {
        StopIndex.value = i;
        return Promise.resolve(i);
      }
      else {
        const startTimer = new Date().getTime();
        await CallBackQueue.value[i]()
        const sp = (new Date().getTime() - startTimer) / 1000;
        UploadProgress.value = parseFloat((((i + 1) / MaxSlicing.value) * 100).toFixed(2));
        UploadSpeed.value = parseFloat((SlicingSize / sp).toFixed(2));
      }
    }
    return new Promise((resolve, reject) => {
      ApiUpload.requestSliciingUploadComplete<T>(uuidV.value).then(data => {
        ElMessage.success(data.data.message);
        isComplete.value = true;
        resolve(data);
      }).catch(error => {
        ElMessage.error(error);
        reject(error)
      });
    })
  }

  function HandleReset() {
    md5V.value = "";
    ComputerMd5process.value = 0;
    UploadSpeed.value = 0;
    UploadProgress.value = 0;
    uuidV.value = "";
    isStart.value = true;
    StopIndex.value = 0;
    currentSize.value = 0;
    MaxSlicing.value = 0;
    isComplete.value = false;
    CallBackQueue.value = [];
  }

  async function HandleStart(): Promise<AT<T>> {
    uuidV.value = uuid();
    if (md5V.value === "") md5V.value = await ComputeMd5();
    const Md5IsExist = await ApiUpload.checkMd5<T>(md5V.value);
    const HttpStatus = Md5IsExist.data.code;
    if (HttpStatus === 202) return Promise.resolve(Md5IsExist);
    if (File) {
      if (type === "Slicing") {
        currentSize.value = File.value.size / (1024 * 1024);
        MaxSlicing.value = Math.ceil(currentSize.value / SlicingSize);
        const upload = (currentSlicing: number): void => {
          let currentFile = null;
          const slicingFromData = new FormData();
          slicingFromData.append("filename", File.value.name);
          slicingFromData.append("md5", md5V.value);
          slicingFromData.append("type", type);
          slicingFromData.append("uuid", uuidV.value);
          if (currentSlicing * SlicingSize > currentSize.value) { //文件切片
            currentFile = File.value.slice((currentSlicing - 1) * SlicingSize * 1024 * 1024, currentSlicing * SlicingSize * 1024 * 1024);
            slicingFromData.append("File", currentFile);
          } else {
            currentFile = File.value.slice((currentSlicing - 1) * SlicingSize * 1024 * 1024, currentSlicing * SlicingSize * 1024 * 1024);
            slicingFromData.append("File", currentFile);
          }
          slicingFromData.append("count", currentSlicing.toString());
          slicingFromData.append("max", MaxSlicing.value.toString());
          CallBackQueue.value.push(ApiUpload.uploadFile.bind(ApiUpload, slicingFromData) as QueueCallBack<T>);
        }
        for (let i = 1; i <= MaxSlicing.value; i++) upload(i);
        try {
          return await LoopUploadQueueFunc();
        } catch (error) {
          ElMessage.error(new Error(`"分片失败"${error}`));
          return new Promise((resolve, reject) => {
            ApiUpload.requestSliciingUploadFail<T>(uuidV.value).then(data => {
              resolve(data);
            }).catch(error => reject(error));
          })
        }
      } else {
        const startTimer = new Date().getTime();
        const slicingFromData = new FormData();
        slicingFromData.append("File", File.value);
        slicingFromData.append("filename", File.value.name);
        slicingFromData.append("type", type);
        slicingFromData.append("md5", md5V.value);
        return new Promise((resolve, reject) => {
          ApiUpload.uploadFile<T>(slicingFromData)
            .then(data => {
              const sp = (new Date().getTime() - startTimer) / 1000;
              UploadProgress.value = 100;
              UploadSpeed.value = (File.value.size / (1024 * 1024)) / sp;
              resolve(data);
            }).catch(error => reject(error));
        });
      }
    } else return Promise.reject("File Empty!");
  }

  window.addEventListener("beforeunload", (e: Event) => {
    e.returnValue = false;
    return false;
  })
  
  return {
    md5V,
    ComputeMd5,
    HandleStop,
    ComputerMd5process,
    HandleStart,
    UploadProgress,
    UploadSpeed,
    isStart,
    HandleReset,
    StopIndex,
    CallBackQueue,
    isComplete
  }
}