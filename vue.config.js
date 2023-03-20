module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    open: true,
    port: 8080, //设置端口
    host: 'localhost',
  },
  transpileDependencies: true,
  lintOnSave: false, //关闭ESlint校验
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '你的标题';
      return args;
    });
  },
};
