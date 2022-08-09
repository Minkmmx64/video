import { CommonApi } from "@/api/modules/common/CommonApi";
import { CommonModules } from "@/api/modules/common/CommonModules";
import { AxiosResponse } from "axios";
import { ElMessage, UploadRawFile } from "element-plus";
import md5 from "spark-md5";
import { uuid } from "./utils";
/**
 * 分片获取文件md5
 * @param File 文件 
 * @param slicing 分片次数
 * @returns md5
 */
function FileMd5(File: UploadRawFile,slicing:number,onprogress?:(p:number) => void):Promise<string>{
  const spark = new md5.ArrayBuffer();
  const filesize = Math.ceil(File.size / slicing) //每一份大小;
  return new Promise((resolve, reject) => {
    const slicingRead = (currentSize: number) => {
      if (currentSize > slicing) {
        return resolve(spark.end());
      } else {
        const fileReader = new FileReader();
        if (currentSize * filesize > File.size) {
          fileReader.readAsArrayBuffer(File.slice((currentSize - 1) * filesize, File.size));
        }
        else {
          fileReader.readAsArrayBuffer(File.slice((currentSize - 1) * filesize, currentSize * filesize));
        }
        fileReader.onload = function (e: ProgressEvent<FileReader>) {
          if (e.target) spark.append(e.target.result as ArrayBuffer);
        };
        fileReader.onloadend = function () {
          if (typeof onprogress === "function") onprogress(parseFloat(((currentSize / slicing) * 100).toFixed(2)));
          slicingRead(currentSize + 1);
        };
        fileReader.onerror = (e) => reject(e);
      }
    }
    slicingRead(1);
  })
}

export interface IUploadFileCallback{
  /**
   * 正在上传
   * @param p 上传进度
   * @param sp 上传速率
   */
  onprogress: (P: number, SP: number) => void,
  /**
   * 上传成功
   * @param f 文件信息
   */
  onsuccess: (f: Blob,md5?:string) => void,
  /**
   * 上传失败
   * @param error 失败信息
   */
  onerror?: (error: Error) => void,
  /**
   * md5获取速度
   * @param p 进度
   */
  onmd5progress?: (p: number,md5?:string) => void,
}

//上传时参数
export interface UploadProgressParams{
  md5: string;
  md5speed: number;
  uploadspeed: number;
  uploadprogress: number;
}

/**
 * 文件上传
 * @param Api  上传Api
 * @param File 文件
 * @param type 是否分片上传
 * @param Slicing 每一份大小 ( 最小 2MB )
 * @param {ICallback} cb  回调
 */
export async function useELSlicingUpload<T extends CommonApi,K>(
  Api: new () => T,
  File: UploadRawFile,
  type: "Slicing" | "NoSlicing",
  cb: IUploadFileCallback,
  Slicing?: number,
): Promise<AxiosResponse<CommonModules<K | K[]>>>
{
  //获取上传接口实例
  const ApiUpload = new Api();
  //等待计算md5
  const md5 = await FileMd5(File, 10000, cb.onmd5progress);
  if (cb.onmd5progress) cb.onmd5progress(100, md5);
  try {
    /**
    * 先上传md5,如果存在则直接返回文件路径，否则上传文件
    * code
    */
    const judgeMd5 = await ApiUpload.checkMd5<K>(md5);
    //205 表示资源重复
    if (judgeMd5.data.code === 205) {
      //文件已经存在
      return Promise.resolve(judgeMd5);
    } else {
      //如果是分片上传
      if (type === "Slicing") {
        //初始化切片大小
        const SlicingSize = (typeof Slicing === "number" ? (Slicing > 0 ? Slicing : 2) : 2);
        //获取文件大小（单位MB）
        const currentSize = File.size / (1024 * 1024);
        //获取切片次数
        const MaxSlicing = Math.ceil(currentSize / SlicingSize);
        //储存Api函数
        const CallBackQueue = [] as (() => Promise<AxiosResponse<CommonModules<K>>>)[];
        //获取4位数uuid
        const uuids = uuid();
        //上传方法
        const upload = (currentSlicing: number): void => {
          let currentFile = null;
          const slicingFromData = new FormData();
          slicingFromData.append("filename", File.name);
          slicingFromData.append("md5", md5);
          slicingFromData.append("type", type);
          slicingFromData.append("uuid", uuids);
          if (currentSlicing * SlicingSize > currentSize) { //文件切片
            currentFile = File.slice((currentSlicing - 1) * SlicingSize * 1024 * 1024, currentSlicing * SlicingSize * 1024 * 1024);
            slicingFromData.append("File", currentFile);
          } else {
            currentFile = File.slice((currentSlicing - 1) * SlicingSize * 1024 * 1024, currentSlicing * SlicingSize * 1024 * 1024);
            slicingFromData.append("File", currentFile);
          }
          slicingFromData.append("count", currentSlicing.toString());
          slicingFromData.append("max", MaxSlicing.toString());
          CallBackQueue.push(ApiUpload.uploadFile.bind(ApiUpload, slicingFromData) as () => Promise<AxiosResponse<CommonModules<K>>>);
        }
        //上传函数入队
        for (let i = 1; i <= MaxSlicing; i++)
          upload(i);

        try {
          //执行回调
          for (let i = 0; i < MaxSlicing; i++) {
            //获取开始上传时间戳
            const startTimer = new Date().getTime();
            //开始上传
            await CallBackQueue[i]()
            //获取上传耗时
            const sp = (new Date().getTime() - startTimer) / 1000;
            //计算上传速度
            if (typeof cb.onprogress === "function")
              cb.onprogress(parseFloat((((i + 1) / MaxSlicing) * 100).toFixed(2)), parseFloat((SlicingSize / sp).toFixed(2)));
          }
          //上传成功获取文件信息
          if (typeof cb.onsuccess === "function") cb.onsuccess(File, md5);
          /**
          * 发送文件分片完毕请求，合并文件
          */
          return new Promise((resolve, reject) => {
            ApiUpload.requestSliciingUploadComplete<K>(uuids).then(data => {
              ElMessage.success(data.data.message);
              resolve(data);
            }).catch(error => {
              ElMessage.error(error);
              reject(error)
            });
          })
        } catch (error) {
          //分片失败
          ElMessage.error(new Error(`"分片失败"${error}`));
          if (typeof cb.onerror === "function") {
            cb.onerror(new Error(`"分片失败"${error}`))
          }
          /**
           * 发送失败请求删除分片文件
           */
          return new Promise((resolve, reject) => {
            ApiUpload.requestSliciingUploadFail<K>(uuids).then(data => {
              resolve(data);
            }).catch(error => reject(error));
          })
        }
        //不需要分片上传
      } else {
        //获取开始上传时间戳
        const startTimer = new Date().getTime();
        const slicingFromData = new FormData();
        slicingFromData.append("File", File);
        slicingFromData.append("filename", File.name);
        slicingFromData.append("type", type);
        slicingFromData.append("md5", md5);
        //开始上传
        return new Promise((resolve, reject) => {
          ApiUpload.uploadFile<K>(slicingFromData)
            .then(data => {
              //上传耗时
              const sp = (new Date().getTime() - startTimer) / 1000;
              if (typeof cb.onsuccess === "function") cb.onsuccess(File, md5);
              if (typeof cb.onprogress === "function") cb.onprogress(100, (File.size / (1024 * 1024)) / sp);
              resolve(data);
            })
            .catch(error => {
              if (typeof cb.onerror === "function") cb.onerror(error);
              reject(error);
            });
        })
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
}