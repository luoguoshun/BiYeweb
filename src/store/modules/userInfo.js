export default {
  namespaced: true,
  state: {
    userInfo: {},
  },
  getters: {
    getUserInfo(state) {
      if (state.userInfo == null) {
        return null;
      }
      return state.userInfo;
    },
  },
  //mutations是唯一一种方式来修改state中的状态的；
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    clearUserInfo(state) {
      localStorage.removeItem('userData');
    },
  },
  actions: {},
};