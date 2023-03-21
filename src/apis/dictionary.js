/*
 * @LastEditTime: 2023-03-21 10:52:03
 * @Descripttion: 数据字典接口
 */
import axios from '../utils/axios';
export default {
  //获取系统字典列表列表
  getDictionaryList(queryform) {
    return axios.post('/api/Background/Dictionary/GetDictionaryList', queryform);
  },
  /**
   * @description: 删除字典数据
   * @return {*}
   * @param {*} ids
   */
  deleteByIds(ids) {
    return axios.get(`/api/Background/Dictionary/GetDictionaryList?ids${ids}`);
  },
  updateByName(keyArr) {
    return axios.get(`/api/Background/Dictionary/UpdateByName`,keyArr);
  },
};
