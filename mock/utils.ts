const NodeRSA = require("node-rsa");
const CryptoJS = require("crypto-js");

export const rsaDecrypt = (data: string): string => {
  const rsa = new NodeRSA(
    "-----BEGIN RSA PRIVATE KEY-----\
    MIICXQIBAAKBgQC4h6JQSdtOJAqhkSXmEZobCjOJV6bEcOrkSg9dbfYVCCDyFWnxJ48H8DBlWapMotAaicnpopBJXevErhbYiZdmEbtco677wXIlhG8ubUsFHXu1aZEw9NDi1RD/eVSPP9OOJSFeZdrJNGv6h6DFLtQasW2gHcIx/2CrxbDoOuU9ZwIDAQABAoGAZK30HFQ/qGG3vzE/eUiPSUOGnN/K6JEnR4k02uf9BLqbpxmR5PaNbmpZLWL/rLKEUoZtOODuUmlBEt1dL6XaiPPKQiBhJNA5U+0DnLZq+Rh8fccXHzRr5Wdd/NZubLkZzODE+hiY9Z0VBWr6I2ZhmsSaqnfkCxukdoRMsDokeUkCQQDf95phIVntPHxl+1C7GE5cEeKx20yn75t9dKJRZTb1rjsFfi8o4L6xO7biXDi4DOu847I2/xttBSPyI8oF9xNFAkEA0uwPVXsaJdcrVupMo3WFpx6lqpEGlxKQxH0cigDG6drS4TGhMNr7XrTnT3GQhQhPzvLZr7PLrdh/VkRLq58iuwJBAN85wj0dKKwzpSlgG07fIvrROMlcckLPpoKcRUwrPWQRi/Ilmot7tZSgl991W3LWLf/OUkpOad93SCSHV0wqvqECQBAVCbJF2Z+LAXX2FXPdMRyl/JG9zxfTxZAFzhhDqOcJ1UxwYU79U29MMdrf2Nob4SHxaGG6Psx5lnP4byCd2KMCQQDPuetf8T8vr05cd/e9rM/M9OLGGSZarOuE0XXRsJsaxH+Kx40WzmxVWgrB0uEnwiw1m3Ieo2KjvrzbFyWLRxO/\
    -----END RSA PRIVATE KEY-----\
    "
  );
  rsa.setOptions({ encryptionScheme: "pkcs1" });
  return rsa.decrypt(new Buffer(data, "base64").toString(), "utf8");
};

export const aesDecrypt = (value: string, key: string): string => {
  if (key) {
    return CryptoJS.AES.decrypt(
      new Buffer(value, "base64").toString(),
      CryptoJS.enc.Utf8.parse(key),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
      }
    ).toString(CryptoJS.enc.Utf8);
  }
  return value;
};

export const respond = (data: any, code: number = 200) => {
  let message = "";
  switch (code) {
    case 401:
      message = "未登录或登录已过期";
      break;
    case 403:
      message = "无权访问请求的资源";
      break;
    case 404:
      message = "请求的资源不存在";
      break;
    case 422:
      message = "请求参数有误";
      break;
    case 500:
    default:
      message = "服务器内部错误";
  }
  return {
    success: code === 200 ? true : false,
    code: code,
    message: code === 200 ? "成功" : message,
    data: code === 200 ? data : null,
    fields: code !== 200 ? data : null
  };
};
