<template>
  <div class="wa-examine">
    <el-row class="editbar" :gutter="20">
      <el-col :span="11">
        <el-button
          type="primary"
          size="mini"
          class="el-icon-folder-add"
          @click="handleOpenDialog({}, 'add')"
          >新增
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteWorkById()">
          移除
        </el-button>
        <el-button type="info" size="mini" class="el-icon-question" @click="helpVisible = true">
          帮助
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          size="mini"
          v-model="queryForm.publicationDates"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-select
          size="mini"
          v-model="queryForm.employeeId"
          filterable
          placeholder="请选择员工"
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
      :data="table.examineList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="id" label="编号" align="center"> </el-table-column>
      <el-table-column prop="statusStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">{{ scope.row.statusStr }}</el-tag>
          <el-tag v-if="scope.row.status == 2">{{ scope.row.statusStr }}</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 4">{{ scope.row.statusStr }}</el-tag>
          <!-- <el-tag type="danger">标签五</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="employeeName"
        label="员工"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
      <el-table-column prop="startTime" label="开始考核时间" align="center"></el-table-column>
      <el-table-column prop="endTime" label="结束考核时间" align="center"></el-table-column>
      <el-table-column prop="examineUserName" label="考核人" align="center"></el-table-column>
      <el-table-column
        prop="workCompletionPercentage"
        label="工作完成百分比"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="workAttendancePercentage"
        label="考勤完成百分比"
        align="center"
      ></el-table-column>
      <el-table-column prop="toBeCompleted" label="待完成事项" align="center"> </el-table-column>
      <el-table-column prop="isQualified" label="是否合格" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isQualified == 0" type="danger">否</el-tag>
          <el-tag v-else-if="scope.row.isQualified == 1" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="examineLevel" label="总等级" align="center"> </el-table-column>
      <el-table-column prop="examineScore" label="得分" align="center"> </el-table-column>
      <el-table-column prop="createdTime" label="考核日期" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.status == 1"
            @click="(e) => updateExamineStatus(scope.row, 2)"
            >提交</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.status == 2"
            @click="(e) => updateExamineStatus(scope.row, 3)"
            >撤销</el-button
          >
          <el-button
            size="mini"
            type="warning"
            v-if="scope.row.status == 2"
            @click="(e) => updateExamineStatus(scope.row, 4)"
            >生效</el-button
          >
          <el-button size="mini" type="success" v-if="scope.row.status == 3" disabled
            >已撤销</el-button
          >
          <el-button size="mini" type="success" v-if="scope.row.status == 4" disabled
            >已生效</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleOpenDialog(scope.row, 'detail')"
            icon="el-icon-edit"
            >考核详情</el-button
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
    <!-- 新建考核 -->
    <el-dialog
      title="新建考核"
      center
      :visible.sync="addVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="createform" :model="examine" label-width="100px">
        <el-form-item label="员工" required>
          <el-select
            v-model="examine.employeeId"
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
        <el-form-item label="考勤月份" required>
          <el-date-picker
            v-model="examine.month"
            type="month"
            placeholder="选择月"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="6"
            v-model="examine.remark"
            hidden="50px"
            :autosize="{ minRows: 2, maxRows: 6 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input type="text" v-model="examine.examineLevel" disabled></el-input>
        </el-form-item>
        <el-divider><i class="el-icon-edit-outline">评分</i></el-divider>
        <template>
          <el-row v-for="item in examineItemList" :key="item.id" class="grade">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="item.itemName" required>
                  <el-radio-group v-model="item.examineLevel" @input="handleGradeInput">
                    <el-radio label="A">A</el-radio>
                    <el-radio label="B">B</el-radio>
                    <el-radio label="C">C</el-radio>
                    <el-radio label="D">D</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="说明">
                  <el-input type="text" size="mini" v-model="item.remark"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="success" @click="handleConfirm()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 考核详情 -->
    <el-dialog
      title="考核详情"
      center
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="detailform" :model="examine" label-width="80px">
        <el-form-item label="员工" required>
          <el-select
            v-model="examine.employeeId"
            filterable
            placeholder="请选择"
            style="width: 300px"
            disabled
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
        <el-form-item label="考勤月份" required>
          <el-date-picker
            v-model="examine.month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
            style="width: 300px"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="6"
            v-model="examine.remark"
            hidden="50px"
            :autosize="{ minRows: 2, maxRows: 6 }"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input type="text" v-model="examine.examineLevel" disabled></el-input>
        </el-form-item>
        <el-divider><i class="el-icon-edit-outline">评分</i></el-divider>
        <template>
          <el-row v-for="item in examine.examineDetails" :key="item.id" class="grade">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="item.itemName" required>
                  <el-radio-group v-model="item.examineLevel" @input="handleGradeInput">
                    <el-radio label="A">A</el-radio>
                    <el-radio label="B">B</el-radio>
                    <el-radio label="C">C</el-radio>
                    <el-radio label="D">D</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="说明">
                  <el-input type="text" size="mini" v-model="item.remark"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="success" @click="handleConfirm()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 评价标准 -->
    <el-drawer title="评分标准" :visible.sync="helpVisible" direction="rtl" size="45%">
      <el-table :data="gradeData">
        <el-table-column property="level" label="等级" width="60"></el-table-column>
        <el-table-column property="score" label="对应分值" width="100"></el-table-column>
        <el-table-column property="description" label="分量化类目标等级描述"></el-table-column>
      </el-table>
      <el-divider>总等级说明</el-divider>
      <el-row style="margin-top: 10px">
        <el-col :span="2"> <el-tag size="small">等级A</el-tag></el-col>
        <el-col :span="22">总得分/总分值>=90%</el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="2"> <el-tag size="small">等级B</el-tag></el-col>
        <el-col :span="22">总得分/总分值>=75% && &lt; 90% </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="2"> <el-tag size="small">等级C</el-tag></el-col>
        <el-col :span="22">总得分/总分值>=60% && &lt; 75%</el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="2"> <el-tag size="small">等级D</el-tag></el-col>
        <el-col :span="22">总得分/总分值&lt;60%</el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { checkField } from '@/utils/util';
import { gradeData } from '@/store/enums/system';
import { monthTime } from '@/utils/timeFormat';
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
        examineScore: 0,
        remark: '',
        examineDetails: [],
      },
      queryForm: {
        conditions: '',
        employeeId: '',
        publicationDates: [],
        page: 1,
        row: 10,
      },
      table: {
        examineList: [
          //#region
          // {
          // id: '1',
          // employeeId: 'luo',
          // employeeName: 'luoguoshun',
          // departmentName: '技术部门',
          // startTime: '2023-3-22 18:00:00',
          // endTime: '2023-3-22 18:00:00',
          // month: '2023-3',
          // examineUserName: '罗国顺',
          // workCompletionPercentage: '20%',
          // workAttendancePercentage: '20%',
          // toBeCompleted: 123.22,
          // isQualified: '00',
          // examineLevel: 'A',
          // examineScore: 12,
          // createdTime: '2023-3-22 18:00:00',
          // remark: '',
          // status: '1',
          // statusStr: '保存',
          // examineDetails: [
          //   // {
          //   //   id: '1',
          //   //   itemName: '纪律',
          //   //   examineLevel: 'A',
          //   //   remark: 'q',
          //   // },
          //   // {
          //   //   id: '2',
          //   //   itemName: '工作量',
          //   //   examineLevel: 'A',
          //   //   remark: 'q',
          //   // },
          //   // {
          //   //   id: '3',
          //   //   itemName: '出勤',
          //   //   examineLevel: 'A',
          //   //   remark: 'q',
          //   // },
          // ],
          // },
          //#endregion
        ],
        total: 0,
      },
      editVisible: false,
      addVisible: false,
      helpVisible: false,
      examineIds: [],
      userOptions: [],
      examineItemList: [],
      gradeData,
    };
  },
  methods: {
    loadData() {
      this.getExamineList();
      this.getUserList();
      this.getExamineItemList();
    },
    /**
     * @description: 重置搜索条件
     */
    resetQueryForm() {
      this.queryForm.row = 10;
      this.queryForm.page = 1;
      this.queryForm.conditions = '';
      this.queryForm.employeeId = '';
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
        this.examineItemList = res.data;
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
    handleOpenDialog(row, key) {
      switch (key) {
        case 'add':
          if (this.$refs['createform'] !== undefined) {
            this.$refs['createform'].resetFields();
          }
          this.resettingExamineLevel();
          this.addVisible = true; //打开添加弹窗
          break;
        case 'delete':
        default:
        case 'detail':
          this.examine = { ...row };
          this.editVisible = true; //打开添加弹窗
          break;
      }
    },
    //添加考勤数据
    addWorkAttendance() {
      if (!checkField(this.examine.employeeId)) {
        this.$message({ message: '请选择职工', type: 'warning' });
        return;
      }
      if (!checkField(this.examine.examineLevel)) {
        this.$message({ message: '请选择考核等级', type: 'warning' });
        return;
      }
      if (!checkField(this.examine.month)) {
        this.$message({ message: '请选择考核时间', type: 'warning' });
        return;
      }
      this.examine.examineDetails = [];
      this.examineItemList.forEach((item) => {
        if (checkField(item.examineLevel) == false) {
          return;
        }
        this.examine.examineDetails.push({
          ExamineItemId: item.id,
          ExamineItemName: item.itemName,
          ExamineLevel: item.examineLevel,
          Remark: item.remark,
        });
      });
      console.log(this.examine.examineDetails);
      if (this.examine.examineDetails.length !== this.examineItemList.length) {
        this.$message({ message: '请完成评分', type: 'warning' });
        return;
      }
      this.examine.isQualified = this.examine.examineLevel == 'D' ? '0' : '1';
      this.examine.month = monthTime(this.examine.month);
      this.$api.examine.addExamine(this.examine).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message, type: 'success' });
          this.addVisible = false;
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
      this.addWorkAttendance();
    },
    //获取选中行的数据
    selectRows(selection) {
      this.examineIds = [];
      selection.forEach((element) => {
        this.examineIds.push(element.id);
      });
    },
    //删除考勤
    deleteWorkById() {
      if (this.examineIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        let IsOk = true;
        this.examineIds.forEach((el) => {
          if (!IsOk) {
            return;
          }
          this.table.examineList.forEach((item) => {
            if (item.id == el && item.status == 4) {
              IsOk = false;
              return;
            }
          });
        });
        // if (!IsOk) {
        //   this.$message.error('不可删除已经生效的考核单');
        //   return;
        // }
        this.$api.examine.deleteWorkById(this.examineIds).then((res) => {
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
    /**
     * @description: 修改状态
     * @return {*}
     * @param {*} row 记录
     * @param {*} status 要修改的状态
     */
    updateExamineStatus(row, status) {
      this.$confirm('是否继续操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.examine.updateExamineStatus(row.id, status).then((res) => {
          let { data, message } = res.data;
          if (!data) {
            this.$message.error(message);
          } else {
            this.$message({ message, type: 'success' });
            this.loadData();
          }
        });
      });
    },
    /**
     * @description: 选中等级计算分值
     */
    handleGradeInput() {
      let amount = 0;
      this.examine.examineScore = 0;
      this.examineItemList.forEach((item) => {
        amount += 4;
        switch (item.examineLevel) {
          case 'A':
            this.examine.examineScore += 4;
            break;
          case 'B':
            this.examine.examineScore += 3;
            break;
          case 'C':
            this.examine.examineScore += 2;
            break;
          case 'D':
            this.examine.examineScore += 1;
            break;
        }
      });
      let levelRatio = this.examine.examineScore / amount;
      if (levelRatio >= 0.9) {
        this.examine.examineLevel = 'A';
      } else if (levelRatio >= 0.75 && levelRatio < 0.9) {
        this.examine.examineLevel = 'B';
      } else if (levelRatio >= 0.6 && levelRatio < 0.75) {
        this.examine.examineLevel = 'C';
      } else if (levelRatio < 0.6) {
        this.examine.examineLevel = 'D';
      }
    },
    //#region 辅助函数
    resettingExamineLevel() {
      this.examine.examineLevel = '';
      this.examine.employeeId = '';
      this.examine.month = '';
      this.examine.startTime = '';
      this.examine.endTime = '';
      this.examine.isQualified = '';
      this.examineItemList.forEach((item) => {
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
