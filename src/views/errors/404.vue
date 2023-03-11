<template>
  <!-- 404页面 -->
  <div class="page-404">
    <el-empty :image-size="200" description="404"></el-empty>
    <!-- <img src="../../assets/images/404.png" alt="404" title="404" /> -->
  </div>
</template>

<script>
export default {
  name: 'error-404',
};
</script>

<style lang="less">
.page-404 {
  text-align: center;
  padding-top: 50px;
}
</style>
