import { request } from "umi";

export function upload(options: any) {
  return request(`/upload`, options);
}
