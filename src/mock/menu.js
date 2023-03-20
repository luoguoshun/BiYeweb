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
        },
        {
          label: '系统管理',
          icon: 'el-icon-setting',
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
              path: '/system/dictioanary',
              name: 'dictioanary',
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
        },
        {
          path: '/examine',
          name: 'examine',
          label: '考核管理',
          icon: 'el-icon-s-operation',
        },
        {
          label: '日志管理',
          icon: 'el-icon-time',
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
      ],
    };
  },
};
