<template>
  <!--collapse 是否水平折叠收起菜单-->
  <el-menu
    :router="true"
    :collapse="isCollapse"
    :default-active="$route.path"
    class="el-menu-vertical-demo el-menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!--是否水平折叠收起菜单 会影响这里字段的显示 -->
    <h3 v-show="isCollapse">菜单</h3>
    <h3 v-show="!isCollapse">后台管理系统</h3>
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.name"
      @click.native="createTab({ tabName: item['label'], routeName: item.name })"
    >
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu :index="item.label" v-for="item in hasChildren" :key="item.path">
      <template slot="title">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="subItem.path"
          v-for="subItem in item.children"
          :key="subItem.name"
          @click.native="createTab({ tabName: subItem['label'], routeName: subItem.name })"
        >
          <i :class="subItem.icon"></i>
          <span slot="title">{{ subItem.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
import store from '@/store';
import { mapGetters, mapMutations } from 'vuex';
export default {
  computed: {
    /**
     * @description: 没有子菜单
     * @return {*}
     */
    noChildren: function () {
      return this.menus.filter((item) => !item.children);
    },
    /**
     * @description: 有子菜单 (这样设置会有一个问题 就是有子菜单的 永远会在没有子菜单的下面
     * @return {*}
     */
    hasChildren: function () {
      return this.menus.filter((item) => item.children);
    },
    /**
     * @description: 是否折叠
     * @return {*}
     */
    isCollapse: function () {
      return this.$store.state['tab']['isCollapse'];
    },
  },
  data() {
    return {
      menus:[],
    };
  },
  methods: {
    //   映射添加标签页函数
    //  载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：
    ...mapMutations({ createTab: 'lable/createTab' }),
    //跳转路由 根据名称跳转
    clickMenu(item) {
      this.$router.push({ name: item.name });
    },
  },
  created() {
    //获取菜单数据
    this.$api.mock.getMenuList().then((res) => {
      const { code, success, data } = res.data;
      this.menus = data;
    });
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
  min-height: 400px;
  border: none;
  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
  li {
    text-align: left;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
