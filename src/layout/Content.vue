<!--
 * @LastEditTime: 2023-03-28 18:18:43
 * @Descripttion: 主内容区
-->
<template>
  <div id="content">
    <el-tabs v-model="getDynamicTags.activeRoute" @tab-remove="removeTabHandle" @tab-click="switchComponent">
      <el-tab-pane key="home" label="首页" name="home" :closable="false"> </el-tab-pane>
      <el-tab-pane
        v-for="tab in getDynamicTags.tabs"
        :key="tab.routeName"
        :label="tab.tabName"
        :name="tab.routeName"
        :closable="true"
      >
      </el-tab-pane>
    </el-tabs>
    <el-card id="dynamic-content">
      <router-view />
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  computed: {
    ...mapGetters({ getDynamicTags: 'lable/getDynamicTags' }),
  },
  data() {
    return {};
  },
  methods: {
    //#region mapMutator methods
    // ...mapMutations({
    //   removeTabHandle: 'lable/removeTab',
    //   setActiveRoute: 'lable/setActiveRoute',
    // }),
    //#endregion

    /**
     * @description: 切换组件
     * @param {*} tab: 标签对象
     */
    switchComponent(tab) {
      let routeName = tab.$vnode.data.key;
      if (this.$route.path !== routeName) {
        this.$store.commit('lable/setActiveRoute', routeName); //重新设置激活的tab
        this.$router.push({ name: routeName });
      }
    },
    /**
     * @description: 删除tag标签并跳转路由
     * @param {*} routeName:  要删除的tag携带的路由
     */
    removeTabHandle(routeName) {
      this.$store.commit('lable/removeTab', routeName);
      // this.delTagFromArray(routeName);
      if (routeName == this.$route.name) {
        this.$router.push({ name: this.getDynamicTags.activeRoute });
      }
    },
  },
};
</script>

<style lang="less" scoped>
#content {
  .el-tabs__item {
    text-align: center;
  }
  #dynamic-content {
    position: absolute; //绝对定位的参考物是：距离最近的使用了定位的父级，父级都没有使用时找body
    width: 100%;
    // height: 100%;
  }
}
</style>
