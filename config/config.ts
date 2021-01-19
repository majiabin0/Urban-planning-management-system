import path from "path";
import { defineConfig } from "umi";

import theme from "./theme";
import define from "./define";

export default defineConfig({
  mock: {
    exclude: [
      "mock/utils.ts",
      "mock/keys.ts",
      "mock/me.ts",
      "mock/auth.ts",
      "mock/upload.ts",
      "mock/site.ts",
      "mock/type.ts"
    ]
  },
  // 部署时请使用 Nginx 或 Apache 等实现 Proxy 功能
  proxy: {
    "/api": {
      target: "http://zqzmp.free.idcfengye.com/api/",
      // target: "https://cucd-server.goapps.run/api/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  },
  request: {
    dataField: "data"
  },
  theme,
  define,
  locale: {
    default: "zh-CN",
    antd: true,
    title: true,
    baseNavigator: false
  },
  antd: {
    dark: false,
    compact: false,
    config: {
      prefixCls: define.ANT_PREFIX
    }
  },
  dynamicImport: {
    loading: "@/components/Loading"
  },
  dva: {
    immer: true,
    hmr: false
  },
  title: false,
  hash: true,
  ignoreMomentLocale: true,
  chunks: ["mooween"],
  plugins: [
    path.join(__dirname, "../plugin/rename"),
    path.join(__dirname, "../plugin/nanoHTML")
  ],
  chainWebpack(memo) {
    memo.module
      .rule("media")
      .test(/.mp(3|4)$/)
      .use("url-loader")
      .loader("url-loader");
    memo.module
      .rule("otf")
      .test(/.otf$/)
      .use("file-loader")
      .loader("file-loader");
  }
});
