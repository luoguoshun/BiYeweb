<template>
  <div class="wa-container">
    <el-row class="editbar" :gutter="20">
      <el-col :span="9">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="handleOpenDialog()"
          >补入
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteWorkById()">
          移除
        </el-button>
        <el-button type="success" size="mini" class="el-icon-s-tools" @click="setVisible = true">
          设置
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="queryForm.publicationDates"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-select size="mini" v-model="queryForm.wAType" placeholder="考勤类别">
          <el-option label="上班" value="1"></el-option>
          <el-option label="下班" value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select size="mini" v-model="queryForm.WAMethod" placeholder="考勤方式">
          <el-option label="打卡" value="1"></el-option>
          <el-option label="补入" value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="queryForm.conditions"
          size="mini"
          label-width="80px"
          placeholder="请输入关键字"
        ></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="loadData()" size="mini">查找</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button></el-col
      >
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="table.workAttendanceList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="id" label="编号" align="center"> </el-table-column>
      <el-table-column
        prop="employeeName"
        label="考勤人"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
      <el-table-column prop="waTypeStr" label="上班/下班" align="center"></el-table-column>
      <el-table-column prop="waMethodStr" label="考勤方式" align="center"></el-table-column>
      <el-table-column prop="waLocation" label="考勤地点" align="center"></el-table-column>
      <el-table-column prop="longitude" label="考勤经度" align="center"></el-table-column>
      <el-table-column prop="latitude" label="考勤纬度" align="center"></el-table-column>
      <el-table-column prop="isOutRange" label="是否超出范围" align="center">
        <template slot-scope="scope">
          {{ scope.row.isOutRange == 0 ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column prop="distanceTarget" label="距离位置(米)" align="center">
        <template slot-scope="scope">
          {{ scope.row.distanceTarget}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row.status)['type']">{{
            getTagType(scope.row.status)['text']
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createdTime" label="考勤日期" align="center">
        <template slot-scope="scope">
          {{ longTime(scope.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status !== 3"
            type="success"
            size="mini"
            @click="handleUpdateStatus(scope.row)"
            >标记正常</el-button
          >
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
    <el-dialog
      title="考勤信息"
      center
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form ref="createform" :model="workAttendance" label-width="80px">
        <el-form-item label="员工" required>
          <el-select
            v-model="workAttendance.employeeId"
            filterable
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.employeeId"
              :label="item.employeeName"
              :value="item.employeeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考勤类别" required>
          <el-select v-model="workAttendance.wAType" placeholder="考勤类别" style="width: 300px">
            <el-option label="上班" value="1"></el-option>
            <el-option label="下班" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补卡日期" required>
          <el-date-picker
            v-model="workAttendance.createdTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="6"
            v-model="workAttendance.remark"
            hidden="50px"
            :autosize="{ minRows: 2, maxRows: 6 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="success" @click="handleConfirm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="考勤设置"
      center
      :visible.sync="setVisible"
      :close-on-click-modal="false"
      width="40%"
      :fullscreen="true"
    >
      <setting></setting>
    </el-dialog>
  </div>
</template>

<script>
import setting from './setting.vue';
import { checkField } from '@/utils/util';
import { longTime } from '@/utils/timeFormat';
export default {
  components: {
    setting,
  },
  data() {
    return {
      workAttendance: {
        employeeId: '',
        wAType: '',
        remark: '',
        wAMethod: '2',
        wALocation: '',
        createdTime: '',
      },
      queryForm: {
        wAType: '',
        WAMethod: '',
        employeeId: '',
        publicationDates: [],
        page: 1,
        row: 10,
        conditions:'',
      },
      table: {
        workAttendanceList: [
          // {
          //   id: '1',
          //   EmployeeId: 'luo',
          //   employeeName: 'luoguoshun',
          //   departmentName: '技术部门',
          //   wAType: '1',
          //   wATypeStr: '下班',
          //   wAMethod: '1',
          //   wAMethodStr: '打卡',
          //   wALocation: '广州市天河区',
          //   Longitude: 123.22,
          //   Latitude: 158,
          //   isOutRange: 0,
          //   status: 3,
          //   createdTime: '2023-3-22 18:00:00',
          //   remark: '',
          // },
        ],
        total: 0,
      },
      editVisible: false,
      setVisible: false,
      workAttendanceIds: [],
      userOptions: [],
    };
  },
  methods: {
    longTime,
    loadData() {
      this.getworkAttendanceList();
      this.getUserList();
    },
    /**
     * @description: 重置搜索条件
     */
    resetQueryForm() {
      this.queryForm.row = 10;
      this.queryForm.page = 1;
      this.queryForm.WAMethod = '';
      this.queryForm.wAType = '';
      this.queryForm.publicationDates = [];
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
    //获取用户数据
    async getUserList() {
      await this.$api.employee.getUserList(1, 500, '', '').then((res) => {
        const { data, count } = res.data;
        if (data) {
          this.userOptions = data;
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
    handleOpenDialog() {
      this.workAttendance.id = 0;
      this.workAttendance.type = '';
      this.workAttendance.name = '';
      this.workAttendance.content = '';
      this.editVisible = true; //打开添加弹窗
    },
    //添加考勤数据
    addworkAttendance() {
      if (!checkField(this.workAttendance.employeeId)) {
        this.$message({ message: '请选择职工', type: 'warning' });
        return;
      }
      if (!checkField(this.workAttendance.wAType)) {
        this.$message({ message: '请选择补入类型', type: 'warning' });
        return;
      }
      if (!checkField(this.workAttendance.createdTime)) {
        this.$message({ message: '请选择补卡时间', type: 'warning' });
        return;
      }
      this.$api.workAttendance.addWorkAttendance(this.workAttendance).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message, type: 'success' });
          this.editVisible = false;
          this.loadData();
        }
      });
    },
    //修改考勤数据
    updateDicsByName() {
      this.$api.workAttendance.updateDicsByName([this.workAttendance]).then((res) => {
        const { data, resultType } = res.data;
        if (!data) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.editVisible = false;
          this.loadData();
        }
      });
    },
    handleConfirm() {
      this.addworkAttendance();
    },
    //获取选中行的数据
    selectRows(selection) {
      this.workAttendanceIds = [];
      selection.forEach((element) => {
        this.workAttendanceIds.push(element.id);
      });
    },
    //删除考勤
    deleteWorkById() {
      if (this.workAttendanceIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.workAttendance.deleteWorkAttendances(this.workAttendanceIds).then((res) => {
          let { data, message, resultType } = res.data;
          if (!resultType || resultType == 2) {
            this.$message.error(message);
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //标记为正常
    handleUpdateStatus(row) {
      const work = {
        id: row.id,
        status: 3,
      };
      this.$api.workAttendance.updateStatus(work).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message, type: 'success' });
          this.loadData();
        }
      });
    },
    getTagType(status) {
      switch (status) {
        case 1:
          return {
            type: 'danger',
            text: '迟到',
          };
        case 2:
          return {
            type: 'danger',
            text: '早退',
          };
        case 3:
          return {
            type: 'success',
            text: '正常',
          };
        case 4:
          return {
            type: 'warning',
            text: '异常',
          };
        default:
          return {
            type: '',
            text: '',
          };
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1 || row.status === 2 || row.status === 4) {
        return 'warning-row';
      } else if (row.status === 3) {
        return 'success-row';
      }
      return 'success-row';
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
  .el-table {
    .warning-row {
      background: oldlace;
    }
    .success-row {
      background: #f0f9eb;
    }
  }
}
</style>
