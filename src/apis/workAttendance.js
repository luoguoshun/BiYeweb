/*
 * @LastEditTime: 2023-03-23 10:57:31
 * @Descripttion:
 */
import axios from '../utils/axios';

export default {
  //获取考勤列表
  getworkAttendanceList(queryform) {
    return axios.post('/api/Background/WorkAttendance/GetWorkAttendanceList', queryform);
  },
  //新建考勤
  addWorkAttendance(work) {
    return axios.post('/api/Background/WorkAttendance/AddWorkAttendance', work);
  },
  //删除考勤
  deleteWorkAttendances(ids) {
    // return axios.post(`/api/Background/WorkAttendance/DeleteWorkAttendances?ids=${ids}`);
    return axios.post(`/api/Background/WorkAttendance/DeleteWorkAttendances`, ids);
  },
  //修改考勤状态
  updateStatus(work) {
    return axios.post('/api/Background/WorkAttendance/UpdateStatus', work);
  },
  checkClockIn(employeeId, wAType) {
    return axios.get(
      `/api/Background/WorkAttendance/CheckClockIn?employeeId=${employeeId}&wAType=${wAType}`,
    );
  },
};
