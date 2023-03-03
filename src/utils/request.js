import axios from "axios";
import { Notification, MessageBox, Message, Loading } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { tansParams, blobValidate } from "@/utils/ruoyi";
import { saveAs } from "file-saver";

let downloadLoadingInstance;
// 是否显示重新登录
let isReloginShow;

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 二进制数据则直接返回
    if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
      return res.data;
    }

    // 代表成功
    if (res.data.status === 0 || res.data.status === 200) {
      return res.data;
    } else if (res.data.status === 501 || res.data.status === 500) {
      Message({
        message: res.data.message,
        type: "error",
      });
      return Promise.reject(new Error(msg));
    } else if (res.data.status === 401) {
      if (!isReloginShow) {
        isReloginShow = true;
        MessageBox.confirm("登录状态已过期，您可以继续留在该页面，或者重新登录", "系统提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            isReloginShow = false;
            store.dispatch("LogOut").then(() => {
              // 如果是登录页面不需要重新加载
              // if (window.location.hash.indexOf("#/login") != 0) {
              location.href = "/login";
              // }
            });
          })
          .catch(() => {
            isReloginShow = false;
          });
      }
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    }

    // 未设置状态码则默认成功状态
    // const code = res.data.code || 200;
    // // 获取错误信息
    //
    // if (code === 401) {
    //
    //   return res.data;
    // } else if (code === 500) {
    //
    // } else if (code !== 200) {
    //   Notification.error({
    //     title: msg,
    //   });
    //   return Promise.reject("error");
    // } else {
    //   return res.data;
    // }
  },
  (error) => {
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

const downloadService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60 * 1000, // request timeout
});

// 下载时自定义文件名, sj 单位管理 (参赛单位 和 区局) 要自定义下载的文件的名称(参赛单位汇总表 ...)  用户管理那边也是  todo 注释需要移除
export const downloadFile = (config, customFileName) => {
  return downloadService(config).then((ress) => {
    l("ress", ress);
    const fileName = customFileName || decodeURI((ress.headers["content-disposition"] || "").split("filename=")[1].trim().replace('"', "").replace('"', ""));
    const a = document.createElement("a");
    const blob = new Blob([ress.data], { type: "application/octet-stream" });
    const objectUrl = URL.createObjectURL(blob);
    a.setAttribute("href", objectUrl);
    a.setAttribute("download", fileName);
    a.click();
  });
};

export default service;
