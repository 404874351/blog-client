import * as qiniu from 'qiniu-js'
import axios from "axios";
import { Message } from "element-ui";
import request from "./request.js";
import { uuid } from "@/utils/util.js"

const getToken = ({ key }) => {
  return request({
    url: `/qiniu/token`,
    method: 'get',
    params: { key }
  })
}

const putExtra = {

}

const config = {
  useCdnDomain: true,
}

const imgSuffix = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
}

const maxAvatarSize = 3 * 1024 * 1024
const maxCoverSize = 5 * 1024 * 1024

const avatarDir = "avatar"
const articleDir = "article"
const imageDir = "image"

const upload = ({ file, key, token, observer }) => {
  try {
    var observable = qiniu.upload(file, key, token, putExtra, config)
    var subscription = observable.subscribe(observer)
  } catch (err) {
    subscription.unsubscribe()
  }
}

const uploadAvatar = ({ file, token, observer }) => {
  // 判断图片格式
  if (!imgSuffix[file.type]) {
    Message({
      showClose: true,
      message: "图片格式不符合要求",
      duration: 3000,
      type: "error",
    });
    throw new Error("图片格式不符合要求")
  }
  // 判断图片大小
  if (file.size > maxAvatarSize) {
    Message({
      showClose: true,
      message: "图片大小超出上限",
      duration: 3000,
      type: "error",
    });
    throw new Error("图片大小超出上限")
  }
  // 构造存储路径
  let suffix = file.name.slice(file.name.lastIndexOf("."))
  let key = avatarDir + "/" + uuid() + suffix
  // 上传文件
  upload({ file, key, token, observer })
}

const getArticle = (url) => {
  // 使用时间戳作为动态参数，避免磁盘缓存获取不到最新数据
  return axios.get(url, { accept: "text/html, text/plain", params: { timestamp: Date.now() } })
}


export {
  getToken,
  uploadAvatar,
  getArticle,
}