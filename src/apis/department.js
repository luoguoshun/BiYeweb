import axios from "../utils/axios"

export default{

  //获取部门列表
  getDepartmentList() {
    return axios.post('/api/Background/Department/GetDepartmentList');
  },

   //修改部门信息
   UpdateDepartment(DepartmentFrom) {
    return axios.post('/api/Background/Department/UpdateDepartment', {
      ...DepartmentFrom,
    });
  },

  //添加部门
  AddDepartment(DepartmentFrom) {
    return axios.post('/api/Background/Department/AddDepartment', {
      ...DepartmentFrom,
    });
  },
};