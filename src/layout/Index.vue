<template>
  <el-container style="height: 100%">
    <!--左侧栏-->
    <el-aside width="auto">
      <!--左侧栏控件-->
      <common-aside></common-aside>
    </el-aside>
    <!--右侧栏-->
    <el-container>
      <!--header部分-->
      <el-header>
        <common-header></common-header>
      </el-header>
      <el-main>
        <Content></Content>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from '@/layout/Aside';
import CommonHeader from '@/layout/Header';
import Content from '@/layout/Content';

export default {
  components: {
    CommonAside,
    CommonHeader,
    Content,
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #333;
}
.el-main {
  padding-top: 5px;
  padding-bottom: 0;
  .dynamic-content {
    padding: 0px;
    padding-bottom: 0;
    border: 1px solid red;
  }
}
</style>
