<template>
  <div class="wa-examine">
    <el-row class="editbar" :gutter="20">
      <el-col :span="11">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="handleOpenDialog()">新增 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteWorkById()"> 移除 </el-button>
      </el-col>
      <el-col :span="5">
        <el-date-picker size="mini" v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-select size="mini" v-model="queryForm.employeeId" filterable placeholder="请选择员工" style="width: 300px">
          <el-option v-for="item in userOptions" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
      </el-col>
      <el-col :span="1"> <el-button type="primary" @click="loadData()" size="mini">查找</el-button> </el-col>
      <el-col :span="1"> <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button></el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="table.examineList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="id" fixed label="编号" width="180" align="center"> </el-table-column>
      <el-table-column prop="employeeName" label="员工" width="150" align="center"></el-table-column>
      <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
      <el-table-column prop="startTime" label="开始考核时间" align="center"></el-table-column>
      <el-table-column prop="endTime" label="结束考核时间" align="center"></el-table-column>
      <el-table-column prop="examineUserName" label="考核人" align="center"></el-table-column>
      <el-table-column prop="workCompletionPercentage" label="工作完成百分比" align="center"></el-table-column>
      <el-table-column prop="workAttendancePercentage" label="考勤完成百分比" align="center"></el-table-column>
      <el-table-column prop="toBeCompleted" label="待完成事项" align="center"> </el-table-column>
      <el-table-column prop="isQualified" label="是否合格" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isQualified == 0" type="success">否</el-tag>
          <el-tag v-else-if="scope.row.isQualified == 1" type="danger">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="examineLevel" label="等级" align="center"> </el-table-column>
      <el-table-column prop="createdTime" label="考核日期" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleOpenDialog(scope.row)" icon="el-icon-edit">考核详情</el-button>
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
    <el-dialog title="新建考核" center :visible.sync="addVisible" :close-on-click-modal="false" width="50%">
      <el-form ref="createform" :model="examine" label-width="80px">
        <el-form-item label="员工" required>
          <el-select v-model="examine.employeeId" filterable placeholder="请选择" style="width: 300px">
            <el-option v-for="item in userOptions" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考勤月份" required>
          <el-date-picker v-model="examine.month" type="month" placeholder="选择月" style="width: 300px"> </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="6" v-model="examine.remark" hidden="50px" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input type="text" v-model="examine.examineLevel" disabled></el-input>
        </el-form-item>
        <el-divider><i class="el-icon-edit-outline">评分</i></el-divider>
        <template>
          <el-row v-for="item in examineDetails" :key="item.id" class="grade">
            <el-form-item :label="item.itemName" required>
              <el-radio-group v-model="item.examineLevel" @input="handleGradeInput">
                <el-radio label="A">优秀</el-radio>
                <el-radio label="B">中等</el-radio>
                <el-radio label="C">合格</el-radio>
                <el-radio label="X">不合格</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="success" @click="handleConfirm()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkField } from '@/utils/util';
export default {
  data() {
    return {
      examine: {
        employeeId: '',
        startTime: '',
        endTime: '',
        month: '',
        examineUserName: '',
        workCompletionPercentage: '',
        workAttendancePercentage: '',
        toBeCompleted: '',
        isQualified: '',
        examineLevel: '',
        createdTime: '',
        remark: '',
        examineDetails: [],
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
        examineList: [
          {
            id: '1',
            employeeId: 'luo',
            employeeName: 'luoguoshun',
            departmentName: '技术部门',
            startTime: '2023-3-22 18:00:00',
            endTime: '2023-3-22 18:00:00',
            examineUserName: '罗国顺',
            workCompletionPercentage: '20%',
            workAttendancePercentage: '20%',
            toBeCompleted: 123.22,
            isQualified: '00',
            examineLevel: 'A',
            createdTime: '2023-3-22 18:00:00',
            remark: '',
            examineDetails: [{}, {}, {}],
          },
        ],
        total: 0,
      },
      editVisible: false,
      addVisible: false,
      workAttendanceIds: [],
      userOptions: [],
      examineDetails: [
        {
          id: '1',
          itemName: '纪律',
          examineLevel: '',
          remark:'',

        },
        {
          id: '2',
          itemName: '工作量',
          examineLevel: '',
          remark:'',
        },
        {
          id: '3',
          itemName: '出勤',
          examineLevel: '',
          remark:'',
        },
      ],
    };
  },
  methods: {
    loadData() {
      // this.getExamineList();
      // this.getUserList();
      // this.getExamineItemList();
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
    //获取考核数据
    async getExamineList() {
      await this.$api.examine.getExamineList(this.queryForm).then((res) => {
        const { data, count, message } = res.data;
        if (!data) {
          return;
        } else {
          this.table.examineList = data;
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
    async getExamineItemList() {
      await this.$api.examineItem.getExamineItemList().then((res) => {
        this.examineDetails = res.data;
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
      if (this.$refs['createform'] !== undefined) this.$refs.form.resetFields();
      this.resettingExamineLevel();
      this.addVisible = true; //打开添加弹窗
    },
    //添加考勤数据
    addworkAttendance() {
      if (!checkField(this.examine.employeeId)) {
        this.$message({ message: '请选择职工', type: 'warning' });
        return;
      }
      if (!checkField(this.examine.startTime)) {
        this.$message({ message: '请选择补入类型', type: 'warning' });
        return;
      }
      if (!checkField(this.examine.endTime)) {
        this.$message({ message: '请选择补卡时间', type: 'warning' });
        return;
      }
      this.examine.examineDetails = [];
      this.examineDetails.forEach((item) => {
        if (checkField(item.examineLevel) == false) {
          return;
        }
        this.examine.examineDetails.push({
          ExamineItemId: item.id,
          ExamineItemName: item.itemName,
          ExamineLevel: item.examineLevel,
          ExamineDate: '',
          Remark: '',
        });
      });
      if (this.examine.examineDetails.length !== this.examineDetails.length) {
        this.$message({ message: '请完成评分', type: 'warning' });
        return;
      }
      this.$api.examine.addWorkAttendance(this.examine).then((res) => {
        const { data, message, resultType } = res.data;
        if (!data) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message, type: 'success' });
          this.dialogObject.createVisible = false;
          this.loadData();
        }
      });
    },
    //修改考勤数据
    updateDicsByName() {
      this.$api.examine.updateDicsByName([this.examine]).then((res) => {
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
        this.$api.examine.deleteWorkAttendances(this.workAttendanceIds).then((res) => {
          let { data, message } = res.data;
          if (!data) {
            this.$message.error(message);
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    handleGradeInput() {},
    //#region 辅助函数
    resettingExamineLevel() {
      this.examineDetails.forEach((item) => {
        if (item.examineLevel) item.examineLevel = '';
      });
    },
    //#endregion
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.wa-examine {
  width: 100%;
  height: 100%;
  .editbar {
    margin-bottom: 10px;
  }
  .grade {
    margin-top: 10px;
  }
}
</style>
