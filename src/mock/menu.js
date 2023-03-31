/*
 * @LastEditTime: 2023-03-30 16:11:43
 * @Descripttion: 
 */
import Mock from 'mockjs';
export default {
  getMenuList: () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          path: '/',
          name: 'home',
          label: '首页',
          icon: 'el-icon-s-home',
          authority:['admin'],
        },
        {
          label: '系统管理',
          icon: 'el-icon-setting',
          authority:['admin'],
          children: [
            {
              path: '/system/user',
              name: 'user',
              label: '用户管理',
              icon: 'el-icon-user-solid',
            },
            {
              path: '/system/role',
              name: 'role',
              label: '角色管理',
              icon: 'el-icon-s-custom',
            },
            {
              path: '/system/department',
              name: 'department',
              label: '部门管理',
              icon: 'el-icon-menu',
            },
            {
              path: '/system/dictionary',
              name: 'dictionary',
              label: '字典管理',
              icon: 'el-icon-notebook-1',
            },
          ],
        },
        {
          path: '/workAttendance',
          name: 'workAttendance',
          label: '考勤管理',
          icon: 'el-icon-s-operation',
          authority:['admin'],
        },
        {
          path: '/examine',
          name: 'examine',
          label: '考核管理',
          icon: 'el-icon-s-operation',
          authority:['admin'],
        },
        {
          label: '日志管理',
          icon: 'el-icon-time',
          authority:['admin'],
          children: [
            {
              path: '/logs/systemLog',
              name: 'systemLog',
              label: '系统日志',
              icon: 'el-icon-coin',
            },
            {
              path: '/logs/operateLog',
              name: 'operateLog',
              label: '操作日志',
              icon: 'el-icon-coin',
            },
          ],
        },
        {
          path: '/message',
          name: 'message',
          label: '消息通知',
          icon: 'el-icon-chat-dot-square',
          authority:['admin'],
        },
        {
          path: '/clockIn',
          name: 'clockIn',
          label: '今日打卡',
          icon: 'el-icon-place',
          authority:['employee'],
        },
      ],
    };
  },
};
