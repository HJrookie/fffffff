import Vue from "vue";

import Cookies from "js-cookie";

import Element from "element-ui";
import "./assets/styles/element-variables.scss";
import Router from "vue-router";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import App from "./App";
import store from "./store";
import router from "./router";
// import directive from "./directive"; // directive
// import plugins from "./plugins"; // plugins
import { download } from "@/utils/request";
import MyForm from "@/components/Form/index";
import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
// import Pagination from "@/components/Pagination";
// 自定义表格工具组件
// import RightToolbar from "@/components/RightToolbar";
// 富文本组件
// import Editor from "@/components/Editor";
// 文件上传组件
// import FileUpload from "@/components/FileUpload";
// 图片上传组件
// import ImageUpload from "@/components/ImageUpload";
// 图片预览组件
// import ImagePreview from "@/components/ImagePreview";
// 字典标签组件
// import DictTag from "@/components/DictTag";
// 头部标签组件
// import VueMeta from "vue-meta";
// 字典数据组件
// import DictData from "@/components/DictData";

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
window.l = console?.log;
Vue.prototype.$EventBus = new Vue();

// 全局组件挂载

// Vue.component("DictTag", DictTag);
// Vue.component("MyForm", MyForm);
// Vue.component("Pagination", Pagination);
// Vue.component("RightToolbar", RightToolbar);
// Vue.component("Editor", Editor);
// // Vue.component("FileUpload", FileUpload);
// Vue.component("ImageUpload", ImageUpload);
// Vue.component("ImagePreview", ImagePreview);

// Vue.use(directive);
// Vue.use(plugins);
// Vue.use(VueMeta);
// DictData.install();

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

window.document.oncopy = (event) => {
  // 获取剪切板内容
  let content = window?.getSelection().toString();
  // 判断当前浏览器是否支持获取剪切板对象
  if (event.clipboardData || event.originalEvent) {
    // 获取剪切板对象
    let clipboardData = event.clipboardData || window.clipboardData;
    // 重新设置剪切板内容（如果是要加一些版权信息之类的修改这个地方即可）
    clipboardData.setData("text/plain", content.trim());
    // 阻止事件冒泡
    // event.preventDefault();
  }
};

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});

// cols: [
//   { prop: "competitionName", label: "赛事名称", minWidth: 80 },
//   { prop: "annualName", label: "赛届", minWidth: 80 },
//   { prop: "year", label: "举办年份", minWidth: 80 },
//   { prop: "venue", label: "举办地", minWidth: 80 },
//   { prop: "registrationTimeStart", label: "报名开始时间", minWidth: 100 },
//   { prop: "registrationTimeEnd", label: "报名结束时间", minWidth: 100 },
//   { prop: "competitionTimeStart", label: "开赛时间", minWidth: 90 },
//   { prop: "competitionTimeEnd", label: "结赛时间", minWidth: 90 },
//   {
//     prop: "status",
//     label: "状态",
//     minWidth: 80,
//     render: (rowInfo) => {
//       return [
//         {
//           text: this.dicts.contestStatusMap[rowInfo?.status] ?? "",
//         },
//       ];
//     },
//   },
//   { prop: "acount", label: "报名人数", minWidth: 80 },
//   { prop: "humans", label: "参赛人数", minWidth: 80 },
//   { prop: "createTime", label: "创建时间", minWidth: 160, align: "center" },
//   {
//     prop: "operation",
//     label: "操作",
//     align: "center",
//     minWidth: 100,
//     class: "table-col-operations",
//     render: (rowInfo) => {
//
//       const edit = {
//         text: "修改",
//         size: "mini",
//         type: "text",
//         icon: "el-icon-edit",
//         onClick: (rowInfo) => {
//           this.eidtContestPeriod(rowInfo);
//         },
//       };
//       const deleteContes = {
//         text: "删除",
//         size: "mini",
//         type: "text",
//         icon: "el-icon-delete",
//         class: "text-danger",
//         onClick: (rowInfo) => {
//           this.deleteHandle(rowInfo.id);
//         },
//       };
//       // 未开始状态下 可以删除赛届
//       return [edit, deleteContes];
//
//       if (rowInfo?.status === 1) {
//         return [edit, deleteContes];
//       } else {
//         return [edit];
//       }
//     },
//   },
// ],

window.l = console.log;

// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch((err) => err);
// };
