import Mock from "mockjs";
export default {
  getMenuList: () => {
    return {
      code: 200,
      message: "success",
      data: [
        {
          path: "/",
          name: "home",
          label: "首页",
          icon: "el-icon-s-home",
        },
        {
          label: "系统管理",
          icon: "el-icon-setting",
          children: [
            {
              path: "/system/user",
              name: "user",
              label: "用户管理",
              icon: "setting",
            },
            {
              path: "/system/role",
              name: "role",
              label: "角色管理",
              icon: "setting",
            },
            {
              path: "/system/department",
              name: "department",
              label: "部门管理",
              icon: "setting",
            },
          ],
        },
        {
          path: "/workAttendance",
          name: "workAttendance",
          label: "考勤管理",
          icon: "el-icon-s-operation",
        },
        {
          path: "/examine",
          name: "examine",
          label: "考核管理",
          icon: "el-icon-s-operation",
        },
        {
          label: "日志管理",
          icon: "el-icon-time",
          children: [
            {
              path: "/logs/systemLog",
              name: "systemLog",
              label: "系统日志",
              icon: "setting",
            },
            {
              path: "/logs/operateLog",
              name: "operateLog",
              label: "操作日志",
              icon: "setting",
            },
          ],
        },
      ],
    };
  },
};
