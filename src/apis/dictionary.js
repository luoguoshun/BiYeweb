/*
 * @LastEditTime: 2023-03-22 14:35:06
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
    return axios.get(`/api/Background/Dictionary/DeleteByIds?ids=${ids}`);
  },
  /**
   * @description: 更新字典数据（如果不存在则默认添加）
   * @param {*} keyArr 字典实体数组
   */
  updateDicsByName(keyArr) {
    return axios.get(`/api/Background/Dictionary/UpdateDicsByName?dtos=${keyArr}`);
  },
  /**
   * @description: 新建字典数据
   * @return {*}
   * @param {*} keyArr
   */
  addDictionary(dicDto) {
    return axios.get(`/api/Background/Dictionary/AddDictionary`, {
      ...dicDto,
    });
  },
  /**
   * @description: 更新状态
   * @return {*}
   * @param {*} dicDto
   */  
  updateStatus(dicDto) {
    return axios.get(`/api/Background/Dictionary/UpdateStatus`, {
      ...dicDto,
    });
  },
};
