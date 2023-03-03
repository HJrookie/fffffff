import request from "@/utils/request";

export function getCompanies(query) {
  return request({
    url: "/user/companies",
    method: "get",
    params: query,
  });
}

// 获取所有创建人
export function getAllCreateHumans(data) {
  return request({
    url: "/user/search",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}

// 获取字典数据
/*
 * audit => 审计机构
 * pim_type  => 财务顾问 PIM 分类
 * unit  ==>   单位
 * */
export function getDictValues(name) {
  return request({
    url: `/dict/${name}`,
    method: "get",
  });
}
