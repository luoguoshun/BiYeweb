<template>
  <div class="log_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteLogs()">
          移除
        </el-button>
        <!-- <el-button type="warning" size="mini" @click="exportLog()">
          导出数据
        </el-button> -->
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" v-model="queryForm.level" placeholder="日志等级">
          <el-option v-for="item in logLevelType" :key="item.level" :label="item.typeName" :value="item.level"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        <el-button type="primary" @click="selectLog()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="table.logData"
      @selection-change="selectRows"
      border
    >
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <el-table-column prop="logId" label="logId" width="100" align="center"> </el-table-column>
      <el-table-column prop="appName" label="记录框架名称" align="center"> </el-table-column>
      <el-table-column prop="thread" label="线程编号" width="50" align="center"> </el-table-column>
      <el-table-column prop="source" label="错误来源" align="center"> </el-table-column>
      <el-table-column prop="level" label="等级" width="60" w align="center"> </el-table-column>
      <el-table-column prop="message" label="错误信息" align="center"></el-table-column>
      <el-table-column label="时间" align="center" sortable="true" width="150" sort-by>
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.LogDate) }}
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="openUpdateDiolog(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="table.total"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>
    <!-- 日志详细信息对话框 -->
    <el-dialog title="日志信息" center :visible.sync="updateDialog.visible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="logForm" label-width="80px">
        <el-form-item label="设备编号">
          <el-input type="text" v-model="logForm.machineId"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-input type="text" v-model="logForm.origin"></el-input>
        </el-form-item>
        <el-form-item label="路由">
          <el-input type="text" v-model="logForm.routeInfo"></el-input>
        </el-form-item>
        <el-form-item label="详细信息">
          <el-input type="textarea" :rows="6" v-model="logForm.message"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索模型
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        level: '',
        publicationDates: [],
      },
      //表格数据
      table: {
        logData: [],
        total: 0,
      },
      logIds: [],
      //修改对话框
      updateDialog: {
        visible: false,
      },
      //日志模型
      logForm: {
        machineId: '',
        origin: '',
        routeInfo: '',
        message: '',
      },
      //书籍类别集合
      logLevelType: [{ level: 0, typeName: '请选择等级' }],
      fileList: [],
    };
  },
  methods: {
    //导出日志数据
    exportLog() {
      if (this.logIds.length == 0) {
        this.$message({
          message: '请选择要导出的数据',
          type: 'warning',
        });
      } else {
        this.$api.log.exportLogs(this.logIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('导出失败！');
          } else {
            this.$message({ message: '导出成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //获取日志列表数据
    async getLogList() {
      await this.$api.log
        .getLogList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.level, this.queryForm.publicationDates)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          } else {
            this.table.logData = data.logs;
            this.table.total = data.count;
          }
        });
    },
    //获取日志类型列表
    getLogTypeList() {
      this.$api.log.getLogTypeList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        } else {
          this.logLevelType = data;
        }
      });
    },
    //加载数据
    loadData() {
      this.getLogList();
    },
    //条数改变
    handleSizeChange(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //查找日志
    selectLog() {
      this.queryForm.page = 1;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.level = '';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //打开详细信息弹窗
    openUpdateDiolog(row) {
      this.logForm = { ...row };
      this.updateDialog.visible = true;
    },
    //获取选中行的数据
    selectRows(selectRows) {
      this.logIds = [];
      selectRows.forEach((element) => {
        this.logIds.push(element.logId);
      });
    },
    //删除多条日志
    deleteLogs() {
      if (this.logIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.log.deleteLogs(this.logIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
  },
  created() {
    this.loadData();
    this.getLogTypeList();
  },
};
</script>
<style lang="less" scoped>
.log_container {
  width: 99.99%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 0.4fr 0.4fr ;
      grid-column-gap: 5px;
    }
  }
}
</style>
