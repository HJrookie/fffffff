import request from "@/utils/request";

export function editDict(id, data) {
  return request({
    url: `/dict/edit/${id}`,
    method: "post",
    data: data,
  });
}

export function getDictList(data) {
  return request({
    url: "/dict/list",
    method: "post",
    data: data,
  });
}

export function saveDict(data) {
  return request({
    url: "/dict/save",
    method: "post",
    data: data,
  });
}

export function deleteDict(id) {
  return request({
    url: `/dict/delete/${id}`,
    method: "post",
  });
}
export function getRoutes() {
  return request.get("/routes");
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: "/system/dict/data/type/" + dictType,
    method: "get",
  });
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: "/system/config/configKey/" + configKey,
    method: "get",
  });
}

// 查询字典类型列表
export function listType(query) {
  return request({
    url: "/system/dict/type/list",
    method: "get",
    params: query,
  });
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: "/system/dict/type/" + dictId,
    method: "get",
  });
}

// 新增字典类型
export function addType(data) {
  return request({
    url: "/system/dict/type",
    method: "post",
    data: data,
  });
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: "/system/dict/type",
    method: "put",
    data: data,
  });
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: "/system/dict/type/" + dictId,
    method: "delete",
  });
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: "/system/dict/type/refreshCache",
    method: "delete",
  });
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: "/system/dict/type/optionselect",
    method: "get",
  });
}

// 查询字典数据列表
export function listData(query) {
  return request({
    url: "/system/dict/data/list",
    method: "get",
    params: query,
  });
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: "/system/dict/data/" + dictCode,
    method: "get",
  });
}

// 新增字典数据
export function addData(data) {
  return request({
    url: "/system/dict/data",
    method: "post",
    data: data,
  });
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: "/system/dict/data",
    method: "put",
    data: data,
  });
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: "/system/dict/data/" + dictCode,
    method: "delete",
  });
}

export function getRuoDictData(key) {
  return request({
    url: `system/dict/data/type/${key}`,
    method: "get",
  });
}
