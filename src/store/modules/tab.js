export default {
  namespaced: true,
  state: {
    isCollapse: false,
  },
  getters: {
    isCollapse(state) {
      return state.isCollapse;
    },
  },
  //调用方法
  mutations: {
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse;
    },
  },
  actions: {},
};
