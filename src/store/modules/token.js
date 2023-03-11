export default {
  namespaced: true,
  // 存放状态
  state: {
    accessToken: '',
    expiresTime: 0,
  },
  //加工state成员给外界
  getters: {
    accessToken: (state) => {
      return state.accessToken ? null : state.accessToken;
    },
    expiresTime: (state) => {
      return state.accessToken ? null : state.expiresTime;
    },
  },
  // 操作state成员
  mutations: {
    setTokenInfo(state, tokenInfo) {
      state['accessToken'] = tokenInfo['accessToken'];
      state['expiresTime'] = new Date().getTime() + tokenInfo['expiresIn'];
    },
    clearToken(state) {
      localStorage.removeItem('token');
    },
  },
};
