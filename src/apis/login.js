import axios from '../utils/axios';


export default {
  /** 
   * @description  : 登入功能
   * @param  {*} account:账号 
   * @param  {*} password:密码
   * @return {*} 
   **/
  login(account, password) {
    return axios.post('/api/Login/Login', {
      Account: account,
      Password: password,
    });
  },
};