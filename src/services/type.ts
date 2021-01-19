import { request } from "umi";

export function getTypes({ siteId }: any) {
  return request(`/articleType/all?siteId=${siteId}`);
}

export function getDetail({ id }: any) {
  return request(`/articleType/detail`, {
    method: "post",
    data: {
      id
    }
  });
}

export function deleteType({ id }: any) {
  return request(`/articleType/delete`, {
    method: "post",
    data: {
      id
    }
  });
}

export function updateType({ id, data }: any) {
  return request(`/articleType/update`, {
    method: "post",
    data: {
      id,
      ...data
    }
  });
}

export function addType({ name, data }: any) {
  return request(`/articleType/add`, {
    method: "post",
    data: {
      name,
      ...data
    }
  });
}
