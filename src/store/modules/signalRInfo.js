export default {
  namespaced: true,
  // 存放状态
  state: {
    staSubscribe: [],
  },
  //加工state成员给外界
  getters: {
    staSubscribeData(state) {
      if (state.staSubscribe == null) {
        return null;
      }
      console.log(state.staSubscribe);
      return state.staSubscribe;
    },
  },
  // 操作state成员
  mutations: {
    setStatisticsSubscribe(state, data) {
      state.staSubscribe = data;
    },
  },
};
