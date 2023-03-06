export const menus = [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 's-home',
  },
  {
    label: '系统管理',
    icon: 'location',
    children: [
      {
        path: '/system/user',
        name: 'user',
        label: '用户管理',
        icon: 'setting',
      },
      {
        path: '/system/role',
        name: 'role',
        label: '角色管理',
        icon: 'setting',
      },
    ],
  },
];
