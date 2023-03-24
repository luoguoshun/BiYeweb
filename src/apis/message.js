/*
 * @LastEditTime: 2023-03-24 15:28:40
 * @Descripttion:
 */
import axios from '../utils/axios';

export default {
  getMessageListByUserId() {
    return axios.post('/api/Background/Message/GetMessageListByUserId');
  },
  //消息被读取
  readMessage(messageId) {
    return axios.get('/api/Background/Message/ReadMessage?messageId=' + messageId + '');
  },
  //获取消息列表
  getMessageList(messagefrom) {
    return axios.post('/api/Background/Message/GetMessageList', {
      ...messagefrom,
    });
  },
  //删除消息列表
  deleteMessage(MessageIds) {
    return axios.delate('/api/Background/Message/DeleteMessage', MessageIds);
  },
  //获取消息类型
  getMessageType() {
    return axios.post('/api/Background/Message/GetMessageType');
  },
  //新增消息
  addMessage(from) {
    return axios.post('/api/Background/Message/AddMessage', {
      ...from,
    });
  },
};
