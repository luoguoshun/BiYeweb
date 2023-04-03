<template>
  <div class="user_container">
    <!-- 操作 -->
    <el-row class="edit_query">
      <el-col :span="4">
        <el-select v-model="value" clearable placeholder="请选择宿舍楼">
          <el-option value="A1" label="A1"></el-option>
          <el-option value="A2" label="A2"></el-option>
          <el-option value="A3" label="A3"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入学号/姓名" v-model="queryForm.conditions" clearable> </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="loadData()" size="small">查找</el-button>
        <el-button icon="el-icon-refresh" @click="resetQueryForm()" size="small">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="edit_operate">
      <el-button type="primary" size="small" plain>主要按钮</el-button>
      <el-button type="success" size="small" plain>成功按钮</el-button>
      <el-button type="info" size="small" plain>信息按钮</el-button>
      <el-button type="warning" size="small" plain>警告按钮</el-button>
      <el-button type="danger" size="small" plain>危险按钮</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="table.studentList"
      @row-dblclick="handleEdit"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <!-- <el-table-column type="selection" width="40" align="center"> </el-table-column> -->
      <el-table-column fixed prop="studentId" label="编号" width="120px" align="center"> </el-table-column>
      <el-table-column label="证件照" width="100" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 50px"
            :src="scope.row.headerImgUrl"
            :preview-src-list="[scope.row.headerImgUrl]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="管理员名" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="60px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1"> 男 </span>
          <span v-else-if="scope.row.sex == 2"> 女 </span>
        </template>
      </el-table-column>
      <el-table-column prop="speciality" label="专业" align="center"> </el-table-column>
      <el-table-column prop="dormitoryId" label="宿舍楼" align="center"> </el-table-column>
      <el-table-column prop="dormitoryRoomId" label="宿舍号" align="center"> </el-table-column>
      <el-table-column prop="address" label="住址" align="center"> </el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center"> </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            :inactive-value="0"
            :active-value="1"
            active-color="rgb(0, 255, 149)"
            inactive-color="rgb(151, 148, 148)"
            v-model="scope.row.status"
            @change="updateUserstatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <!-- 修改管理员信息对话框 -->
    <el-dialog
      title="管理员信息"
      center
      :visible.sync="dialogObject.updateVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="updateform" :model="studentForm" label-width="80px">
        <el-form-item label="证件照">
          <img :src="studentForm.headerImgUrl" width="100" height="100" />
          <el-upload ref="upload" action="" :http-request="uploadUserHeaderImg" :auto-upload="false" :limit="1">
            <el-button slot="trigger" size="small" type="primary"> 选取文件 </el-button>
            <el-button style="margin-left: 10px" size="small" type="success" @click="$refs.upload.submit()"
              >上传到服务器</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员名称"> <el-input v-model="studentForm.name"></el-input> </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="studentForm.sex" size="mini">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="studentForm.departmentId" filterable placeholder="请选择部门">
            <el-option
              v-for="item in dormitoryList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="role in roleTypes" :label="role.roleId" :key="role.roleId">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input type="text" v-model="studentForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="studentForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="update()">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加管理员信息对话框 -->
    <el-dialog
      title="管理员信息"
      center
      :visible.sync="dialogObject.addVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :model="studentForm" :rules="rules" ref="studentForm" label-width="80px">
        <el-form-item label="管理员Id" prop="studentId">
          <el-input v-model="studentForm.studentId"></el-input>
        </el-form-item>
        <el-form-item label="管理员名" prop="name">
          <el-input v-model="studentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="studentForm.sex" size="mini">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="studentForm.departmentId" filterable placeholder="请选择部门">
            <el-option
              v-for="item in dormitoryList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="studentForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="studentForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addUser()">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { leaveTime } from '@/utils/timeFormat';
export default {
  data() {
    // 验证手机号的规则
    const cheackMobile = (rule, value, callback) => {
      // 手机号一般最小以“13”开头
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error('请输入合法的手机号!'));
    };
    //身份证校验
    const cheackIdNumber = (rule, value, callback) => {
      var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子
      var arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; //校验码
      if (/^\d{17}\d|x$/i.test(value)) {
        var sum = 0,
          idx;
        for (var i = 0; i < value.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        if (arrValid[idx] == value.substr(17, 1).toUpperCase()) {
          callback();
        } else {
          callback('身份证格式有误');
        }
      } else {
        callback('身份证格式有误');
      }
    };
    //检查管理员编号是否存在
    const cheackUserId = (rule, value, callback) => {
      const regUserId = /^[A-Za-z0-9]+$/;
      if (!regUserId.test(value)) {
        return callback(new Error('管理员id由英文和数字组成!'));
      } else {
        this.$api.student.checkUserExists(value).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            return callback();
          }
          callback(new Error('管理员Id重复!'));
        });
      }
    };
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        roleId: '',
      },
      table: {
        studentList: [],
        total: 0,
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
        uploadNoteVisible: false,
      },
      studentForm: {
        studentId: '',
        name: '',
        headerImgUrl: '',
        sex: 1,
        IdNumber: '',
        address: '',
        phone: '',
        status: 0,
        dormitoryId: '',
        dormitoryRoomId: '',
        speciality:'',
      },
      roleTypes: [],
      rules: {
        name: [
          //^[\u4e00-\u9fa5]{0,}$ 纯汉字
          { required: true, message: '姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2到 8 个字符', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' },
        ],
        idCardNumber: [
          { required: true, message: '身份证不能为空', trigger: 'blur' },
          { validator: cheackIdNumber, trigger: 'blur' },
        ],
        studentId: [
          { required: true, message: '管理员Id不能为空', trigger: 'change' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
          { validator: cheackUserId, trigger: 'blur' },
        ],
      },
      dormitoryList: [],
      options: [],
      search: { current: 1, size: 6 },
      noteFileList: [],
    };
  },
  methods: {
    leaveTime,
    //导入数据
    importClients(param) {
      if (param.file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.xlsx 的文件',
        });
      } else {
        const formdata = new FormData();
        formdata.append('file', param.file);
        this.$api.book.importBooks(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: message, type: 'error' });
          } else {
            this.dialogObject.updateVisible = false;
            this.$message({ message: '导入成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    loadData() {
      this.getStudentList();
    },
    //获取管理员数据
    async getStudentList() {
      await this.$api.student
        .getStudentList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.roleId)
        .then((res) => {
          const { data, count } = res.data;
          if (data) {
            this.table.studentList = data;
            this.table.total = count;
          }
          console.log(data);
        });
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.roleId = '';
      this.loadData();
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
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
      this.studentForm.studentId = '';
      this.studentForm.name = '';
      this.studentForm.sex = 1;
      this.studentForm.address = '';
      this.studentForm.phone = '';
      this.studentForm.dormitoryId = '';
      this.studentForm.dormitoryRoomId = '';
      this.studentForm.speciality = '';
    },
    //添加新管理员
    add() {
      this.$refs['studentForm'].validate((valid) => {
        if (valid) {
          const Student = {
            studentId: this.studentForm.studentId,
            name: this.studentForm.name,
            sex: this.studentForm.sex,
            address: this.studentForm.address,
            phone: this.studentForm.phone,
            departmentId: this.studentForm.departmentId,
          };
          this.$api.student.add(Student).then((res) => {
            const { data, message, resultType } = res.data;
            if (!resultType || resultType == 2) {
              this.$message({ message, type: 'error' });
              return;
            }
            this.$message({ message, type: 'success' });
            this.dialogObject.addVisible = false;
            this.loadData();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //上传管理员头像
    uploadUserHeaderImg(param) {
      if (
        param.file.type != 'image/png' &&
        param.file.type != 'image/gif' &&
        param.file.type != 'image/jpg' &&
        param.file.type != 'image/jpeg'
      ) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.png .gif .jpg .jpeg的图片',
        });
      } else if (param.file.size / 1024 / 1024 / 2 > 10) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于10M',
        });
      } else {
        //创建FormData对象(键值对集合) 将模型存在FormData中
        const formdata = new FormData();
        formdata.append('file', param.file);
        formdata.append('studentId', this.studentForm.studentId);
        this.$api.student.uploadUserHeadImg(formdata).then((res) => {
          const { data, message, resultType } = res.data;
          if (!resultType || resultType == 2) {
            this.$message({ message: message, type: 'error' });
            return;
          } else {
            this.dialogObject.updateVisible = false;
            this.$message({ message, type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开修改弹窗
    handleEdit(row) {
      this.dialogObject.updateVisible = true;
    },
    handleDelete(row) {
      this.$api.student.delete(row.studentId).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message: ' 删除成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },
    //修改管理员数据
    update() {
      const Student = {
        studentId: this.studentForm.studentId,

        phone: this.studentForm.phone,
        address: this.studentForm.address,
        sex: this.studentForm.sex,
        name: this.studentForm.name,
        departmentId: this.studentForm.departmentId,
      };
      this.$api.student.delete(Student).then((res) => {
        const { data, message } = res.data;
        if (!data) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },
    //修改管理员状态
    updateUserstatus(row) {
      this.$api.student.updateUserstatus(row.studentId, row.status).then((res) => {
        const { data, message } = res.data;
        if (!data) {
          this.$message({ message, type: 'error' });
        } else {
          if (row.status == 1) {
            this.$message({ message: '开启成功！', type: 'success' });
          } else {
            this.$message({ message: '禁用成功！', type: 'success' });
          }
          this.loadData();
        }
      });
    },
    openuploadNoteDialog(row) {
      this.dialogObject.uploadNoteVisible = true;
      this.studentForm = { ...row };
    },
    //上传简历
    uploadUserNote(param) {
      if (
        param.file.name.indexOf('docx') == -1 &&
        param.file.name.indexOf('doc') == -1 &&
        param.file.name.indexOf('pdf') == -1
      ) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.docx .doc .pdf 的文件',
        });
      } else if (param.file.size / 1024 / 1024 / 2 > 10) {
        this.$notify.warning({
          title: '警告',
          message: '文件大小必须小于10M',
        });
      } else {
        //创建FormData对象(键值对集合) 将模型存在FormData中
        const formdata = new FormData();
        formdata.append('file', param.file);
        formdata.append('studentId', this.studentForm.studentId);
        this.$api.student.uploadUserNote(formdata).then((res) => {
          const { data, message } = res.data;
          if (!data) {
            this.$message({ message: message, type: 'error' });
            return;
          } else {
            this.dialogObject.updateVisible = false;
            this.$message({ message, type: 'success' });
            this.loadData();
          }
        });
      }
    },
  },
  created() {
    // this.loadData();
  },
};
</script>

<style lang="less" scoped>
.user_container {
  width: 100%;
  .edit_query {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    > .el-col {
      display: flex;
      font-size: 16px;
      color: #606266;
      margin-right: 5px;
    }
  }
}
</style>
