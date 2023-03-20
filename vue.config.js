/*
 * @LastEditTime: 2023-03-20 17:05:33
 * @Descripttion:
 */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    open: true,
    port: 8080, //设置端口
    host: 'localhost',
    proxy: {
      // // 本地代理环境配置
      '/baidu': {
        target: 'https://api.map.baidu.com',
        ws: true,
        changOrigin: true, //允许跨域
        pathRewrite: {
          '^/baidu': '', //请求的时候使用这个/baidu 就可以
        },
      },
    }, //指向开发环境 API 服务器
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
