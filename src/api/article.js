import { $http } from "../utils/axios";

export function fetchList(query) {
  return $http.get("/article/list", query);
}

export function fetchArticle(id) {
  return $http.get("/article/detail", { id });
}

export function fetchPv(pv) {
  return $http.get("/article/pv", { pv });
}

export function createArticle(data) {
  return $http.post("/article/create", data);
}

export function updateArticle(data) {
  return $http.post("/article/update", data);
}
