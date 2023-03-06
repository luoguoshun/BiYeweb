import zhLocale from "element-ui/lib/locale/lang/zh-CN"; //引入element语言包
//需要转换的中文
const cn = {
  message: {
    info: {
      userinfo: "用户信息",
    },
    table: {
      item_number: "项目编号",
    },
  },
  ...zhLocale,
};

export default cn;
