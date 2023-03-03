import request from "@/utils/request";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(data) {
  return request({
    url: "/system/user/list",
    method: "post",
    data: data,
  });
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: "/system/user/" + parseStrEmpty(userId),
    method: "get",
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "/system/user",
    method: "post",
    data: data,
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "/system/user",
    method: "put",
    data: data,
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: "/system/user/" + userId,
    method: "delete",
  });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password,
  };
  return request({
    url: "/system/user/resetPwd",
    method: "put",
    data: data,
  });
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status,
  };
  return request({
    url: "/system/user/changeStatus",
    method: "put",
    data: data,
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: "/system/user/profile",
    method: "get",
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: data,
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    params: data,
  });
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    data: data,
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

export function registerPerson(data) {
  return request({
    url: "/user/register",
    method: "post",
    data,
  });
}

//获取验证码接口 不设置 token
export function getRegisterCode(data) {
  return request({
    url: "/register/code",
    method: "post",
    data,
    headers: {
      isToken: false,
    },
  });
}

export function checkRegisterCode(data) {
  return request({
    url: "/register/check",
    method: "post",
    data,
    headers: {
      isToken: false,
    },
  });
}

export function registerInstitution(data) {
  return request({
    url: "/org/register",
    method: "post",
    data,
    headers: {
      isToken: false,
    },
  });
}


export function resetPaswd(data) {
  return request({
    url: "/system/user/profile/retrievePwd",
    method: "post",
    data,
    headers: {
      isToken: false,
    },
  });
}
