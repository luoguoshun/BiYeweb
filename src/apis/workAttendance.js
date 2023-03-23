/*
 * @LastEditTime: 2023-03-23 10:57:31
 * @Descripttion:
 */
import axios from '../utils/axios';

export default {
  //获取考勤列表
  getworkAttendanceList(queryform) {
    console.log("🚀 ~ file: workAttendance.js:6 ~ axios:", axios)
    return axios.post('/api/Background/WorkAttendance/GetWorkAttendanceList', queryform);
  },
  //新建考勤
  addWorkAttendance(work) {
    return axios.post('/api/Background/WorkAttendance/AddWorkAttendance', work);
  },
  //删除考勤
  deleteWorkAttendances(ids) {
    return axios.delete(`/api/Background/WorkAttendance/DeleteWorkAttendances?ids=${ids}`);
  },
};
