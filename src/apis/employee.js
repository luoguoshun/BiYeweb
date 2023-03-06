import axios from "@/utils/axios";
export default {
  //获取用户列表
  getUserList(page, row, conditions, roleId) {
    return axios.post("/api/Background/User/GetUserList", {
      Page: page,
      Row: row,
      Conditions: conditions,
      RoleId: roleId,
    });
  },
  //获取用户信息
  getClientInfo(clientNo) {
    return axios.post("/api/Background/User/GetClientinfo", {
      clientNo,
    });
  },
  //修改部分用户信息
  updateUser(userForm) {
    return axios.post("/api/Background/User/UpdateUser", {
      ...userForm
    });
  },
  //上传用户头像
  UploadUserHeadImg(imageFile) {
    return axios.post("/api/Background/User/UploadUserHeadImg", imageFile);
  },
  //修改用户状态
  updateUserState(userId, state) {
    return axios.post("/api/Background/User/UpdateUserState", {
      userId,
      state
    });
  },
  //修改用户状态
  addUser(userForm) {
    return axios.post("/api/Background/User/AddUser", {
      ...userForm
    });
  },
  //删除用户
  deleteUsersById(userIds) {
    return axios.post("/api/Background/User/DeleteUsersById",
      userIds
    );
  },
  //检查用户是否存在
  checkUserExists(userId) {
    return axios.get("/api/Background/User/CheckUserExists?userId=" + userId + "");
  },

  //通过角色获取用户列表
  getUsersByRoleId(roleId) {
    return axios.get("/api/Background/User/GetUsersByRoleId?roleId=" + roleId + "");
  },
  //修改密码
  updatePwd(adminNo, oldPwd, newPwd) {
    return axios.post('/api/Background/User/UpdatePwd', {
      AdminNo: adminNo,
      OldPwd: oldPwd,
      NewPwd: newPwd,
    });
  },
};