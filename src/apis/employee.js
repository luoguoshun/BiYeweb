import axios from "@/utils/axios";
export default {
  //获取用户列表
  getUserList(page, row, conditions, roleId) {
    return axios.post("/api/Background/Employee/GetUserList", {
      Page: page,
      Row: row,
      Conditions: conditions,
      RoleId: roleId,
    });
  },
  //获取用户信息
  getClientInfo(clientNo) {
    return axios.post("/api/Background/Employee/GetClientinfo", {
      clientNo,
    });
  },
  //修改部分用户信息
  updateUser(userForm) {
    return axios.post("/api/Background/Employee/UpdateUser", {
      ...userForm
    });
  },
  //上传用户头像
  UploadUserHeadImg(imageFile) {
    return axios.post("/api/Background/Employee/UploadUserHeadImg", imageFile);
  },
  //修改用户状态
  updateUserState(userId, state) {
    return axios.post("/api/Background/Employee/UpdateUserState", {
      userId,
      state
    });
  },
  //修改用户状态
  addUser(userForm) {
    return axios.post("/api/Background/Employee/AddUser", {
      ...userForm
    });
  },
  //删除用户
  deleteUsersById(userIds) {
    return axios.post("/api/Background/Employee/DeleteUsersById",
      userIds
    );
  },
  //检查用户是否存在
  checkUserExists(userId) {
    return axios.get("/api/Background/Employee/CheckUserExists?userId=" + userId + "");
  },

  //通过角色获取用户列表
  getUsersByRoleId(roleId) {
    return axios.get("/api/Background/Employee/GetUsersByRoleId?roleId=" + roleId + "");
  },
  //修改密码
  updatePwd(adminNo, oldPwd, newPwd) {
    return axios.post('/api/Background/Employee/UpdatePwd', {
      AdminNo: adminNo,
      OldPwd: oldPwd,
      NewPwd: newPwd,
    });
  },
};