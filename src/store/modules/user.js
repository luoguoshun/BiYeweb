export default {
  namespaced: true,
  state: {
    userInfo: {
      employeeId: '',
      roleIds: 'admin&&',
      employeeName: '',
      headerImgUrl: '',
    },
  },
  getters: {
    userInfo(state) {
      return state.userInfo ?? null;
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
