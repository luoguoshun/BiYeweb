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
        <common-header class="CommonHeader"></common-header>
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
  background-color: #ffffff;
  // background: linear-gradient(135deg,#5efce8,#736efe);渐变色（渐变色在CSS中被定义成了 image 类型）
  padding: 8px;
  border-bottom: 1px solid #dfe4ea;
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
