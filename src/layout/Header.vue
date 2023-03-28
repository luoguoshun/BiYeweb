<!--
 * @LastEditTime: 2023-03-28 11:08:37
 * @Descripttion: 头部
-->
<template>
  <div id="header">
    <div class="l-content">
      <el-button plain icon="el-icon-menu" size="mini" @click="collapseMenu"> </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          <span style="color: #1e2732; font-weight: normal"> {{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img :src="userInfo.headerImgUrl" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toSetting">个人设置</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import store from '@/store';
export default {
  data() {
    return {
      // userImg: require('../assets/images/user.png'),
      breadcrumbList: [],
    };
  },
  computed: {
    ...mapGetters({ userInfo: 'user/userInfo' }),
  },
  methods: {
    ...mapMutations({
      clearUserInfo: 'user/clearUserInfo',
      clearToken: 'token/clearToken',
      closeAllTags: 'lable/closeAllTags',
      collapseMenu: 'tab/collapseMenu', //控制左侧菜单是否折叠
    }),
    /**
     * @description: 退出登陆
     * @return {*}
     */
    logOut() {
      this.$store.commit('user/clearUserInfo');
      this.$store.commit('token/clearToken');
      this.$store.commit('user/clearUserInfo');
      this.closeAllTags();
      this.clearToken();
      this.$router.push({ name: 'login' });
    },
    toSetting() {
      this.$store.commit('lable/createTab', { tabName: '个人设置', routeName: 'userSetting' });
      this.$router.push({ name: 'userSetting' });
    },
  },
  created() {
    //获取路由内的全部信息
    this.breadcrumbList = this.$route.matched.filter((item, index) => index != 0);
  },
  watch: {
    //监听，实时获取路由变动信息
    $route(to, from) {
      this.breadcrumbList = to.matched.filter((item, index) => index != 0);
    },
  },
};
</script>

<style lang="less" scoped>
#header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: red;
  .l-content {
    display: flex;
    align-items: center;
    .el-breadcrumb {
      margin-left: 10px;
    }
  }
  .r-content {
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>
