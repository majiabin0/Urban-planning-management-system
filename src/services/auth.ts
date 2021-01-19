import { request } from "umi";

export function getCaptcha() {
  return request(`/captcha`);
}

export function signin({ username, password, code }: any) {
  return request(`/signin`, {
    method: "post",
    data: {
      username,
      password,
      code
    }
  });
}

export function signout() {
  return request(`/signout`, {
    method: "post"
  });
}
