import define from "./define";

export default {
  "ant-prefix": define.ANT_PREFIX,

  "iconfont-css-prefix": "anticon",

  "primary-color": "#5e69e6",

  "text-color": "fade(#292c2f, 80%)",

  "font-size-base": "14px",
  "font-size-lg": "@font-size-base",
  "font-size-sm": "12px",

  "height-base": "32px",
  "height-lg": "40px",
  "height-sm": "24px",

  "padding-lg": "24px",
  "padding-md": "16px",
  "padding-sm": "12px",
  "padding-xs": "8px",
  "padding-xss": "4px",

  "component-background": "#fff",

  "btn-prefix-cls": "~'@{ant-prefix}-btn'",
  "btn-text-hover-bg": "rgba(0, 0, 0, 0.05)",

  "avatar-prefix-cls": "~'@{ant-prefix}-avatar'",

  "input-prefix-cls": "~'@{ant-prefix}-input'",
  "input-font-size-lg": "@font-size-base",
  "input-height-lg": "@height-lg",
  "input-affix-margin": "8px",

  "form-prefix-cls": "~'@{ant-prefix}-form'",
  "form-item-prefix-cls": "~'@{form-prefix-cls}-item'",
  "form-item-margin-bottom": "30px",

  "dropdown-line-height": "30px",

  "control-padding-horizontal": "15px",

  "layout-logo-color": "#fff",
  "layout-body-background": "#fff",
  "layout-header-height": `${define.LAYOUT_HEADER_HEIGHT}px`,
  "layout-header-padding": "0 24px",
  "layout-header-background": "#fff",
  "layout-footer-padding": "6px 24px",
  "layout-sider-width": `${define.LAYOUT_SIDER_WIDTH}px`,
  "layout-sider-width-min": `${define.LAYOUT_SIDER_WIDTH_MIN}px`,
  "layout-sider-background": "#fff",
  "layout-sider-background-light": "@layout-sider-background",
  "layout-sider-background-dark":
    "linear-gradient(to top, #7178ce 20%, #3f458e 95%)",

  "login-body-background": "#7178ce",
  "login-body-mask": "linear-gradient(180deg, rgba(#222,0), #222 95%)",
  "login-body-light":
    "radial-gradient(1280px 600px at 49% 100%, #4e566c 20%, rgba(#4e566c, 0) 96%)",
  "login-box-background": "@component-background",
  "login-color": "@component-background",

  "upload-prefix-cls": "~'@{ant-prefix}-upload'",

  "menu-prefix-cls": "~'@{ant-prefix}-menu'",
  "menu-item-vertical-margin": "4px",
  "menu-item-boundary-margin": "0",
  "menu-bg": "@component-background",
  "menu-popup-bg": "@component-background",

  "font-family":
    "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\
                  'Noto Sans SC', 'Noto Sans', 'Microsoft Yahei', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\
                  'Noto Color Emoji'",

  "code-family":
    "'PTMono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",

  "shadow-1-down":
    "0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03)",

  "nav-height": "56px",
  "nav-group-title-color": "rgba(255, 255, 255, .5)",
  "nav-submenu-arrow-color":
    "linear-gradient(to right, rgba(255, 255, 255, .8), rgba(255, 255, 255, .8))",
  "nav-color": "#d4d5e8",
  "nav-hover-color": "#fff",
  "nav-hover-background": "rgba(0, 0, 0, .15)",
  "nav-selected-color": "#fff",
  "nav-selected-shadow": "0 0 15px rgba(#77f3d2, .25)",
  "nav-selected-background": "rgba(0, 0, 0, .35)",
  "nav-selected-after-shadow": "0 0 5px #77f3d2, 3px 0 23px rgba(#77f3d2, .75)",
  "nav-selected-after-background":
    "linear-gradient(to bottom, #77f3d2, #5fafee)",

  "loading-background": "#fff",
  "loading-color": "@primary-color",
  "loading-shadow": "0 5px 10px rgba(0, 0, 0, .15)",

  "modal-header-padding-vertical": "@padding-md",
  "modal-header-padding-horizontal": "@padding-lg",
  "modal-header-padding":
    "@modal-header-padding-vertical @modal-header-padding-horizontal",
  "modal-confirm-body-padding": "@padding-lg",
  "modal-footer-padding-vertical": "@modal-header-padding-vertical",
  "modal-footer-padding-horizontal": "@modal-header-padding-horizontal",

  "dialog-prefix-cls": "~'@{ant-prefix}-modal'",

  "confirm-prefix-cls": "~'@{ant-prefix}-modal-confirm'",

  "message-prefix-cls": "~'@{ant-prefix}-message'",

  "editor-background": "#f8f8f8",

  "tree-prefix-cls": "~'@{ant-prefix}-tree'",
  "tree-bg": "transparent",

  "table-prefix-cls": "~'@{ant-prefix}-table'",

  "tabs-prefix-cls": "~'@{ant-prefix}-tabs'",

  "pagination-prefix-cls": "~'@{ant-prefix}-pagination'"
};
