import axios from 'axios';
import store from '@/store';
import funs from './funs';
import encrypt from './encrypt';
import { Message } from 'element-ui';
import { createThrottle } from './throttle';
import router from '@/router';
import { baseUrl } from '@/config/defaultString.js';

/**
 * 请求失败后的错误统一处理
 */
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
//#region axios请求方式有五种
// 1、get：多用于获取数据，获取表格数据，获取页面显示数据。
// 2、post：主要用于提交表单数据和上传文件。
// 3、put：对数据全部进行更新，推送后端。
// 4、patch：只对更改过的数据进行更新，推送后端。
// 5、delete：删除数据，参数可以放在url上也可以和post一样放在请求体中。
//#endregion

//创建axios实例
const ajax = new axios.create({
  withCredentials: false, //跨域请求是否允许携带cookie资源凭证
  baseURL: baseUrl,
  time: 1000 * 6, //请求超时时间
});
const unauthorizedHandler = createThrottle(() => {
  const nowRouteName = router.history.current.name;
  if (nowRouteName != 'login') {
    Message.warning('登录失效，请重新登录!');
    router.push({
      name: 'login',
      query: {
        redirectUrl: router.history.current.fullPath,
      },
    });
  }
}, 1000);
//判断是否是开发环境，
//如果是将对传输的参数进行加密操作,返回来的数据进行解密操作
const isEncrypt = (() => {
  return process.env.NODE_ENV == 'development' ? false : true;
})();
//请求拦截器
ajax.interceptors.request.use(
  (config) => {
    // 百度地图 如果url纯在ak字段，修改baseUrl
    if (config.url.indexOf('ak') > -1) {
      config.baseURL = '';
    }
    const access_token = store.getters['token/accessToken'];
    if (access_token && access_token != null) {
      config.headers['Authorization'] = 'Bearer ' + access_token;
    }

    //#region 生产环境加密操作
    // if (isEncrypt) {
    //   config.data = {
    //     ciphertext: encrypt.EncryptData(config.data),
    //   };
    // }
    //#endregion

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
//响应拦截器
ajax.interceptors.response.use(
  (response) => {
    // 后端返回字符串表示需要解密操作
    if (isEncrypt && typeof response.data.data == 'string' && funs.strTrim(response.data.data) !== '') {
      let data = encrypt.DecryptData(response.data.data);
      try {
        response.data.data = JSON.parse(data);
      } catch (e) {
        response.data.data = {};
      }
    } else {
      if (funs.isUndef(response.data.data)) {
        response.data.data = [];
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // 401未登录
      if (error.response.status === 401) {
        unauthorizedHandler();
      } else if (error.response.status === 403) {
        Message.warning('没有权限访问');
      } else if (error.response.status === 404) {
        Message.warning('API Not Found');
      } else if (error.response.status === 400) {
        Message.warning('请求参数错误');
      } else if (error.response.status === 405) {
        Message.warning('Method Not Allowed');
      } else if (error.response.status === 415) {
        Message.warning('不支持的媒体类型');
      } else if (error.response.status === 408) {
        Message.warning('请求超时。服务器等待客户端发送的请求时间过长，超时。');
      } else if (error.response.status === 500) {
        Message.warning('服务器错误');
      } else if (error.response.status === 503) {
        Message.warning('服务器没有准备好处理请求。由于超载或系统维护，服务器暂时的无法处理客户端的请求。');
      }
    }
    return Promise.reject(error.response);
  },
);
export default ajax;
