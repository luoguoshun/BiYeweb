import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import "./mock/index";//引入mock.js假数据
import apis from "./apis/index";
import "element-ui/lib/theme-chalk/index.css";
import "./config/elementui.js";

Vue.config.productionTip = false;

/** 
 * @description  : Object.defineproperty（obj, propname, desc  ） 直接在一个对象上定义一个新属性，或者修改一个已经存在的属性
 * @param : object :需要定义属性的当前对象
 * @param : propname :当前需要定义的属性名
 * @param : object :描述符 一般是一个对象
 **/
Object.defineProperty(Vue.prototype, "$api", {
  value: apis,
});

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
