import { request } from "umi";

export function getKeys() {
  return request(`/keys`, {
    method: "get"
  });
}

export function getMe() {
  return request(`/me`);
}
