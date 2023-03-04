import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { Message } from 'element-ui';
import RouteView from '@/layout/RouteView';
Vue.use(VueRouter);
// 再次点击当前路由时判断
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
const isAuth = false; //是否需要认证
const keepAlive = true; //保持组件状态
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(`@/views/login`), //路由懒加载 返回一个promise()
  },
  {
    path: '*',
    name: 'notfound',
    component: () => import('@/views/errors/404'),
  },
  {
    path: '/',
    name: 'index',
    component: () => import(`@/layout/Index`),
    meta: {
      title: '',
      isAuth: isAuth,
    },
    children: [
      //首页
      {
        path: '/home',
        name: 'home',
        component: () => import(`@/views/home/index`),
        meta: {
          title: '首页',
          isAuth: isAuth,
          keepAlive: keepAlive,
        },
      },
      //系统管理
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        meta: {
          title: '系统管理',
          isAuth: isAuth,
        },
        children: [
          {
            path: '/system/user',
            name: 'user',
            component: () => import(`@/views/system//user/index`),
            meta: {
              title: '员工管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
            },
          },
          {
            path: '/system/role',
            name: 'role',
            component: () => import(`@/views/system/role/index`),
            meta: {
              title: '角色管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
            },
          },
        ],
      },
    ],
  },
];
const router = new VueRouter({
  mode: 'hash',
  routes,
});
//全局前置守卫（路由跳转前执行）
router.beforeEach(async (to, from, next) => {
  // 路由对象的matched属性是一个数组，包含了当前路由的所有嵌套路径片段的路由记录。
  // 只需要给较高一级的路由添加isAuth即可，其下的所有子路由不必添加。
  //  找到了满足条件的元素,return true,循环结束。如果所有元素全部遍历还是没找到, 最终结果为false
  const isAuth = to.matched.some((i) => i.meta.isAuth == true);
  if (isAuth) {
    // 否则判Token时间是否失效
    const accessToken = store.getters['token/accessToken'];
    const expiresTime = store.getters['token/expiresTime'];
    let isExpires = new Date().getTime() > expiresTime;
    if (accessToken == null || isExpires) {
      Message.warning('凭证过期，请重新登录!');
      next({
        name: 'login',
        query: {
          redirectUrl: to.fullPath,
        },
      });
    } else {
      next();
    }
  }
  next();
});
export default router;
