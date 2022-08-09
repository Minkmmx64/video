/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * 使用工作进程处理一些视频裁剪，gif转换操作
 */
const { parentPort, workerData, isMainThread } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const CreateFileMkdir = (fsp) => {                                       //生成文件夹
  return new Promise((resolve, reject) => {
    fs.stat(fsp, error => {
      if (error) {
        console.log(`文件路径${fsp}不存在正在创建`, error);
        try {
          fs.mkdirSync(fsp);
          resolve(true);
        } catch (error) {
          console.log(`文件路径${fsp}创建失败`);
          reject(error);
        }
      }
      else resolve(true);
    })
  })
}
if (!isMainThread) {
  const WorkerDatas = JSON.parse(workerData);
  const { href, md5, time } = WorkerDatas;
  const gifPath = path.resolve(__dirname, '../../../../../public/gif/' + time);
  CreateFileMkdir(gifPath).then(() => {
    const gif = gifPath + '/' + md5 + '.gif';
    const cmd = `ffmpeg -ss 00:00:00 -i ${href} -t 10 -s 200*200 ${gif}`;
    exec(cmd, (e) => {
      if (e) {
        throw new Error(e);
      }
      else {
        parentPort.postMessage("ok");
      };
    })
  }).catch( error => {
    throw new Error(error);
  })
}
