/*
 * @LastEditTime: 2023-03-31 15:49:55
 * @Descripttion: 
 */
import axios from '@/utils/axios';
export default {
  //获取用户列表
  getUserList(page, row, conditions, roleId) {
    return axios.post('/api/Background/Employee/GetUserList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      RoleId: roleId,
    });
  },
  //获取用户信息
  getClientInfo(clientNo) {
    return axios.post('/api/Background/Employee/GetClientinfo', {
      clientNo,
    });
  },
  //修改部分用户信息
  updateUser(userForm) {
    return axios.post('/api/Background/Employee/UpdateUser', {
      ...userForm,
    });
  },
  //上传用户头像
  uploadUserHeadImg(imageFile) {
    return axios.post('/api/Background/Employee/UploadUserHeadImg', imageFile);
  },
  //上传用户头像
  uploadUserNote(formData) {
    return axios.post('/api/Background/Employee/UploadUserNote', formData);
  },
  //修改用户状态
  updateUserState(employeeId, status) {
    return axios.post('/api/Background/Employee/UpdateUserState', {
      employeeId,
      status,
    });
  },
  //新建用户
  addUser(userForm) {
    return axios.post('/api/Background/Employee/AddUser', {
      ...userForm,
    });
  },
  //删除用户
  deleteUsersById(employeeIds) {
    return axios.post('/api/Background/Employee/DeleteUsersById', employeeIds);
  },
  //检查用户是否存在
  checkUserExists(employeeId) {
    return axios.get('/api/Background/Employee/CheckUserExists?employeeId=' + employeeId + '');
  },

  //通过角色获取用户列表
  getUsersByRoleId(roleId) {
    return axios.get('/api/Background/Employee/GetUsersByRoleId?roleId=' + roleId + '');
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
