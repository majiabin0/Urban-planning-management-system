import Cookies from "js-cookie";
import { history, RequestConfig, ErrorShowType } from "umi";
import * as services from "@/services/app";
import { randomStr, rsaEncrypt } from "@/utils";
import figlet from "figlet";
// @ts-ignore
import SmallSlant from "figlet/importable-fonts/Small Slant.js";

const onlyGuestAccess: string[] = ["/login"];

const discontinueFunc = (discontinue: any) => {
  if (discontinue) {
    if (history.location.pathname !== "/discontinue") {
      history.replace("/discontinue");
    }
  } else {
    if (history.location.pathname === "/discontinue") {
      history.replace("/");
    }
  }
};

// @ts-ignore
figlet.parseFont("Small Slant", SmallSlant);

figlet.text(
  "Mooween Inc.",
  {
    font: "Small Slant"
  },
  (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(
      `\n${result}\n\n%c  %c%cPowered by Mooween%c\n\n`,
      "line-height:0;padding:1em;font-size:12px;border-radius:2px;border-top-right-radius:0;border-bottom-right-radius:0;background-color:#e04c40;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAllBMVEUAAAD//////v7//////////////v7/////+/v//////////////v7//////////////////////////v7//v7//Pz//////f3//////////////f3//////v7//f3//////v7/////+/v/////+/r98vL98fD98fH//f398fD97+7////++fn87ez76un98fH85uX99fQ+ilzDAAAAK3RSTlMA9wYO8HMj6aCsleJI2cscW9GBYRU7wGy6s6ZQNTB9iSqOV8VD8OG5Zs6Rye8VoQAABLlJREFUaN7tmtt6ojAUhQlyVKHW86mOTltru8HD+7/cFApGMBuyYGau/Pm0NynLBMifbDUePHjw4F+xXriCiETPG+s07wyWgSDhzu2ndrE9kkxro82NRTnCd5rnelRAjKqbb4Ni81nT3FcqM6xqPrGoRLdZ7oLuOVT01yLmg4KMSIFg7xkzIAV9PNcUpCLk2m9IRWDCwUNS4zDPkUVKBnCwywT73IVRM0Vzn4jBUrf3iQGdSDZE0Fj3iOEABofEYStvReJYYLkdQRyvyvbEITpQ8IqwM5nEsmowSwNPiEscHjR7pOdBHqg5cbjIHDKhCizVmWximQDBv6iKvkoRxPILCA6oii72L4F+7pYqcQ0FO2LZagfbVM0auy1scOnBM8QehFfd3DHV8Aw++mNw7cHjYJPdCFxs8djY9L4AFz08U+zzChMTBCiKQ4UoMEGAoniilqJwqR4fWzy4kCBgUWwAUQCCaCcKRBD/WRQOadEDReGAguB5AUWBCAIXhdVcFGNBElgUS+IQY1gQyN7kd3NR+KTLDBQFKAie+V8VRZ80wUXRBwTxH0XhAsFLUBStBdFeFLggokt8PB7jU8RetZdmogiqY4/nKydOFL06UeCCiM+3HCNcFM0EcTyXuChF8dZEFFPiOd8TgaKYNhFErAg+hqgocEFEZxUxKgpcEEdFf78BReHDgojKoRkfWDlEmKgg4mKqRCWKGSqKLrHcpeZ/f2Oi6IKCiEp9lZ32/oIo1sSyl6nnJFXyDopijQniS3a1SBy/tRfFM3H0nKOKOOELE8UzJIiu8alKTdmDt6mDCOLN+CqnSlqLYlq10piUUyWblqLoiMq11V6GlvgERVGecgbEkkwSnkwtgYpiwAiC+Yz9mKWdKEyresdgvnO5J1AUlqkriJ8efahTv4lbiaJbtyscKVIzUFFoCiLMlkXlVEkbUazrd/6f96FxepyUohjqiWJYX+uws1SZeQUUxVBPEHkTJ0vNXregotAURM4+iylHXy7NRWHr3Pxfcogll5QttoKz9QSRM0li71JP38cFFQU4wb0XQvPUBKUo/HpRDPSmdO829ZQeOQVR6J/V15PYqpB6S3QARaEjCIkZq1O/gUWhIwjJhzL1khyoKHQEIRld82TqJUpZgaLAFqPjQmja1/zdM7AFMzCrJnzKVDnKUQIqihcdj0hseVnz1JxcFIDzQv3y/zYb4Tz5hh0oCnBTuU8z06NEAIriCdtG/5L9LQOKYmb4SK1yIiPLzDBR+EYPKpW8M7FEHiaKniGgerSnTiVBcwMShTCwCvxKlRpRlEgWE4UhoAKgeVGlRuyXHVO+xwFW8vwopGahyVB3sbJsYHhYkfdQDBVJZpo+wgrRHrujDLlCa55K4qbLgiuQhuze13Sxgucyj00zr133scKsa3KXoWcaal6SIPlK8jPdKDF77A1kPmO/Y+j+REY/bxk77DcWz2m3HMXEtjNYzNe0owVCZnyYLyksJ/OmBX0rNg6zgZa5Y+jbO+vqeac42sI2KuksqcCyU93eFsVxdm6Gz765txeOUUc/vDnPqra5s5DNXdssXrn8V/cbx9BhsgtdIivsvmk1dzZzV5AIlgPTePDgwYOW/AHj0HstVmLEhQAAAABJRU5ErkJggg==);background-repeat:no-repeat;background-position:center center;background-size:14px 14px;",
      "",
      "background-color:#3e556c;border-left:1px solid #324456;color:#fff;line-height:0;font-size:12px;padding:1em;border-radius:2px;border-top-left-radius:0;border-bottom-left-radius:0;",
      ""
    );
    console.log(
      `\n💬 %cFor business negotiations → %o\n`,
      "color: #3770f0",
      "https://mooween.com"
    );
  }
);

export const request: RequestConfig = {
  errorConfig: {
    adaptor: (resData, context) => {
      const { success, message, code, data } = resData;
      let errorMessage = message;
      let showType = ErrorShowType.SILENT;
      if (
        code !== 200 ||
        (context.res instanceof Response &&
          context.res.status &&
          context.res.status !== 200)
      ) {
        showType = ErrorShowType.ERROR_MESSAGE;
        errorMessage = context.res.statusText
          ? context.res.statusText
          : errorMessage;
      }
      if (code === 401) {
        // @ts-ignore
        Cookies.remove(COOKIE_TOKEN);
        window && window.sessionStorage && window.sessionStorage.clear();
        window && window.localStorage && window.localStorage.clear();
        setTimeout(() => {
          window && window.location.reload();
        }, 800);
      }
      if (errorMessage == "" || !errorMessage) {
        showType = ErrorShowType.SILENT;
      }
      return {
        data: data,
        success,
        errorMessage,
        showType
      };
    }
  },
  prefix: "/api",
  requestInterceptors: [
    // @ts-ignore
    (url, options) => {
      if (options.data || options.body) {
        let formdata = new FormData();
        if (options.body instanceof FormData) {
          formdata = options.body;
        }
        if (
          options.body &&
          !(options.body instanceof FormData) &&
          typeof options.body === "object"
        ) {
          for (let key in options.body) {
            // @ts-ignore
            formdata.append(key, options.body[key]);
          }
        }
        if (options.data && typeof options.data === "object") {
          for (let key in options.data) {
            // @ts-ignore
            formdata.append(key, options.data[key]);
          }
          delete options.data;
        }
        options.body = formdata;
      }
      return {
        url,
        options: {
          ...options,
          headers: {
            // @ts-ignore
            Authorization: Cookies.get(COOKIE_TOKEN)
              ? // @ts-ignore
                Cookies.get(COOKIE_TOKEN)
              : "",
            // @ts-ignore
            "X-AES-KEY": window.sessionStorage.getItem(SESSION_AESKEY)
              ? // @ts-ignore
                window.sessionStorage.getItem(SESSION_AESKEY)
              : "",
            // @ts-ignore
            "X-CLIENT-ID": window.sessionStorage.getItem(SESSION_CLIENTID)
              ? // @ts-ignore
                window.sessionStorage.getItem(SESSION_CLIENTID)
              : ""
          }
        }
      };
    }
  ]
  // responseInterceptors: [
  //   // @ts-ignore
  //   async response => {
  //     const data = await response.clone().json();
  //     return response;
  //   }
  // ]
};

export const render = (render: any) => {
  // @ts-ignore
  const token = Cookies.get(COOKIE_TOKEN);
  if (!token) {
    if (onlyGuestAccess.indexOf(history.location.pathname) === -1) {
      // if (
      //   window &&
      //   window.sessionStorage &&
      //   history.location.pathname !== "/discontinue"
      // ) {
      //   window.sessionStorage.setItem(
      //     // @ts-ignore
      //     SESSION_LOCATION,
      //     history.location.pathname
      //   );
      // }
      history.replace("/login");
    }
  } else {
    if (onlyGuestAccess.indexOf(history.location.pathname) !== -1) {
      history.replace("/");
    }
  }
  render();
};

export const getInitialState = async () => {
  let data: {
    keys:
      | {
          [key: string]: string;
        }
      | undefined;
    cdn: string | undefined;
    me: {} | undefined;
  } = {
    keys: undefined,
    cdn: undefined,
    me: undefined
  };
  try {
    // @ts-ignore
    let publicKey = window.sessionStorage.getItem(SESSION_PUBLICKEY);
    // @ts-ignore
    let cdn = window.sessionStorage.getItem(SESSION_CDN);

    // 如果直接跨域无法传递 JSESSIONID 时使用此段注释的模式
    // @ts-ignore
    // const CLIENTID = window.sessionStorage.getItem(SESSION_CLIENTID);
    // @ts-ignore
    // const JSESSIONID = Cookies.get(COOKIE_SESSION)
    // if (!publicKey || (!JSESSIONID && !CLIENTID)) {

    if (!publicKey) {
      const { data } = await services.getKeys();
      const { key, clientId, baseUrl } = data;
      publicKey = key;
      cdn = baseUrl;
      if (window && window.sessionStorage) {
        if (publicKey) {
          // @ts-ignore
          window.sessionStorage.setItem(SESSION_PUBLICKEY, publicKey);
        }
        if (clientId) {
          // @ts-ignore
          window.sessionStorage.setItem(SESSION_CLIENTID, clientId);
        }
        if (baseUrl) {
          // @ts-ignore
          window.sessionStorage.setItem(SESSION_CDN, baseUrl);
        }
      }
    }
    if (publicKey) {
      data.keys = {
        public: window.atob(publicKey),
        aes: randomStr()
      };
      if (window && window.sessionStorage) {
        window.sessionStorage.setItem(
          // @ts-ignore
          SESSION_AESKEY,
          rsaEncrypt(data.keys.aes)
        );
      }
    }
    if (cdn) {
      data.cdn = cdn;
    }
    discontinueFunc(!data.keys);
  } catch (e) {
    discontinueFunc(true);
  }
  // @ts-ignore
  const token = Cookies.get(COOKIE_TOKEN);
  if (token) {
    try {
      const { data } = await services.getMe();
      const { username, name, avatar, roles, permissions } = data.admin;
      if (username) {
        data.me = {
          username,
          name: name ? name : username,
          avatar: avatar ? avatar : "",
          roles: roles ? roles : [],
          permissions: permissions ? permissions : []
        };
      }
      discontinueFunc(!data.me);
    } catch (e) {
      if (onlyGuestAccess.indexOf(history.location.pathname) === -1) {
        // @ts-ignore
        Cookies.remove(COOKIE_TOKEN);
        window && window.sessionStorage && window.sessionStorage.clear();
        window && window.localStorage && window.localStorage.clear();
        setTimeout(() => {
          window && window.location.reload();
        }, 800);
      }
    }
  }
  return data;
};
