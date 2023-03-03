import request from "@/utils/request";

// add 承办单位
export function addOrganizer(data) {
  return request({
    url: `/maApplyUndertaker/info`,
    method: "post",
    data,
  });
}

// edit 承办单位
export function saveOrganizer(data) {
  return request({
    url: `/maApplyUndertaker/info`,
    method: "put",
    data,
  });
}

// edit 承办单位
export function getOrganizers(data) {
  return request({
    url: `/maApplyUndertaker/info/list`,
    method: "post",
    data,
  });
}

// 参赛单位
export function getParticipateInstis(data) {
  return request({
    url: `/maApplyOrganization/info/list`,
    method: "post",
    data,
  });
}

// 区局
export function getAreaInsis(data) {
  return request({
    url: `/getAreaInsis/data`,
    method: "post",
    data,
  });
}

// 获取所有的单位列表
export function getAlInstitutions() {
  return request({
    url: `/system/user/org/list`,
    method: "get",
  });
}

//参赛或者区局 获取参赛数据
export function getCsOrQjCanSaiData(data) {
  return request({
    url: `/maApplyOrganization/info/orgData/list`,
    method: "post",
    data,
  });
}

//承办单位 获取参赛数据
export function getCbjCanSaiData(data) {
  return request({
    url: `/maApplyOrganization/info/undertakerData/list`,
    method: "post",
    data,
  });
}

// 承办单位获取 已有的通知
export function getNotices(data) {
  return request({
    headers: {
      isToken: false,
    },
    url: `/system/noticeFile/list`,
    method: "get",
    params: data,
  });
}

// 新增通知
export function addNewPost(data) {
  return request({
    url: `/system/noticeFile/add`,
    method: "post",
    data: data,
  });
}

// 分数录入员 获取分数
export function getScores(data) {
  return request({
    url: `/system/score/list`,
    method: "post",
    data: data,
  });
}

// 分数录入员 新增分数
export function addScore(data) {
  return request({
    url: `/system/score/add`,
    method: "post",
    data: data,
  });
}

// 分数录入员 修改分数
export function updateScore(data) {
  return request({
    url: `/system/score/update`,
    method: "post",
    data: data,
  });
}

