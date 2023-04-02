/*
 * @LastEditTime: 2023-03-31 16:11:34
 * @Descripttion:
 */
import axios from '@/utils/axios';
export default {
  //获取用户列表
  getStudentList(page, row, conditions, roleId) {
    return axios.post('/api/Background/Student/GetStudentList', {
      Page: page,
      Row: row,
      Conditions: conditions,
    });
  },
  update(student) {
    return axios.post('/api/Background/Student/Update', student);
  },
  delete(id) {
    return axios.delete(`/api/Background/Student/Delete?id=${id}`);
  },
  //上传用户头像
  uploadUserHeadImg(imageFile) {
    return axios.post('/api/Background/Student/UploadUserHeadImg', imageFile);
  },
  //修改密码
  updatePwd(adminNo, oldPwd, newPwd) {
    return axios.post('/api/Background/Student/UpdatePwd', {
      AdminNo: adminNo,
      OldPwd: oldPwd,
      NewPwd: newPwd,
    });
  },
  add(student) {
    return axios.post('/api/Background/Student/Add', student);
  },
};
