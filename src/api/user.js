import request from "@/utils/request";
import { saveContestInfo } from "@/api/contestManage";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

export function getUserList(params) {
  return request({
    url: "/user/list",
    method: "get",
    params,
  });
}

export function deleteUser(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data: data,
  });
}

export function editUser(data) {
  return request({
    url: "/user/edit",
    method: "post",
    data: data,
  });
}

// http://192.168.31.246:8080/getRouters

export function getRouters() {
  return request({
    url: "/getRouters",
    method: "get",
  });
}

export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get",
  });
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: "/system/user/authRole/" + userId,
    method: "get",
  });
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    params: data,
  });
}

export function getCodeImg() {
  return request({
    headers: {
      isToken: false,
    },
    url: "/captchaImage",
    method: "get",
    timeout: 20000,
  });
}

export function getInstitutionInfo() {
  return request({
    url: "/getInstitutionInfo/user/authRole",
    method: "get",
  });
}

export function saveInstitutionInfo(data) {
  return request({
    url: "/save/user/authRole",
    method: "post",
    data,
  });
}

export function getPersionalInfo() {
  return request({
    url: "/getPersionalInfo/user/authRole",
    method: "get",
  });
}

export function savePersonInfo(data) {
  return request({
    url: "/save/user/savePersonInfo",
    method: "post",
    data,
  });
}

export function getCurUserInfo() {
  return request({
    url: "/system/user/userInfo",
    method: "get",
  });
}

export function getjishus() {
  return request({
    url: "/system/user/userInfo",
    method: "get",
  });
}
export function getnenglis() {
  return request({
    url: "/system/user/userInfo",
    method: "get",
  });
}

// 个人用户  编辑信息
export function savePersonalInfo(data) {
  return request({
    url: "/system/user/person/save",
    method: "post",
    data,
  });
}

// 参赛单位  编辑信息
export function saveCsInfo(data) {
  return request({
    url: "/system/user/org/save",
    method: "post",
    data,
  });
}

export function getRibaoInfo(data) {
  return request({
    url: "/system/user/org/save",
    method: "post",
    data,
  });
}
export function getDates(data) {
  return request({
    url: "/system/user/org/save",
    method: "post",
    data,
  });
}

export function getUserDetail(params) {
  return request({
    url: "/user",
    method: "get",
    params,
  });
}

export function searchStus(params) {
  return request({
    url: "/users",
    method: "get",
    params,
  });
}

export function editusertInfo(params) {
  return request({
    url: `/user`,
    method: "post",
    params,
  });
}

export function addUser(params) {
  return request({
    url: `/user`,
    method: "post",
    params,
  });
}

export function getDaziData(params) {
  return request({
    url: `/typing`,
    method: "get",
    params,
  });
}

export function addTyping(params) {
  return request({
    url: `/typing`,
    method: "put",
    params,
  });
}

export function deletetyping(params) {
  return request({
    url: `/typing`,
    method: "delete",
    params,
  });
}

export function updatetyping(params) {
  return request({
    url: `/typing`,
    method: "post",
    params,
  });
}

export function getdanciData(params) {
  return request({
    url: `/wordwenjuan`,
    method: "get",
    params,
  });
}

export function addWord(params) {
  return request({
    url: `/wordwenjuan`,
    method: "put",
    params,
  });
}

export function deleteWord(params) {
  return request({
    url: `/wordwenjuan`,
    method: "delete",
    params,
  });
}

export function updateWord(params) {
  return request({
    url: `/wordwenjuan`,
    method: "post",
    params,
  });
}

export function getkaoqinData(params) {
  return request({
    url: `/attendance`,
    method: "get",
    params,
  });
}
export function addkaoqin(params) {
  return request({
    url: `/attendance`,
    method: "put",
    params,
  });
}

export function deletekaoqin(params) {
  return request({
    url: `/attendance`,
    method: "delete",
    params,
  });
}

export function updatekaoqin(params) {
  return request({
    url: `/attendance`,
    method: "post",
    params,
  });
}

// 课堂任务相关接口
export function getketangData(params) {
  return request({
    url: `/task`,
    method: "get",
    params,
  });
}

export function getRooms(params) {
  return request({
    url: `/api/user/dormList`,
    method: "get",
    params,
  });
}
export function saveUser(data) {
  return request({
    url: `/api/user/save`,
    method: "post",
    data,
  });
}
export function getRoomDetail(params) {
  return request({
    url: `/api/user/dormInfo`,
    method: "get",
    params,
  });
}

export function addSushe(data) {
  return request({
    url: `/api/dorm/add`,
    method: "put",
    data,
  });
}

export function updatsuseh(data) {
  return request({
    url: `/api/dorm/update`,
    method: "post",
    data,
  });
}

export function deleteSushe(params) {
  return request({
    url: `/api/dorm/delete`,
    method: "get",
    params,
  });
}

export function addketang(params) {
  return request({
    url: `/task`,
    method: "put",
    params,
  });
}

export function deleteketang(params) {
  return request({
    url: `/task`,
    method: "delete",
    params,
  });
}

export function updateketang(params) {
  return request({
    url: `/task`,
    method: "post",
    params,
  });
}

// 任务管理(发布)
export function getFabuData(params) {
  return request({
    url: `/teaacher_task`,
    method: "get",
    params,
  });
}

export function getkuData(params) {
  return request({
    url: `/task_library`,
    method: "get",
    params,
  });
}

export function addFabu(params) {
  return request({
    url: `/teaacher_task`,
    method: "put",
    params,
  });
}

export function deleteFabu(params) {
  return request({
    url: `/teaacher_task`,
    method: "delete",
    params,
  });
}

export function updateFabu(params) {
  return request({
    url: `/teaacher_task`,
    method: "post",
    params,
  });
}

export function getNianjis(params) {
  return request({
    url: `/attendance`,
    method: "get",
    params,
  });
}

export function getBanjis(params) {
  return request({
    url: `/task_module`,
    method: "get",
    params,
  });
}

// 任务管理(发布)
export function getTaskData(params) {
  return request({
    url: `/task_library`,
    method: "get",
    params,
  });
}
export function addTask(params) {
  return request({
    url: `/task_library`,
    method: "put",
    params,
  });
}

export function deleteTask(params) {
  return request({
    url: `/task_library`,
    method: "delete",
    params,
  });
}

export function updateTask(params) {
  return request({
    url: `/task_library`,
    method: "post",
    params,
  });
}

export function getMobTaskList(params) {
  return request({
    url: `/task_content`,
    method: "get",
    params,
  });
}

// 学生个人的任务
export function getStuTask(params) {
  return request({
    url: `/task_content`,
    method: "post",
    params,
  });
}

export function submitStuTask(params) {
  return request({
    url: `/task_content`,
    method: "put",
    params,
  });
}

/*
{
  "user_name": "张三",
  "percentage_complete": "5/30",
  "summary": "范德萨范德萨的分散",
  "like": "34",
  "comments": "20",
  "like_avatars": [
  "A",
  "B",
  "C",
  "D"
],
  "task_content": [
  {
    "id": 1,
    "task_name": "发动机开始啦风景点开始啦九分裤到拉萨就发抖克拉斯.",
    "content": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    "task_type": "imgage",
    "countdown": "10天23:59:59"
  },
  {
    "id": 2,
    "task_name": "发动机开始啦风景点开始啦九分裤到拉萨就发抖克拉斯.",
    "content": "今日总结,今天任务完成的很棒",
    "task_type": "text",
    "countdown": "10天23:59:59"
  }
]
},

 */
