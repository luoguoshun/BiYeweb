/*
 * @LastEditTime: 2023-03-22 18:40:28
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
  deleteDicsByIds(ids) {
    return axios.post(`/api/Background/Dictionary/DeleteDicsByIds`, ids);
  },
  /**
   * @description: 更新字典数据（如果不存在则默认添加）
   * @param {*} keyArr 字典实体数组
   */
  updateDicsByName(keyArr) {
    return axios.post(`/api/Background/Dictionary/UpdateDicsByName`, keyArr);
  },
  /**
   * @description: 新建字典数据
   * @return {*}
   * @param {*} keyArr
   */
  addDictionary(dicDto) {
    return axios.post(`/api/Background/Dictionary/AddDictionary`, {
      ...dicDto,
    });
  },
  /**
   * @description: 更新状态
   * @return {*}
   * @param {*} dicDto
   */
  updateStatus(dicDto) {
    return axios.post(`/api/Background/Dictionary/UpdateStatus`, {
      ...dicDto,
    });
  },
  getDictionaryByName(name) {
    return axios.get(`/api/Background/Dictionary/getDictionaryByName?name=${name}`);
  },
};
