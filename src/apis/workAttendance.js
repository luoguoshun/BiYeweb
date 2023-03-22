/*
 * @LastEditTime: 2023-03-22 18:36:49
 * @Descripttion: 
 */
import axios from "../utils/axios"

export default{
    //获取考勤列表
    getworkAttendanceList(queryform) {
      return axios.post('/api/Background/WorkAttendance/GetWorkAttendanceList',queryform);
    },
    //新建考勤
    addWorkAttendance(work) {
      return axios.post('/api/Background/WorkAttendance/AddWorkAttendance',work);
    },
  };