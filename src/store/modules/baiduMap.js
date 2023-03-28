/*
 * @LastEditTime: 2023-03-28 17:14:19
 * @Descripttion:百度地图位置服务中心
 */
export default {
  namespaced: true,
  state: {
    longitude: 0,
    latitude: 0,
    address: '',
    appKey: 'oM3GYEaARO7xmO9TGFrNWEMGUWeiXYqM',
  },
  getters: {
    longitude: (state) => state.longitude ?? '',
    latitude: (state) => state.latitude ?? '',
    address: (state) => state.address ?? '',
    appKey: (state) => state.appKey ?? '',
  },
  //调用方法
  mutations: {
    //this.$store.commit(“mutation函数名”，发送到mutation中的数据)
    setLocation(state, location) {
      const { longitude, latitude, address } = location;
      state.longitude = longitude;
      state.latitude = latitude;
      state.address = address;
    },
  },
  actions: {
    //this.$store.dispatch(‘action中的函数名’，发送到action中的数据)
  },
};
