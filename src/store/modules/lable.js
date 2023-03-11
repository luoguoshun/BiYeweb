export default {
  namespaced: true,
  state: {
    dynamicTag: {
      tabs: [],
      activeRoute: 'home',
      multiTab: true, //true组件皆缓存
    },
  },
  getters: {
    getDynamicTags: (state) => {
      return state.dynamicTag ? null : state.dynamicTag;
    },
  },
  mutations: {
    //切换组件时重新设置激活的路由
    setActiveRoute(state, activeRoute) {
      state.dynamicTag.activeRoute = activeRoute;
    },
    createTab(state, tab) {
      state.dynamicTag.activeRoute = tab.routeName; //保存当前激活的路由
      if (tab.routeName == 'home') {
        return;
      }
      //标签组不存在当前点击的菜单则添加到标签组
      if (JSON.stringify(state.dynamicTag.tabs).indexOf(JSON.stringify(tab)) == -1) {
        state.dynamicTag.tabs.push(tab);
      }
    },
    removeTab(state, routeName) {
      var tabs = state.dynamicTag.tabs;
      tabs.forEach((element, index) => {
        if (element.routeName == routeName) {
          tabs.splice(index, 1);
          //如果为数组第一个元素 则直接激活首页路由
          if (index == 0 && tabs.length == 0) {
            state.dynamicTag.activeRoute = 'home';
          } else if (element.routeName == state.dynamicTag.activeRoute) {
            //判断删掉的标签是否为当前打开的路由 如果是 则激活最后tab路由
            state.dynamicTag.activeRoute = tabs[tabs.length - 1].routeName;
          }
          return true;
        }
      });
    },
    closeAllTags(state) {
      state.dynamicTag.tabs = [];
    },
  },
  actions: {},
};
