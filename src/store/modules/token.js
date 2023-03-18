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
      //当左侧值为 null 或 undefined 时，返回 ?? 符号右边的值
      return state.accessToken ?? '';
    },
    expiresTime: (state) => {
      return state.expiresTime ?? 0;
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
