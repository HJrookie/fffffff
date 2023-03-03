import request from "@/utils/request";

export function getSystemList(query) {
  return request({
    url: "/system/names",
    method: "get",
    params: query,
  });
}

export function editSystem(query) {
  return request({
    url: "/system/list",
    method: "get",
    params: query,
  });
}

export function deleteSystem(id) {
  return request({
    url: `/compass/project/detail/${id}`,
    method: "get",
    // params: query
  });
}
