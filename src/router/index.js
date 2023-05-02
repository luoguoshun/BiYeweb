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
const isAuth = true; //是否需要认证
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
      debugger
      const groupId = 2;
      if (!token && !token.length && isExpires) {
        return '/login';
      }
      // 根据组别 ID 进行跳转
      switch (groupId) {
        // 管理员跳去仪表盘
        case 1:
          return '/home';
        // 普通用户跳去首页
        case 2:
          return '/home';
        // 其他都认为未登录，跳去登录页
        default:
          return '/home';
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
        },
      },
      {
        path: '/userSetting',
        name: 'userSetting',
        component: () => import(`@/views/userSetting/index`),
        meta: {
          title: '个人设置',
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
            path: 'user',
            name: 'user',
            component: () => import(`@/views/system//user/index`),
            meta: {
              title: '员工管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
            },
          },
          {
            path: 'role',
            name: 'role',
            component: () => import(`@/views/system/role/index`),
            meta: {
              title: '角色管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
            },
          },
          {
            path: 'department',
            name: 'department',
            component: () => import(`@/views/system/department/index`),
            meta: {
              title: '部门管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
            },
          },
          {
            path: 'dictionary',
            name: 'dictionary',
            component: () => import(`@/views/system/dictionary/index`),
            meta: {
              title: '字典管理',
              isAuth: isAuth,
              keepAlive: keepAlive,
            },
          },
        ],
      },
      //考核管理
      {
        path: '/examine',
        name: 'examine',
        meta: {
          title: '考勤管理',
          isAuth: isAuth,
        },
        component: () => import(`@/views/examine`),
      },
      //考勤管理
      {
        path: '/workAttendance',
        name: 'workAttendance',
        meta: {
          title: '考勤管理',
          isAuth: isAuth,
        },
        component: () => import(`@/views/workAttendance`),
      },
      //日志管理
      {
        path: '/logs',
        name: 'logs',
        component: RouteView,
        meta: {
          title: '日志管理',
          isAuth: isAuth,
        },
        children: [
          {
            path: 'operateLog',
            name: 'operateLog',
            component: () => import('@/views/logs/operateLog'),
            meta: {
              title: '操作日志',
              isAuth: isAuth,
            },
          },
          {
            path: 'systemLog',
            name: 'systemLog',
            component: () => import('@/views/logs/systemLog'),
            meta: {
              title: '系统日志',
              isAuth: isAuth,
            },
          },
        ],
      },
      //消息通知
      {
        path: '/message',
        name: 'message',
        component: () => import(`@/views/message/index`),
        meta: {
          title: '首页',
          isAuth: isAuth,
          keepAlive: keepAlive,
        },
      },
       //打卡
       {
        path: '/clockIn',
        name: 'clockIn',
        component: () => import(`@/views/clockIn/index`),
        meta: {
          title: '打卡',
          isAuth: isAuth,
          keepAlive: keepAlive,
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
  document.title = to.meta.title || '绩效考核系统';
  
  // 路由对象的matched属性是一个数组，包含了当前路由的所有嵌套路径片段的路由记录。
  //  找到了满足条件的元素,return true,循环结束。如果所有元素全部遍历还是没找到, 最终结果为false
  const isAuth = to.matched.some((i) => i.meta.isAuth == true);
  if (isAuth) {
    // 否则判Token时间是否失效
    const accessToken = store.getters['token/accessToken'];
    const expiresTime = store.getters['token/expiresTime'];
    let isExpires = new Date().getTime() > expiresTime;
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
