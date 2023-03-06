export default {
  namespaced: true,
  // 存放状态
  state: {
    accessToken: '',
    expiresTime: 0,
  },
  //加工state成员给外界
  getters: {
    accessToken(state) {
      if (state.accessToken == null) {
        return null;
      }
      return state.accessToken;
    },
    expiresTime(state) {
      if (state.accessToken == null) {
        return null;
      }
      return state.expiresTime;
    },
  },
  // 操作state成员
  mutations: {
    setTokenInfo(state, tokenInfo) {
      state['accessToken'] = tokenInfo['accessToken'];
      state['expiresTime'] = new Date().getTime() + tokenInfo['expiresIn'];
    },
    clearToken(state) {
      localStorage.removeItem('tokenData');
    },
  },
};
