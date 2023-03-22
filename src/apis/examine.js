/*
 * @LastEditTime: 2023-03-22 11:58:04
 * @Descripttion: 
 */
/*
 * @LastEditTime: 2023-03-22 11:55:26
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
  addExamineAsync(examine) {
    return axios.post('/api/Background/Examine/AddExamineAsync', examine);
  },
  getExamineById(id) {
    return axios.post(`/api/Background/Examine/GetExamineById?id=${id}`);
  },
};
