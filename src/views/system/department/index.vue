<template>
  <div class="role_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openCreateDialog()">添加 </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="table.departmentList" :header-cell-style="{ 'text-align': 'center' }" border="">
      <!-- <el-table-column type="selection" width="50" align="center"> </el-table-column> -->
      <el-table-column prop="departmentId" fixed label="部门编号" align="center"> </el-table-column>
      <el-table-column prop="departmentName" label="部门名称" align="center"></el-table-column>
      <el-table-column prop="leaderName" label="部门主管" align="center"></el-table-column>
      <el-table-column prop="description" label="部门简介" align="center"></el-table-column>
      <el-table-column label="上级部门" align="center"
        ><!---prop="parentId" -->
        <template slot-scope="scope">
          {{ scope.row.parentId == 'D1001' ? '董事部' : '已是最高部门' }}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateDiolog(scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改部门信息信息对话框 -->
    <el-dialog title="部门信息" center :visible.sync="dialogObject.updateVisible" :close-on-click-modal="false" width="55%">
      <el-form ref="departmentForm" :model="departmentForm" label-width="80px">
        <el-form-item label="部门Id">
          <el-input v-model="departmentForm.departmentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="departmentForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="部门主管" prop="leaderId">
          <el-select size="mini" v-model="departmentForm.leaderId" filterable placeholder="请选择员工">
            <el-option v-for="item in userInfo" :key="item.userId" :label="item.name" :value="item.userId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门简介">
          <el-input type="textarea" :rows="6" v-model="departmentForm.description" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="UpdateDepartment()">修 改</el-button>
      </div>
    </el-dialog>

    <!-- 添加部门信息信息对话框 -->
    <el-dialog title="部门信息" center :visible.sync="dialogObject.createVisible" :close-on-click-modal="false" width="55%">
      <el-form ref="departmentForm" :model="departmentForm" label-width="80px">
        <el-form-item label="部门Id">
          <el-input v-model="departmentForm.departmentId"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="departmentForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="部门主管" prop="leaderId">
          <el-select size="mini" v-model="departmentForm.leaderId" filterable placeholder="请选择员工">
            <el-option v-for="item in userInfo" :key="item.userId" :label="item.name" :value="item.userId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门简介">
          <el-input type="textarea" :rows="6" v-model="departmentForm.description" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.createVisible = false">取 消</el-button>
        <el-button type="success" @click="AddDepartment()">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: {
        departmentList: [],
      },
      dialogObject: {
        updateVisible: false,
        createVisible: false,
      },
      queryForm: {
        page: 1,
        row: 100,
        conditions: '',
        roleId: '',
      },
      departmentForm: {
        departmentId: '',
        departmentName: '',
        leaderName: '',
        description: '',
        leaderId: '',
      },

      userInfo: [{ leaderId: '', leaderName: '请选择用户' }],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.GetDepartmentList();
      this.getUserList();
    },
    //获取部门数据
    async GetDepartmentList() {
      await this.$api.department.GetDepartmentList().then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.table.departmentList = data;
      });
    },
    //获取用户数据
    async getUserList() {
      await this.$api.user.GetUserList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.roleId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.userInfo = data.users;
      });
    },
    //打开修改弹窗
    updateDiolog(row) {
      this.departmentForm.departmentId = row.departmentId;
      this.departmentForm.departmentName = row.departmentName;
      this.departmentForm.leaderName = row.leaderName;
      this.departmentForm.description = row.description;
      this.departmentForm.leaderId = row.leaderId;
      this.dialogObject.updateVisible = true;
    },
    //修改部门数据
    UpdateDepartment() {
      const department = {
        departmentId: this.departmentForm.departmentId,
        departmentName: this.departmentForm.departmentName,
        leaderName: this.departmentForm.leaderName,
        description: this.departmentForm.description,
        leaderId: this.departmentForm.leaderId,
      };
      this.$api.department.UpdateDepartment(department).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },

    //打开添加弹窗弹窗
    openCreateDialog() {
      this.dialogObject.createVisible = true; //打开添加弹窗
      this.departmentForm.departmentId = row.departmentId;
      this.departmentForm.departmentName = row.departmentName;
      this.departmentForm.description = row.description;
      this.departmentForm.leaderId = row.leaderId;
    },
    //添加部门数据
    AddDepartment() {
      const department = {
        departmentId: this.departmentForm.departmentId,
        departmentName: this.departmentForm.departmentName,
        description: this.departmentForm.description,
        leaderId: this.departmentForm.leaderId,
      };
      this.$api.department.AddDepartment(department).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.dialogObject.createVisible = false;
          this.loadData();
        }
      });
    },
  },

  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.role_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 2fr 1.1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      div {
        margin-left: 10px;
      }
    }
    .edit_query {
      width: 100%;
      display: grid;
      // border: 1px solid red;
      grid-template-columns: 2fr 2fr 1.5fr;
      grid-column-gap: 5px;
      .edit_query_1 {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
