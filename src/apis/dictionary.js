/*
 * @LastEditTime: 2023-03-21 16:10:17
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
    return axios.get(`/api/Background/Dictionary/DeleteByIds?ids${ids}`);
  },
  UpdateDicsByName(keyArr) {
    return axios.get(`/api/Background/Dictionary/UpdateDicsByName?dtos${keyArr}`);
  },
};
