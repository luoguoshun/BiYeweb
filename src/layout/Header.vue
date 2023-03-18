<template>
  <header>
    <div class="l-content">
      <el-button plain icon="el-icon-menu" size="mini" @click="collapseMenu"> </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          <span> {{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <span>[{{userInfo.employeeName}}]</span>
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img :src="userInfo.headerImgUrl" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import store from '@/store';
export default {
  data() {
    return {
      // userImg: require('../assets/images/user.png'),
     
      breadcrumbList: [],
    }
  },
  computed:{
    ...mapGetters({ userInfo: 'userInfo/getUserInfo' })
    // userImg:()=>
  },
  methods: {
    ...mapMutations({
      clearUserInfo: 'userInfo/clearUserInfo',
      clearToken: 'token/clearToken',
      closeAllTags: 'lable/closeAllTags',
      collapseMenu: 'tab/collapseMenu',//控制左侧菜单是否折叠
    }),
    /**
     * @description: 退出登陆
     * @return {*}
     */    
    logOut() {
      this.clearUserInfo();
      this.closeAllTags();
      this.clearToken();
      // if (this.$signalR.connection['_connectionState'] !== 'Disconnected') {
      //   this.$signalR.connection.stop();
      // }
      this.$router.push({ name: 'login' });
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
header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

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
  >:first-child{
    color: #ffffff;
    margin-right: 10px;
    // margin-bottom: 20px;
    line-height: 40px;
  }
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>

<style lang="less">
.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #666666;
    font-weight: normal;
  }

  &:last-child {
    .el-breadcrumb__inner {
      color: #ffffff;
  
    }
  }
}
</style>
