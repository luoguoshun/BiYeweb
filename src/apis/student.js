/*
 * @LastEditTime: 2023-03-31 14:19:54
 * @Descripttion: 
 */
import axios from '@/utils/axios';
export default {
  //获取用户列表
  getStudentList(page, row, conditions, roleId) {
    return axios.post('/api/Background/Employee/GetStudentList', {
      Page: page,
      Row: row,
      Conditions: conditions,     
    });
  },
};
