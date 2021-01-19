import { request } from "umi";

export function getSites() {
  return request(`/site/all`);
}

export function searchSites(where: {}) {
  return request("/site/search", {
    method: "post",
    data: { ...where }
  });
}

export function getDetail({ id }: any) {
  return request(`/site/detail`, {
    method: "post",
    data: {
      id
    }
  });
}

export function siteUpdate({ id, data }: any) {
  return request(`/site/update`, {
    method: "post",
    data: {
      id,
      ...data
    }
  });
}
