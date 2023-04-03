/*
 * @LastEditTime: 2023-03-31 16:11:34
 * @Descripttion:
 */
import axios from '@/utils/axios';
export default {
  //获取用户列表
  getAdministratorList(page, row, conditions, roleId) {
    return axios.post('/api/Background/Administrator/GetAdministratorList', {
      Page: page,
      Row: row,
      Conditions: conditions,
    });
  },
  update(administrator) {
    return axios.post('/api/Background/Administrator/Update', administrator);
  },
  delete(id) {
    return axios.delete(`/api/Background/Administrator/Delete?id=${id}`);
  },
  //上传用户头像
  uploadHeadImg(imageFile) {
    return axios.post('/api/Background/Administrator/UploadHeadImg', imageFile);
  },
  //修改密码
  updatePwd(adminNo, oldPwd, newPwd) {
    return axios.post('/api/Background/Administrator/UpdatePwd', {
      AdminNo: adminNo,
      OldPwd: oldPwd,
      NewPwd: newPwd,
    });
  },
  add(administrator) {
    return axios.post('/api/Background/Administrator/Add', administrator);
  },
};
