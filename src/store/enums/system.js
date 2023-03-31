/*
 * @LastEditTime: 2023-03-31 10:49:44
 * @Descripttion: 
 */
export const gradeData = [
  {
    level: 'A',
    score: '4',
    description:
      '超额完成工作目标或为公司创造出超值价值，有杰出的工作表现和优良的工作质量，工作绩效始终超越本职位常规标准要求',
  },
  {
    level: 'B',
    score: '3',
    description: '基本完成工作目标，工作表现和工作质量基本符合岗位的期望要求，工作绩效能达到本职位常规标准要求。',
  },
  {
    level: 'C',
    score: '2',
    description: '尚未全面完成工作目标，其工作表现和工作质量尚能满足岗位的要求，工作绩效偶尔达到本职位常规标准的要求。',
  },
  {
    level: 'D',
    score: '1',
    description: '仅仅完成工作目标的最低标准，工作表现和工作质量仅仅符合岗位的最低要求，工作绩效仅仅达到本职位最低要求',
  },
];

export const menusData = [
  {
    path: '/',
    name: 'home',
    label: '首页',
    icon: 'el-icon-s-home',
    authority: ['admin'],
  },
  {
    label: '系统管理',
    icon: 'el-icon-setting',
    authority: ['admin'],
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
    authority: ['admin'],
  },
  {
    path: '/examine',
    name: 'examine',
    label: '考核管理',
    icon: 'el-icon-s-operation',
    authority: ['admin'],
  },
  {
    label: '日志管理',
    icon: 'el-icon-time',
    authority: ['admin'],
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
    authority: ['admin'],
  },
  {
    path: '/clockIn',
    name: 'clockIn',
    label: '今日打卡',
    icon: 'el-icon-place',
    authority: ['employee'],
  },
];

export const menusData2 = [
  {
    path: '/',
    name: 'home',
    label: '首页',
    icon: 'el-icon-s-home',
    authority: ['admin'],
  },
  {
    label: '基础信息管理',
    icon: 'el-icon-setting',
    authority: ['admin'],
    children: [
      {
        path: '/system/user',
        name: 'user',
        label: '学生管理',
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
    authority: ['admin'],
  },
  {
    path: '/examine',
    name: 'examine',
    label: '考核管理',
    icon: 'el-icon-s-operation',
    authority: ['admin'],
  },
];