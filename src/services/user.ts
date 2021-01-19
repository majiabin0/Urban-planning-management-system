import { request } from "umi";

export function saveProfile(data: any) {
  return request(`/saveProfile`, {
    method: "post",
    data
  });
}
