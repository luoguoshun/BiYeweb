<!--
 * @LastEditTime: 2023-03-21 09:02:01
 * @Descripttion: 
-->
<template>
  <div id="">
    <el-tabs v-model="activeName">
      <el-tab-pane label="考勤列表" name="list">
        <WAList></WAList>
      </el-tab-pane>
      <el-tab-pane label="考勤设置" name="setting">
        <setting></setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import setting from './setting.vue';
import WAList from './WAList.vue';
export default {
  components: {
    setting,
    WAList,
  },
  data() {
    return {
      activeName: 'list',
    };
  },
};
</script>

<style></style>
