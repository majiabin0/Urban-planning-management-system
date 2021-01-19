const typeTemplate = "'${name}' is not a valid ${type}";

export default {
  title: "网站内容管理系统",
  "title.login": "请先登录",
  "title.home": "管理中心",
  "title.discontinue": "请求被中断",
  "title.profile": "个人资料",
  "title.content": "内容管理",
  "title.plugin": "插件管理",
  "title.settings": "站点设置",

  "nav.home": "管理中心",
  "nav.content": "内容管理",
  "nav.member": "成员管理",
  "nav.template": "模板管理",
  "nav.settings": "站点设置",
  "nav.backup": "数据备份",
  "nav.plugin": "插件管理",

  "menu.profile": "个人信息",
  "menu.password": "修改密码",
  "menu.logout": "退出",

  "field.username": "用户名",
  "field.password": "密码",
  "field.verify-code": "验证码",
  "field.type.name": "栏目名称",
  "field.type.target": "目标栏目",

  "upload.limit.type": "只允许上传 {type} 类型的文件",
  "upload.limit.size": "文件大小不能超过{size}",
  "upload.crop.title": "编辑图片",

  filepond: {
    labelIdle:
      '拖放文件，或者 <span class="filepond--label-action"> 点击浏览 </span>',
    labelInvalidField: "字段包含无效文件",
    labelFileWaitingForSize: "计算文件大小",
    labelFileSizeNotAvailable: "文件大小不可用",
    labelFileLoading: "加载",
    labelFileLoadError: "加载错误",
    labelFileProcessing: "上传",
    labelFileProcessingComplete: "已上传",
    labelFileProcessingAborted: "上传已取消",
    labelFileProcessingError: "上传出错",
    labelFileProcessingRevertError: "还原出错",
    labelFileRemoveError: "删除出错",
    labelTapToCancel: "点击取消",
    labelTapToRetry: "点击重试",
    labelTapToUndo: "点击撤消",
    labelButtonRemoveItem: "删除",
    labelButtonAbortItemLoad: "中止",
    labelButtonRetryItemLoad: "重试",
    labelButtonAbortItemProcessing: "取消",
    labelButtonUndoItemProcessing: "撤消",
    labelButtonRetryItemProcessing: "重试",
    labelButtonProcessItem: "上传",
    labelMaxFileSizeExceeded: "文件太大",
    labelMaxFileSize: "最大值: {filesize}",
    labelMaxTotalFileSizeExceeded: "超过最大文件大小",
    labelMaxTotalFileSize: "最大文件大小：{filesize}",
    labelFileTypeNotAllowed: "文件类型无效",
    fileValidateTypeLabelExpectedTypes: "应为 {allButLastType} 或 {lastType}",
    imageValidateSizeLabelFormatError: "不支持图像类型",
    imageValidateSizeLabelImageSizeTooSmall: "图像太小",
    imageValidateSizeLabelImageSizeTooBig: "图像太大",
    imageValidateSizeLabelExpectedMinSize: "最小值: {minWidth} × {minHeight}",
    imageValidateSizeLabelExpectedMaxSize: "最大值: {maxWidth} × {maxHeight}",
    imageValidateSizeLabelImageResolutionTooLow: "分辨率太低",
    imageValidateSizeLabelImageResolutionTooHigh: "分辨率太高",
    imageValidateSizeLabelExpectedMinResolution: "最小分辨率：{minResolution}",
    imageValidateSizeLabelExpectedMaxResolution: "最大分辨率：{maxResolution}"
  },

  "action.login": "登录",
  "action.edit": "编辑",
  "action.edit.type": "编辑栏目",
  "action.edit.acticle": "编辑内容",
  "action.delete": "删除",
  "action.add.type": "添加栏目",
  "action.add.acticle": "添加内容",
  "action.add.subtype": "添加子栏目",
  "action.move.type": "移动栏目",
  "action.move": "移动",

  "tips.login": "为确保功能的完整性，请勿使用IE浏览器登录本系统",
  "tips.login.suggest":
    "推荐使用 Google Chrome、Firefox、Safari、Microsoft Edge 等浏览器。",
  "tips.discontinue": "必要依赖出错，请联络系统管理员",
  "tips.captcha.refresh": "点击重新获取验证码",
  "tips.search.types": "搜索栏目",
  "tips.select.site": "请选择站点",
  "tips.select.type.content": "请先选择要操作的栏目",
  "tips.select.type.target": "选择目标栏目",
  "tips.select.type": "选择栏目",
  "tips.placeholder.type.name": "填写栏目名称",
  "tips.search.article": "输入关键词搜索文章",

  "ask.logout": "确定要退出登录吗？",
  "ask.crop.abort": "确定放弃编辑图片吗？",
  "ask.delete.type": "确定删除栏目吗？",

  help: "获取帮助",
  feedback: "反馈问题",
  tips: "提示",
  save: "保存",
  cancel: "取消",

  validate: {
    default: "Validation error on field '${name}'",
    required: "${label}不能为空",
    enum: "'${name}' must be one of [${enum}]",
    whitespace: "'${name}' cannot be empty",
    date: {
      format: "'${name}' is invalid for format date",
      parse: "'${name}' could not be parsed as date",
      invalid: "'${name}' is invalid date"
    },
    types: {
      string: typeTemplate,
      method: typeTemplate,
      array: typeTemplate,
      object: typeTemplate,
      number: typeTemplate,
      date: typeTemplate,
      boolean: typeTemplate,
      integer: typeTemplate,
      float: typeTemplate,
      regexp: typeTemplate,
      email: typeTemplate,
      url: typeTemplate,
      hex: typeTemplate
    },
    string: {
      len: "'${name}' must be exactly ${len} characters",
      min: "'${name}' must be at least ${min} characters",
      max: "'${name}' cannot be longer than ${max} characters",
      range: "'${name}' must be between ${min} and ${max} characters"
    },
    number: {
      len: "'${name}' must equal ${len}",
      min: "'${name}' cannot be less than ${min}",
      max: "'${name}' cannot be greater than ${max}",
      range: "'${name}' must be between ${min} and ${max}"
    },
    array: {
      len: "'${name}' must be exactly ${len} in length",
      min: "'${name}' cannot be less than ${min} in length",
      max: "'${name}' cannot be greater than ${max} in length",
      range: "'${name}' must be between ${min} and ${max} in length"
    },
    pattern: {
      mismatch: "'${name}' does not match pattern ${pattern}"
    }
  }
};
