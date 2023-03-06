//babel.config.js 全文内容如下
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  //借助 babel-plugin-component ，引入我们需要的组件，减少项目体积(npm install babel-plugin-component -D)
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};
