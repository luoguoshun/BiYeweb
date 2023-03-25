/*
 * @LastEditTime: 2023-03-24 10:32:56
 * @Descripttion: 考核考勤
 */
import axios from '../utils/axios';
export default {
  /**
   * @description: 获取考核列表
   * @return {*}
   * @param {*} queryform
   */
  getExamineList(queryform) {
    return axios.post('/api/Background/Examine/GetExamineList', queryform);
  },
  /**
   * @description: 获取考核表 详情表 数据
   * @return {*}
   * @param {*} queryform
   */
  getExamineDetailsList(queryform) {
    return axios.post('/api/Background/Examine/GetExamineDetailsList', queryform);
  },
  addExamine(examine) {
    console.log(examine);
    return axios.post('/api/Background/Examine/AddExamine', examine);
  },
  getExamineById(id) {
    return axios.get(`/api/Background/Examine/GetExamineById?id=${id}`);
  },
  updateExamineStatus(id, status) {
    return axios.post(`/api/Background/Examine/updateExamineStatus`, {
      id,
      status,
    });
  },
  /**
   * @description: 删除未生效的考核单
   * @param {*} ids
   */  
  deleteWorkById(ids){
    return axios.delete(`/api/Background/Examine/deleteWorkById?ids=${ids}`);
  }
};
