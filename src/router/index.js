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
  //基础路由
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
  //业务路由
  {
    path: '/',
    name: 'index',
    component: () => import(`@/layout/Index`),
    redirect: () => {
      // 否则判Token时间是否失效
      const token = store.getters['token/accessToken'];
      const expiresTime = store.getters['token/expiresTime'];
      let isExpires = new Date().getTime() > expiresTime;
      const groupId = 2;
      if (!token && !token.length && !isExpires) {
        return '/login';
      }
      // 根据组别 ID 进行跳转
      switch (groupId) {
        // 管理员跳去仪表盘
        case 1:
          return '/dashboard';
        // 普通用户跳去首页
        case 2:
          return '/home';
        // 其他都认为未登录，跳去登录页
        default:
          return '/login';
      }
    },
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
          authority: ['admin'],
        },
      },
      //管理员设置中心
      {
        path: '/adminSetting',
        name: 'adminSetting',
        component: () => import(`@/views/adminSetting/index`),
        meta: {
          title: '个人设置',
          isAuth: isAuth,
          keepAlive: keepAlive,
          authority: ['admin'],
        },
      },
      //系统管理
      {
        path: '/baseInfo',
        name: 'baseInfo',
        component: RouteView,
        meta: {
          title: '系统管理',
          isAuth: isAuth,
          authority: ['admin'],
        },
        children: [
          {
            path: 'student',
            name: 'student',
            component: () => import(`@/views/wbaseInfo/student/index`),
            meta: {
              title: '学生管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
              authority: ['admin'],
            },
          },
          {
            path: 'dormitory',
            name: 'dormitory',
            component: () => import(`@/views/wbaseInfo/dormitory/index`),
            meta: {
              title: '宿舍楼管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
              authority: ['admin'],
            },
          },
          {
            path: 'dormitoryRoom',
            name: 'dormitoryRoom',
            component: () => import(`@/views/wbaseInfo/dormitoryRoom/index`),
            meta: {
              title: '宿舍管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
              authority: ['admin'],
            },
          },
        ],
      },
      //通知
      {
        path: '/notice',
        name: 'notice',
        component: () => import(`@/views/notice/index`),
        meta: {
          title: '通知',
          isAuth: false,
          keepAlive: keepAlive,
          authority: ['admin'],
        },
      },
    ],
  },
];
const router = new VueRouter({
  mode: 'hash',
  routes,
});
//全局前置导航守卫（路由跳转前执行）
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '学生宿舍管理系统';
  //判断当前角色是否在允许访问范围之内
  const promise = to.meta.authority.includes(store.getters['user/userInfo'].roleIds);
  if (!promise) {
    next({name: from.name})
  }
  //matched Is Array&&包含了当前路由的所有嵌套路径片段的路由记录。
  //找到了满足条件的元素,return true,循环结束。
  const isAuth = to.matched.some((i) => i.meta.isAuth == true);
  if (isAuth) {
    // 否则判Token和时间是否失效
    const accessToken = store.getters['token/accessToken'];
    const expiresTime = store.getters['token/expiresTime'];
    const isExpires = new Date().getTime() > expiresTime;
    if (isExpires || accessToken == null) {
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
