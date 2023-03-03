import request from "@/utils/request";

/*
 * identity 参赛人员 是 1, 媒体记者是 2, 裁判是 3, 裁判长是 4, 裁判长助理传 5,  教练 是 6,  对于 其他人员,  就要传 字典表中  sys_role_others 的对应的值
 * userType 用户类型      用户类型（0：系统用户；1, 区局, 2：单位用户，3个人用户；4其他人员）,  (参赛人员,媒体记者, 裁判,裁判长,教练, 裁判长助理 都是个人用户)
 *
 * */
export function getUsers(data) {
  return request({
    url: "/maApplyPersonal/info/list",
    method: "post",
    data: data,
  });
}

// 这个接口是 参赛单位 或者区局用的,
export function getUsersForCs(data) {
  return request({
    url: "/maApplyPersonal/info/org/list",
    method: "post",
    data: data,
  });
}

// 这个接口是 承办单位用的用的,
export function getUsersForCb(data) {
  return request({
    url: "/maApplyPersonal/info/undertaker/list",
    method: "post",
    data: data,
  });
}

// 新增赛事申请 就是个人用户  申请参加某个赛项的比赛
export function addNewApplyForContest(data) {
  return request({
    url: "/maApplyPersonal/info/apply",
    method: "post",
    data: data,
  });
}

// 新增赛项相关的人 , 例如 裁判长
export function addContestItemPerson(data) {
  return request({
    url: "/maApplyPersonal/info",
    method: "post",
    data: data,
  });
}

// 将一个教练申报为裁判, 会发起一个申请,让承办审批
export function changeCoachToReferee(data) {
  return request({
    url: "/maApplyUnit/info",
    method: "post",
    data: data,
  });
}

// 获取那些申请将身份转换的申请的列表, 例如将 教练变化为 裁判, 或者 裁判-> 裁判长助理
export function getAllunitAppls(data) {
  return request({
    url: "/maApplyUnit/info/list",
    method: "post",
    data: data,
  });
}

//承办单位用的, 获取那些和他相关的审批数据
export function getCbAppls(data) {
  return request({
    url: "/maApplyUnit/info/undertaker/list",
    method: "post",
    data: data,
  });
}

// 参赛单位使用的,  拿来获取  教练变化为 裁判, 的申请的列表
export function getAllCoachApplys(data) {
  return request({
    url: "/maApplyUnit/info/org/list",
    method: "post",
    data: data,
  });
}

// 将一个教练申报为裁判, 会发起一个申请,让承办审批
export function changeRefereeToLeaderOrAssis(data) {
  return request({
    url: "/maApplyUnit/info",
    method: "post",
    data: data,
  });
}
