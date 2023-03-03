import request from "@/utils/request";
import store from "@/store";

// 获取数据列表
export function getRealDataList(data) {
  return request({
    url: `/comaccount/periods`,
    method: "post",
    data,
  });
}

// 上传文件
export function uploadRealDataFile(data) {
  return request({
    url: "/comaccount/period/file/upload",
    method: "post",
    data,
    headers: { "Content-Type": "multipart/form-data;" },
  });
}

//保存文件 ,
export function saveFile(data) {
  return request({
    url: "/comaccount/period",
    method: "post",
    data,
    // headers: { "Content-Type": "multipart/form-data;" }
  });
}

// 获取上传记录信息
export function getUploadHistory(id) {
  return request({
    url: `/comaccount/record/${id}`,
    method: "get",
    // headers: { "Content-Type": "multipart/form-data;" }
  });
}

// 企业会计报表下载
export const downLoadCompanyExcelUrl = "/comaccount/record/file/";
export function downLoadCompanyExcel(id) {
  return request({
    url: `${downLoadCompanyExcelUrl}/${id}`,
    method: "get",
  });
}

// 查看企业已上传数据    其实就是这个文件中的数据的详情
export function getFileDetail(id) {
  return request({
    url: `/comaccount/${id}`,
    method: "get",
    // headers: { "Content-Type": "multipart/form-data;" }
  });
}

// export function importFile(pv) {
//   return request({
//     url: "/compass/importFile",
//     method: "get",
//     params: { pv }
//   });
// }

/*
*

*
*  上方的请求都是 导入实际数据的接口
*  下方的是 导入预测数据的接口
*
*
*
*
* */

// 获取数据列表
export function getPredictDataList(data) {
  return request({
    url: `/report/forecasts`,
    method: "post",
    data,
  });
}

// 下载预测文件
export const downLoadPredictFileUrl = "/report/forecast/file/";
export function downLoadPredictFile(fileId) {
  return request({
    url: `${downLoadPredictFileUrl}/ ${fileId}`,
    method: "get",
  });
}

// 获取删除预测数据
export function deletePredictFile(fileId) {
  return request({
    url: `/report/forecast/${fileId}`,
    method: "delete",
  });
}

// 上传文件
export function uploadPredictDataFile(data) {
  return request({
    url: "/report/forecast",
    method: "post",
    data,
    headers: { "Content-Type": "multipart/form-data;" },
  });
}

// 查看单次预测数据    其实就是这个文件中的数据的详情
export function getOnePredictFileDetail(id) {
  return request({
    url: `/report/forecast/${id}`,
    method: "get",
  });
}

// 查看企业所有预测数据
export function getAllPredictFilesOfCompany(id, params) {
  return request({
    url: `/report/forecast/company/${id}`,
    method: "get",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    params,
  });
}
