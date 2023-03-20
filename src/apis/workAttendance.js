/*
 * @LastEditTime: 2023-03-20 18:25:29
 * @Descripttion: 
 */
import axios from "../utils/axios"

export default{
    //获取考勤列表
    getWorkAttendanceList(queryform) {
      return axios.post('/api/Background/GorkAttendance/GetWorkAttendanceList',queryform);
    },
  };