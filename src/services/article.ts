import { request } from "umi";

export function getArticles(where: {}) {
  return request(`/article/search`, {
    method: "post",
    data: { ...where }
  });
}

export function getDetail({ id }: any) {
  return request(`/article/detail`, {
    method: "post",
    data: {
      id
    }
  });
}

export function addArticle(data: {}) {
  return request(`/article/add`, {
    method: "post",
    data
  });
}

export function updateArticle(data: {}) {
  return request(`/article/update`, {
    method: "post",
    data
  });
}

export function deleteArticle({ id }: any) {
  return request(`/article/delete`, {
    method: "post",
    data: {
      id
    }
  });
}

export function publishArticle({ id }: any) {
  return request(`/article/publish`, {
    method: "post",
    data: {
      id
    }
  });
}

export function unPublishArticle({ id }: any) {
  return request(`/article/withdrew `, {
    method: "post",
    data: {
      id
    }
  });
}
