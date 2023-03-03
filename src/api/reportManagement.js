import request from "@/utils/request";

// 单项目报告 相关 api
export function getSingleReportList(data) {
  return request({
    url: "/report/singles",
    method: "post",
    data,
  });
}

export function getSingleReportBasicInfo(id) {
  return request({
    url: `/report/single/${id}`,
    method: "get",
  });
}

export function deleteTempSingleReport(id) {
  return request({
    url: `/report/single/${id}/temp`,
    method: "delete",
  });
}

export function getSingleReportDetail(singleId) {
  return request({
    url: `/report/single/${singleId}/account`,
    method: "get",
  });
}

export function uploadSingleFile(singleId) {
  return request({
    url: `/report/single/${singleId}/account`,
    method: "get",
  });
}

export function getSingleReportFormDetail(singleId) {
  return request({
    url: `/report/single/${singleId}/analysis/edit`,
    method: "get",
  });
}

export function editSingleReport(id, data) {
  return request({
    url: `/report/single/${id}`,
    method: "post",
    data,
  });
}

export function deleteSingleReport(id) {
  return request({
    url: `/report/single/${id}`,
    method: "delete",
    // params: query
  });
}

export function publishSingleReport(id, targetStatus) {
  return request({
    // status 传 0 , 则将其改为草稿状态,
    // 传 1, 改为 发布状态
    url: `/report/single/publish/${id}?status=${targetStatus}`,
    method: "post",
  });
}

export function generateSingleReport(data) {
  return request({
    url: "/report/single",
    method: "put",
    data,
  });
}

// 下载报告文件
export const downLoadSingleReportFileUrl = "/report/single/excel";
export const downloadSingleImgUrl = "/report/single/file";
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *

 *
 * */

// 项目汇总报告 相关 api
export function getMultiReportList(data) {
  return request({
    url: "/report/summary",
    method: "post",
    data,
  });
}

export function getMultiReportDetail(query) {
  return request({
    url: "/project/detail",
    method: "get",
    params: query,
  });
}

export function editMultiReport(query) {
  return request({
    url: "/project/list",
    method: "get",
    params: query,
  });
}

export function createTempMultiReport(data) {
  return request({
    url: `/report/summary`,
    method: "put",
    data,
  });
}

// 物理删除多项目分析报告的临时文件
export function deleteTempMultiReport(id) {
  return request({
    url: `/report/summaey/${id}/temp`,
    method: "delete",
    // params: query
  });
}

// 逻辑删除多项目分析报告
export function logicDeleteMultiReport(id) {
  return request({
    url: `/report/summaey/${id}`,
    method: "delete",
    // params: query
  });
}

// 下载报告文件
export const downLoadMultiReportFileUrl = "/report/summary/excel/";

//
export function generateReport(data) {
  return request({
    url: "/report/renegrate",
    method: "post",
    data,
  });
}

export function publishMultiReport(id, targetStatus) {
  return request({
    // status 传 0 , 则将其改为草稿状态,
    // 传 1, 改为 发布状态
    url: `/report/summary/${id}?status=${targetStatus}`,
    method: "post",
  });
}

// 创建临时汇总报告
export function saveDraftProjectSummaryReport(data) {
  return request({
    url: `/report/summary`,
    method: "put",
    data: data,
  });
}

// 获取汇总报告
export function getDraftProjectSummaryReport(sumId) {
  return request({
    url: `/report/summary/${sumId}/data`,
    method: "get",
  });
}

// 物理删除临时报告
export function delDraftProjectSummaryReport(sumId) {
  return request({
    url: `/report/summary/${sumId}/temp`,
    method: "delete",
  });
}

// 逻辑删除已发布的报告
export function delProjectSummaryReport(sumId) {
  return request({
    url: `/report/summary/${sumId}`,
    method: "delete",
  });
}

// 修改汇总报告状态
export function updateProjectSummaryReportStatus(sumId, status = 1) {
  return request({
    url: `/report/summary/${sumId}/status?status=${status}`,
    method: "post",
  });
}
