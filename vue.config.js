const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭ESlint校验
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '你的标题';
      return args;
    });
  },
});
