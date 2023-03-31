/*
 * @LastEditTime: 2023-03-31 12:05:36
 * @Descripttion: 入口文件
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store';
import './mock/index'; //引入mock.js假数据
import apis from './apis/index';
import 'element-ui/lib/theme-chalk/index.css';
import './config/elementui.js';
import BaiduMap from 'vue-baidu-map';
import { serverAK } from '@/config/defaultString.js';
import connectionBuilder from './utils/signalR';
import * as timeFormat from './utils/timeFormat.js';
Vue.config.productionTip = false;
//#region Object.defineProperty
// Object.defineproperty（obj, propname, desc  ） 直接在一个对象上定义一个新属性，或者修改一个已经存在的属性
// * @param : object :需要定义属性的当前对象
// * @param : propname :当前需要定义的属性名
// * @param : object :描述符 一般是一个对象
//#endregion
Object.defineProperty(Vue.prototype, '$api', {
  value: apis,
});
Object.defineProperty(Vue.prototype, '$signalR', {
  value: connectionBuilder,
});
Object.defineProperty(Vue.prototype, '$timeFormat', {
  value: timeFormat,
});
//全局注册百度地图
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: serverAK, //访问appKey
});
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app');
