import axios from "axios";
import { Message } from "element-ui";
import { apiBaseUrl } from "@/config/index.js";
import { getToken, clearLoginStatus } from "@/utils/auth.js"

// 创建request示例
const request = axios.create({
  // 请求基址，开发环境使用proxy
  baseURL: apiBaseUrl[process.env.NODE_ENV],
  // 请求超时
  timeout: 10 * 1000,
  // 请求头信息
  headers: {
    // token认证
    'Authorization': "Bearer ",
    // 请求参数类型
    'Content-Type': 'application/json; charset=utf-8'
  },
});

// 配置请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token鉴权
    config.headers['Authorization'] += getToken() || ""

    // 过滤空参数
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] === null || config.params[key] === undefined) {
          delete config.params[key]
        }
      })
    }
    if (config.data) {
      Object.keys(config.data).forEach((key) => {
        if (config.data[key] === null || config.data[key] === undefined) {
          delete config.data[key]
        }
      })
    }

    // 对于没有配置Content-Type的请求，根据method统一添加
    if (config.method == "get") {
      config.headers["Content-Type"] = 'application/json; charset=utf-8'
    
    } else if (config.method == "post") {
      config.headers["Content-Type"] = 'application/x-www-form-unlencoded'
      // post请求，需要将请求参数转化为formData
      if (config.data) {
        let formData = new FormData()
        Object.keys(config.data).forEach((key) => {
          formData.set(key, config.data[key])
        })
        config.data = formData
      }
    
    } else if (config.method == "put") {
      config.headers["Content-Type"] = 'multipart/form-data'
    }
    
    return config;
  },

  (error) => {
    // 请求失败拦截
    console.log("request error: ", error);
    Message({
      showClose: true,
      message: error.msg || "请求失败",
      duration: 3000,
      type: "error",
    });
    return Promise.reject(error);
  }
);

// 配置响应拦截器
request.interceptors.response.use(
  (response) => {
    // 响应成功拦截
    const res = response.data;
    if (!res.code || res.code == 1000) {
      return res;
    }

    // 非成功响应码处理
    Message({
      showClose: true,
      message: res.msg || "请求失败",
      duration: 3000,
      type: "error",
    });
    // 对具体错误码的拦截
    const codePrefix = Math.floor(res.code / 1000);
    // 3xxx 用户认证异常
    if (codePrefix == 3) {
      // 清除无效登录态，并刷新页面
      clearLoginStatus()
      location.reload()
    }
    return Promise.reject(res);
  },

  (error) => {
    // 响应失败拦截
    console.log("response error: " + error);
    Message({
      showClose: true,
      message: error.msg || "操作失败，请检查网络或联系管理员！",
      duration: 3000,
      type: "error",
    });
    return Promise.reject(error);
  }
);

export default request;
