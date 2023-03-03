import request from "@/utils/request";

// 获取投资团队 或者 获取投资基金, 都是这个接口,只是参数不同
export function getAllInvestor(type) {
  return request({
    url: `/investor?type=${type}`,
    method: "get",
  });
}

export function getProjectList(data) {
  return request({
    url: "/companys",
    method: "post",
    data,
  });
}

export function getProjectDetail(id) {
  return request({
    url: `/company/${id}`,
    method: "get",
    // headers: { "Content-Type": "multipart/form-data;" }
  });
}

export function addOrUpdateProject(data) {
  return request({
    url: "/company",
    method: "put",
    data,
  });
}

export function uploadProjectFile(data) {
  return request({
    url: "/report/forecast",
    method: "post",
    data,
    headers: { "Content-Type": "multipart/form-data;" },
  });
}

export const downLoadProjectDocFileUrl = "/comaccount/record/file/";
// export function downLoadProjectFile(id) {
//   return request({
//     url: `${downLoadProjectFileUrl}/${id}`,
//     method: "get",
//   });
// }

// 获取 项目信息 dialog 中, 项目文档表格数据的接口
export function getProjectDocTableData(data) {
  return request({
    url: "/project/list",
    method: "post",
    data,
  });
}

// 获取 项目信息 dialog 中, 会计科目表格数据的接口
export function getProjectAccountTitle(data) {
  return request({
    url: "/project/list",
    method: "post",
    data,
  });
}

// 获取 项目信息 dialog 中, 权限配置树数据的接口
export function getProjectInfoTreeData(data) {
  return request({
    url: "/project/list",
    method: "post",
    data,
  });
}

// 配置权限
export function saveAccessConfig(data) {
  return request({
    url: "/project/list",
    method: "post",
    data,
  });
}

export function deleteProjectApi(id) {
  return request({
    url: `/project/detail/${id}`,
    method: "delete",
    // params: query
  });
}

// 编辑 会计科目
export function editKuaijikemu(data) {
  return request({
    url: "/project/list",
    method: "post",
    data,
  });
}

// 删除会计科目
export function deleteKuaijikemu(data) {
  return request({
    url: "/project/list",
    method: "post",
    data,
  });
}
