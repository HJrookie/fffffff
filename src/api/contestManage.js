import request from "@/utils/request";

export function getContestInfo(data) {
  return request({
    url: `/maCompetition/info/list`,
    method: "post",
    data: data,
  });
}
// 市局 赛事列表 用的接口
export function getContestInfoOne(data) {
  return request({
    url: `/maCompetition/info/list/one`,
    method: "post",
    data: data,
  });
}

export function deleteContestInfo(ids) {
  return request({
    url: `/maCompetition/info/${ids}`,
    method: "delete",
  });
}

export function saveContestInfo(data) {
  return request({
    url: `/maCompetition/info`,
    method: "post",
    data,
  });
}

// 获取参赛单位申请详细信息
export function getCsInstitutionDetail(id) {
  return request({
    url: `/maApplyOrganization/info/${id}`,
    method: "get",
  });
}

// 修改 参赛单位申请 的状态, 就是 可以用来同意 或者驳回
export function ChangeCsInstitutionApplyStatus(data) {
  return request({
    url: `/maApplyOrganization/info`,
    method: "put",
    data,
  });
}

export function checkContestInfo(data) {
  return request({
    url: `/maCompetition/info/name/list`,
    method: "post",
    data,
  });
}


// 市局用户用的,获取所有赛项
export function getContestItem(data) {
  return request({
    url: `/maContest/info/list`,
    method: "post",
    data,
  });
}

// 承办单位用的,获取和他相关的赛项
export function getCbContestItem(data) {
  return request({
    url: `/maContest/info/undertaker/list`,
    method: "post",
    data,
  });
}

export function saveContestItem(data) {
  return request({
    url: `/maContest/info`,
    method: "post",
    data,
  });
}

export function editContestItem(data) {
  return request({
    url: `/maContest/info`,
    method: "put",
    data,
  });
}

// 检查赛项名称是否可用
export function checkContestItem(data) {
  return request({
    url: `maContest/info/name/list`,
    method: "post",
    data,
  });
}

// 组别
export function getGroups(data) {
  return request({
    url: `/maGroup/info/list`,
    method: "post",
    data,
  });
}
// 赛制
export function getContestRules(data) {
  return request({
    url: `/maFormat/info/list`,
    method: "post",
    data,
  });
}

export function deleteContestItem(ids) {
  return request({
    url: `/maContest/info/${ids}`,
    method: "delete",
  });
}

export function rejectOrganizerApprove(data) {
  return request({
    url: `/contest/data`,
    method: "post",
    data,
  });
}

//赛届相关接口
export function getContestPeriod(data) {
  return request({
    url: `/maAnnual/info/list`,
    method: "post",
    data,
  });
}

// 承办单位看到的和他相关的赛事相关接口,
// 相关的定义是 :  市局在新建承办单位时, 会选择 某一个单位和哪个 赛事赛届, 赛项 相关联,并且这个 还需要是通过状态
export function getCbContestInfo(data) {
  return request({
    url: `/maCompetition/info/undertaker/list`,
    method: "post",
    data,
  });
}

// 承办单位看到的和他相关的赛届相关接口,
export function getCbContestPeriod(data) {
  return request({
    url: `/maAnnual/info/undertaker/list`,
    method: "post",
    data,
  });
}

// 承办单位 查看他承办的那些赛项的列表
export function getCbContestItems(data) {
  return request({
    url: `/maContest/info/undertaker`,
    method: "post",
    data,
  });
}

// 称办单位 发起的赛项时间修改申请的列表
export function getCbContestTimeApplys(data) {
  return request({
    url: `/maApply/contest/undertaker/list`,
    method: "post",
    data,
  });
}

// 参赛单位看到的和他相关的赛事相关接口,
export function getCsContestInfo(data) {
  return request({
    url: `/maCompetition/info/org/list`,
    method: "post",
    data,
  });
}

// 参赛单位看到的和他相关的赛届相关接口,
export function getCsContestPeriod(data) {
  return request({
    url: `/maAnnual/info/org/list`,
    method: "post",
    data,
  });
}

// 参赛单位 查看他相关的那些赛项的列表
export function getCsContestItems(data) {
  return request({
    url: `/maContest/info/org`,
    method: "post",
    data,
  });
}

// 新增赛届
export function addContestPeriod(data) {
  return request({
    url: `/maAnnual/info`,
    method: "post",
    data,
  });
}

// 编辑赛届
export function editContestPeriod(data) {
  return request({
    url: `/maAnnual/info`,
    method: "put",
    data,
  });
}

// 检查赛届名称是否可用
export function checkContestPeriod(data) {
  return request({
    url: `maAnnual/info/name/list`,
    method: "post",
    data,
  });
}

export function deleteContestPeriod(ids) {
  return request({
    url: `/maAnnual/info/${ids}`,
    method: "delete",
  });
}

export function getRefereeLeaderApproveList(data) {
  return request({
    url: `/getRefereeLeaderApproveList/data`,
    method: "post",
    data,
  });
}

export function getRefereeLeaderApproveDetail(data) {
  return request({
    url: `/getRefereeLeaderApproveDetail/data`,
    method: "post",
    data,
  });
}

// 市局看到的 由承办单位发起的  修改赛项时间的申请列表
export function getContestItemApproveList(data) {
  return request({
    url: `/maApply/contest/city/list`,
    method: "post",
    data,
  });
}

// 参赛人员
export function getAllparticipants(data) {
  return request({
    url: `/getAllparticipants/data`,
    method: "post",
    data,
  });
}

export function getAllReporters(data) {
  return request({
    url: `/getAllReporters/data`,
    method: "post",
    data,
  });
}
export function getAllRefereess(data) {
  return request({
    url: `/getAllRefereesLeaders/data`,
    method: "post",
    data,
  });
}

export function getAllRefereesLeaders(data) {
  return request({
    url: `/getAllRefereesLeaders/data`,
    method: "post",
    data,
  });
}

export function getAllOthersHumans(data) {
  return request({
    url: `/getAllOthersHumans/data`,
    method: "post",
    data,
  });
}

// 查看参赛单位发起的赛项申请列表
export function getCsAllApplys(data) {
  return request({
    url: `/maApplyOrganization/info/apply/list`,
    method: "post",
    data,
  });
}

// 删除 参赛单位发起的 某一个赛项申请
export function deleteCsOneApply(ids) {
  return request({
    url: `/maApplyOrganization/info/${ids}`,
    method: "delete",
  });
}

// 参赛单位申请新赛项
export function applyNewContest(data) {
  return request({
    url: `/maApplyOrganization/info`,
    method: "post",
    data,
  });
}

// 承办单位要审批的 申请(由参赛单位发起的申请)
export function getAllpysFromCs(data) {
  return request({
    url: `/maApplyOrganization/info/approval/list`,
    method: "post",
    data,
  });
}

// 承办单位修改赛项的 开赛时间 以及 结赛时间 用到的接口
export function AddChangeContestTime(data) {
  return request({
    url: `/maApply/contest`,
    method: "post",
    data,
  });
}

// 操作人是市局, 市局新增承办单位时 ,默认是通过状态,也可以手动驳回
export function changeCbContestInfo(data) {
  return request({
    url: `/maApplyUndertaker/info`,
    method: "put",
    data,
  });
}

// 操作人是市局, 承办提出修改赛项时间的申请, 然后让市局审批,
export function changeCbContestTimeChangeStatus(data) {
  return request({
    url: `/maApply/contest`,
    method: "put",
    data,
  });
}

// 获取指定赛项的参赛单位用户列表
// 个人用户申请参赛时  需要选择所属单位,  这个单位需要通过这个接口获得
export function getTargetContestItemCsUsers(data) {
  return request({
    url: `/maApplyOrganization/info/org/list`,
    method: "post",
    data,
  });
}

// 获取 一个 个人用户 报了哪些赛项
export function getGrApplys(data) {
  return request({
    url: `/maApplyPersonal/info/person/list`,
    method: "post",
    data,
  });
}

// 根据文件 id 获取文件详细信息
export function getFileInfoById(id) {
  return request({
    url: `/system/file/${id}`,
    method: "get",
  });
}

// 根据 某个人发起赛项申请时提交的个人信息
export function getPersonContestApplyInfoById(data) {
  return request({
    url: `/maApplyUser/user/person`,
    method: "post",
    data,
  });
}

// 改变个人发起的赛项报名的状态 (通过这个申请 或者驳回)
export function changeGrApproveStatus(data) {
  return request({
    url: `/maApplyPersonal/info`,
    method: "put",
    data,
  });
}

// 改变承办发起的的 将裁判申请变为 裁判长 或者裁判长助理的申请的状态 (通过这个申请 或者驳回)
export function changeCBApproveStatus(data) {
  return request({
    url: `/maApplyUnit/info`,
    method: "put",
    data,
  });
}

export function importCoachOrReferee(data) {
  return request({
    url: `/import/coach`,
    method: "post",
    data,
  });
}

export function importReporters(data) {
  return request({
    url: `/import/journal`,
    method: "post",
    data,
  });
}

export function importOthers(data) {
  return request({
    url: `/import/other`,
    method: "post",
    data,
  });
}
// 导入承办单位
export function importCbs(data) {
  return request({
    url: `/import/maApplyUndertaker`,
    method: "post",
    data,
  });
}
