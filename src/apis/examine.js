/*
 * @LastEditTime: 2023-03-20 18:16:12
 * @Descripttion: 考核考勤
 */
import axios from '../utils/axios';

export default {
  //获取考核列表
  getExamineList(queryform) {
    return axios.post('/api/Background/GorkAttendance/GetExamineList',queryform);
  },
  addExamineAsync(examine){
    return axios.post('/api/Background/GorkAttendance/AddExamineAsync',examine);
  }
};
