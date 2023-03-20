<template>
  <div id="">
    <el-tabs v-model="activeName" @tab-click="handleClick">
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
};
</script>

<style></style>
