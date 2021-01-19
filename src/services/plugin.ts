import { request } from "umi";

export function searchPlugin(where: {}) {
  return request("/plugin/search", {
    method: "post",
    data: { ...where }
  });
}

export function pluginUpdate({ id, data }: any) {
  return request(`/plugin/update`, {
    method: "post",
    data: {
      id,
      ...data
    }
  });
}
