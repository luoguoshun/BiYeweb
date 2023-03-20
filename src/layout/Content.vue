<!--
 * @LastEditTime: 2023-03-20 17:59:21
 * @Descripttion: 
-->
<template>
  <div id="content">
    <el-tabs v-model="getDynamicTags.activeRoute" @tab-remove="removeTab" @tab-click="switchComponent">
      <el-tab-pane key="home" label="首页" name="home" :closable="false"> </el-tab-pane>
      <el-tab-pane v-for="tab in getDynamicTags.tabs" :key="tab.routeName" :label="tab.tabName" :name="tab.routeName" :closable="true"> </el-tab-pane>
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
    ...mapMutations({
      delTagFromArray: 'lable/removeTab',
      setActiveRoute: 'lable/setActiveRoute',
    }),
    /**
     * @description: 切换组件
     * @param {*} tab: 标签对象
     * @return {*}
     */
    switchComponent(tab) {
      let routeName = tab.$vnode.data.key;
      if (this.$route.path !== routeName) {
        this.setActiveRoute(routeName); //重新设置激活的tab
        this.$router.push({ name: routeName });
      }
    },
    /**
     * @description: 删除tag标签并跳转路由
     * @param {*} routeName:  要删除的tag携带的路由
     * @return {*}
     */
    removeTab(routeName) {
      this.delTagFromArray(routeName);
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
    width: 100%;
    min-height: 850px;
    .el-card__body{
      // padding:10px ;
    }
  }
}
</style>
