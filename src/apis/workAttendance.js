/*
 * @LastEditTime: 2023-03-21 18:19:18
 * @Descripttion: 
 */
import axios from "../utils/axios"

export default{
    //获取考勤列表
    getWorkAttendanceList(queryform) {
      return axios.post('/api/Background/GorkAttendance/GetWorkAttendanceList',queryform);
    },
    //新建考勤
    addWorkAttendance(dto) {
      return axios.post('/api/Background/GorkAttendance/AddWorkAttendance',dto);
    },
  };