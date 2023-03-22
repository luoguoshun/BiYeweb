<template>
  <div class="wa-container">
    <el-row class="editbar" :gutter="20">
      <el-col :span="9">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="handleOpenDialog('add', {})">补入 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteDicById()"> 移除 </el-button>
        <el-button type="success" size="mini" class="el-icon-s-tools" @click="handleOpenSettingDialog()"> 设置 </el-button>
      </el-col>
      <el-col :span="5"> 
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-select size="mini" v-model="queryForm.roleId" placeholder="考勤类别">
          <el-option label="上班" :value="1"></el-option>
          <el-option label="下班" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select size="mini" v-model="queryForm.roleId" placeholder="考勤方式">
          <el-option label="打卡" :value="1"></el-option>
          <el-option label="补入" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
      </el-col>
      <el-col :span="1"> <el-button type="primary" @click="loadData()" size="mini">查找</el-button> </el-col>
      <el-col :span="1"> <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button></el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="table.workAttendanceList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="id" fixed label="编号" width="180" align="center"> </el-table-column>
      <el-table-column prop="employeeName" label="考勤人" width="150" align="center"></el-table-column>
      <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
      <el-table-column prop="wATypeStr" label="上班/下班" align="center"></el-table-column>
      <el-table-column prop="wAMethodStr" label="考勤方式" align="center"></el-table-column>
      <el-table-column prop="wALocation" label="考勤地点" align="center"></el-table-column>
      <el-table-column prop="Longitude" label="考勤经度" align="center"></el-table-column>
      <el-table-column prop="Latitude" label="考勤纬度" align="center"></el-table-column>
      <el-table-column prop="isOutRange" label="是否超出范围" align="center">
        <template slot-scope="scope">
          {{ scope.row.isOutRange == 0 ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row.status)['type']">{{ getTagType(scope.row.status)['text'] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createdTime" label="考勤日期" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleOpenDialog('update', scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
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
    <!-- 添加考勤信息对话框 -->
    <el-dialog title="考勤信息" center :visible.sync="editVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="createform" :model="workAttendanceForm" label-width="80px">
        <el-form-item label="类型">
          <el-input v-model="workAttendanceForm.type" required></el-input>
        </el-form-item>
        <el-form-item label="考勤名称" required>
          <el-input v-model="workAttendanceForm.name"></el-input>
        </el-form-item>
        <el-form-item label="考勤内容" required>
          <el-input type="textarea" :rows="6" v-model="workAttendanceForm.content" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="success" @click="handleConfirm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="考勤设置" center :visible.sync="setVisible" :close-on-click-modal="false" width="40%" :fullscreen="true">
      <setting></setting>
    </el-dialog>
  </div>
</template>

<script>
import setting from './setting.vue';
export default {
  components: {
    setting,
  },
  data() {
    return {
      workAttendanceForm: {
        id: 0,
        type: '',
        name: '',
        content: '',
      },
      queryForm: {
        wAType: '0',
        WAMethod: '0',
        employeeId: '',
        publicationDates: [],
        page: 1,
        row: 10,
      },
      table: {
        workAttendanceList: [
          {
            id: '1',
            EmployeeId: 'luo',
            employeeName: 'luoguoshun',
            departmentName: '技术部门',
            wAType: 1,
            wATypeStr: '下班',
            wAMethod: 1,
            wAMethodStr: '打卡',
            wALocation: '广州市天河区',
            Longitude: 123.22,
            Latitude: 158,
            isOutRange: 0,
            status: 3,
            createdTime: '2023-3-22 18:00:00',
            remark: '',
          },
        ],
        total: 0,
      },
      editVisible: false,
      setVisible: false,
      dicIds: [],
      editType: '',
    };
  },
  methods: {
    loadData() {
      this.getworkAttendanceList();
    },
    /**
     * @description: 重置搜索条件
     */
    resetQueryForm() {
      this.queryForm.row = 10;
      this.queryForm.page = 1;
      this.queryForm.conditions = '';
      this.loadData();
    },
    //获取考勤数据
    async getworkAttendanceList() {
      await this.$api.workAttendance.getworkAttendanceList(this.queryForm).then((res) => {
        const { data, count, message } = res.data;
        if (!data) {
          console.log(message);
          return;
        } else {
          this.table.workAttendanceList = data;
          this.table.total = count;
        }
      });
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
    //打开添加弹窗弹窗
    handleOpenDialog(type, row) {
      if (type == 'add') {
        this.editType = 'add';
        this.workAttendanceForm.id = 0;
        this.workAttendanceForm.type = '';
        this.workAttendanceForm.name = '';
        this.workAttendanceForm.content = '';
      } else if (type == 'update') {
        this.editType = 'update';
        this.workAttendanceForm.id = row.id ?? 0;
        this.workAttendanceForm.type = row.type ?? '';
        this.workAttendanceForm.name = row.name ?? '';
        this.workAttendanceForm.content = row.content ?? '';
      } else {
        return;
      }
      this.editVisible = true; //打开添加弹窗
    },
    //添加考勤数据
    addworkAttendance() {
      this.$api.workAttendance.addworkAttendance(this.workAttendanceForm).then((res) => {
        const { data, resultType } = res.data;
        if (!data) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.dialogObject.createVisible = false;
          this.loadData();
        }
      });
    },
    //修改考勤数据
    updateDicsByName() {
      this.$api.workAttendance.updateDicsByName([this.workAttendanceForm]).then((res) => {
        console.log(res);
        const { data, resultType } = res.data;
        if (!data) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },
    handleConfirm() {
      if (this.workAttendanceForm.type == '') {
        this.$message({ message: '请填写类型', type: 'info' });
        return;
      }
      if (this.workAttendanceForm.name == '') {
        this.$message({ message: '请填写考勤名称', type: 'info' });
        return;
      }
      if (this.workAttendanceForm.content == '') {
        this.$message({ message: '请填写考勤内容', type: 'info' });
        return;
      }
      if (this.editType == 'add') {
        this.addworkAttendance();
      } else if (this.editType == 'update') {
        this.updateDicsByName();
      }
    },
    //获取选中行的数据
    selectRows(selection) {
      this.dicIds = [];
      selection.forEach((element) => {
        this.dicIds.push(element.id);
      });
    },
    //删除考勤
    deleteDicById() {
      if (this.dicIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.workAttendance.deleteByIds(this.dicIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error(message);
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    getTagType(status) {
      switch (status) {
        case 1:
          return {
            type: 'warning',
            text: '迟到',
          };
        case 2:
          return {
            type: 'warning',
            text: '早退',
          };
        case 3:
          return {
            type: 'success',
            text: '正常',
          };
        default:
          return {
            type: '',
            text: '',
          };
      }
    },
    handleOpenSettingDialog() {
      this.setVisible = true;
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.wa-container {
  width: 100%;
  height: 100%;
  .editbar {
   margin-bottom: 10px;
  }
}
</style>
