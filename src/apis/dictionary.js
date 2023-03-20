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
  updateByName(name, content) {
    return axios.get(`/api/Background/Dictionary/UpdateByName`, {
      name,
      content,
    });
  },
};
