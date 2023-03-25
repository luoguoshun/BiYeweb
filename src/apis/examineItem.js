import axios from '../utils/axios';
export default {
  getExamineItemList() {
    return axios.post('/api/Background/ExamineItem/GetExamineItemList');
  },
};
