import CryptoJS from "crypto-js";
// @ts-ignore
import JSEncrypt from "jsencrypt";

/*
 * 生成随机字符串
 *
 * @param length 生成的字符串长度
 *
 * @return string
 */
export const randomStr = (length: number = 16): string => {
  if (!Number.isFinite(length)) {
    throw new TypeError("Expected a finite number");
  }
  return CryptoJS.lib.WordArray.random(length).toString();
};

/*
 * 使用 RSA 加密
 *
 * @param value 要加密的内容
 * @param key 加密公钥
 *
 * @return string
 */
export const rsaEncrypt = (
  value: string,
  key: string | null = null
): string => {
  if (!key) {
    if (window && window.sessionStorage) {
      // @ts-ignore
      key = window.atob(window.sessionStorage.getItem(SESSION_PUBLICKEY));
    }
  }
  if (key) {
    const jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(key);
    value = jsencrypt.encrypt(value);
  }
  return window.btoa(value);
};

/*
 * 使用 AES 加密
 *
 * @param value 要加密的内容
 * @param key 加密盐
 *
 * @return string
 */
export const aesEncrypt = (value: string, key: string): string => {
  if (key) {
    value = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value),
      CryptoJS.enc.Utf8.parse(key),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
      }
    ).toString();
  }
  return window.btoa(value);
};

/*
 * 扩展字段默认值类型
 */
export const extraDefault = (type: string): any => {
  if (type == "select") {
    return [];
  }
  return "";
};
