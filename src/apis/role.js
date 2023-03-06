import axios from '@/utils/axios';
export default {
  //获取角色列表
  getRoleList() {
    return axios.post('/api/Background/Role/GetRoleList');
  },

  //添加角色
  addRole(RoleForm) {
    return axios.post('/api/Background/Role/AddRole', {
      ...RoleForm,
    });
  },
  //通过Excel文件导入数据
  importRolesByExcel(excelFile) {
    return axios.post('/api/Background/Role/ImportRolesByExcel', excelFile);
  },
  //通过Excel文件导入数据
  exportRoleDataToExcel(roleIds) {
    return axios.post('/api/Background/Role/ExportRoleDataToExcel', roleIds);
  },
  //修改部分角色信息
  updateRole(RoleForm) {
    return axios.post('/api/Background/Role/UpdateRole', {
      ...RoleForm,
    });
  },

  //删除角色
  deleteRoleIdById(roleIds) {
    return axios.post('/api/Background/Role/DeleteRolesById', roleIds);
  },
  // 获取角色权限列表
  getAllPermissionsByRoleId(roleId) {
    return axios.post('/api/Background/Role/GetAllPermissionsByRoleId', {
      roleId,
    });
  },
  //分配权限
  assignPermissions(roleId, routerIds) {
    return axios.post('/api/Background/Role/AssignPermissions', {
      roleId,
      routerIds,
    });
  },
};
