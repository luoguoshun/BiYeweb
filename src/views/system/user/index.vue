<template>
  <div class="user_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteUsers()"> 移除 </el-button>
      </div>
      <div class="edit_query">
        <el-select size="mini" v-model="queryForm.roleId" placeholder="请选择角色类别">
          <el-option
            v-for="item in roleTypes"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          ></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        <el-button type="primary" @click="loadData()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.userList"
      @row-dblclick="openUpdateDiolog"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <el-table-column type="selection" width="40" align="center"> </el-table-column>
      <el-table-column fixed prop="employeeId" label="编号" width="120px" align="center"> </el-table-column>
      <el-table-column label="证件照" width="100" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 50px"
            :src="scope.row.headerImgUrl"
            :preview-src-list="[scope.row.headerImgUrl]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="职工名" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.employeeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="60px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1"> 男 </span>
          <span v-else-if="scope.row.sex == 2"> 女 </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="idNumber" label="身份证号码"  align="center"> </el-table-column> -->
      <el-table-column prop="departmentName" label="部门名称" align="center"> </el-table-column>
      <el-table-column prop="address" label="住址" align="center"> </el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center"> </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleNames }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ leaveTime(scope.row.createTime) }}
          <!-- {{ scope.row.createTime }} -->
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            :inactive-value="0"
            :active-value="1"
            active-color="rgb(0, 255, 149)"
            inactive-color="rgb(151, 148, 148)"
            v-model="scope.row.status"
            @change="updateUserState(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="noteSrc" label="简历" align="center" width="200px">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.noteSrc == null || scope.row.noteSrc == ''"
            type="primary"
            @click="openuploadNoteDialog(scope.row)"
            size="mini"
          >
            上传简历
          </el-button>
          <el-button v-else type="primary" @click="openuploadNoteDialog(scope.row)" size="mini"> 重新上传 </el-button>
          <el-button
            v-if="scope.row.noteSrc !== '' && scope.row.noteSrc != null"
            type="primary"
            @click="notePreview(scope.row)"
            size="mini"
          >
            预览
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="openUpdateDiolog(scope.row)">查看</el-button>
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
    <!-- 修改职工信息对话框 -->
    <el-dialog
      title="职工信息"
      center
      :visible.sync="dialogObject.updateVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="updateform" :model="userForm" label-width="80px">
        <el-form-item label="证件照">
          <img :src="userForm.headerImgUrl" width="100" height="100" />
          <el-upload ref="upload" action="" :http-request="uploadUserHeaderImg" :auto-upload="false" :limit="1">
            <el-button slot="trigger" size="small" type="primary"> 选取文件 </el-button>
            <el-button style="margin-left: 10px" size="small" type="success" @click="$refs.upload.submit()"
              >上传到服务器</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="职工名称"> <el-input v-model="userForm.employeeName"></el-input> </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userForm.sex" size="mini">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="userForm.departmentId" filterable placeholder="请选择部门">
            <el-option
              v-for="item in departmentList"
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
          <el-input type="text" v-model="userForm.phone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="省区">
          <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange"> </el-cascader>
        </el-form-item> -->
        <el-form-item label="地址">
          <el-input type="text" v-model="userForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="updateUserInfo()">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加职工信息对话框 -->
    <el-dialog
      title="职工信息"
      center
      :visible.sync="dialogObject.addVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px">
        <el-form-item label="职工Id" prop="employeeId">
          <el-input v-model="userForm.employeeId"></el-input>
        </el-form-item>
        <el-form-item label="职工名" prop="employeeName">
          <el-input v-model="userForm.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userForm.sex" size="mini">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="userForm.departmentId" filterable placeholder="请选择部门">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="userForm.phone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="省区">
          <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange"> </el-cascader>
        </el-form-item> -->
        <el-form-item label="地址">
          <el-input type="text" v-model="userForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addUser()">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 简历上传 -->
    <el-dialog
      title="简历上传"
      center
      :visible.sync="dialogObject.uploadNoteVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-upload class="upload-demo" drag action="" :http-request="uploadUserNote" :file-list="noteFileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload></el-dialog
    >
    <el-dialog
      title="简历预览"
      center
      :visible.sync="dialogObject.notepreviewVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <pdf ref="pdf" v-for="i in numPages" :key="i" :src="noteSrc" :page="i"></pdf>
    </el-dialog>
  </div>
</template>

<script>
import { leaveTime } from '@/utils/timeFormat';
import pdf from 'vue-pdf';
export default {
  components: {
    pdf,
  },
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
    //检查职工编号是否存在
    const cheackUserId = (rule, value, callback) => {
      const regUserId = /^[A-Za-z0-9]+$/;
      if (!regUserId.test(value)) {
        return callback(new Error('职工id由英文和数字组成!'));
      } else {
        this.$api.employee.checkUserExists(value).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            return callback();
          }
          callback(new Error('职工Id重复!'));
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
        userList: [],
        total: 0,
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
        uploadNoteVisible: false,
        notepreviewVisible: false,
      },
      userForm: {
        employeeId: '',
        employeeName: '',
        headerImgUrl: '',
        sex: 1,
        IdNumber: '',
        address: '',
        phone: '',
        roleIds: '',
        state: 0,
        departmentId: '',
        areadata: '',
      },
      roleIds: [],
      userIds: [],
      roleTypes: [],
      rules: {
        employeeName: [
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
        employeeId: [
          { required: true, message: '职工Id不能为空', trigger: 'change' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
          { validator: cheackUserId, trigger: 'blur' },
        ],
      },
      departmentList: [],
      options: [],
      selectedOptions: [],
      // provinceAndCity,
      search: { current: 1, size: 6 },
      noteFileList: [],
      numPages: '', //pdf总页数
      noteSrc: '',
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
      this.getUserList();
    },
    //获取职工数据
    async getUserList() {
      await this.$api.employee
        .getUserList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.roleId)
        .then((res) => {
          const { data, count } = res.data;
          if (data) {
            this.table.userList = data;
            this.table.total = count;
          }
          console.log(data);
        });
    },
    //获取角色列表
    async getRoleList() {
      await this.$api.role.getRoleList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.roleTypes = data;
      });
    },
    //获取部门列表
    async getDepartmentList() {
      await this.$api.department.getDepartmentList().then((res) => {
        const { data, message } = res.data;
        if (!data) {
          console.log(message);
          return;
        }
        this.departmentList = data;
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
    //获取选中行的数据
    selectRows(selection) {
      this.userIds = [];
      selection.forEach((element) => {
        this.userIds.push(element.employeeId);
      });
    },
    //删除职工
    deleteUsers() {
      if (this.userIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.employee.deleteUsersById(this.userIds).then((res) => {
          let { data, success, message } = res.data;
          if (!data) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
      this.userForm.employeeId = '';
      this.userForm.employeeName = '';
      this.userForm.sex = 1;
      this.userForm.address = '';
      this.userForm.phone = '';
      this.roleIds = [];
      this.userForm.departmentId = '';
    },
    //添加新职工
    addUser() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          const user = {
            employeeId: this.userForm.employeeId,
            employeeName: this.userForm.employeeName,
            sex: this.userForm.sex,
            address: this.userForm.address,
            phone: this.userForm.phone,
            roleIds: this.roleIds,
            departmentId: this.userForm.departmentId,
          };
          this.$api.employee.addUser(user).then((res) => {
            const { data, success, message } = res.data;
            if (!data) {
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
    //上传职工头像
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
        formdata.append('employeeId', this.userForm.employeeId);
        this.$api.employee.uploadUserHeadImg(formdata).then((res) => {
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
    //打开修改弹窗
    openUpdateDiolog(row) {
      this.userForm = { ...row };
      if (this.userForm.roleIds) {
        this.roleIds = this.userForm.roleIds.split('、');
      } else {
        this.roleIds = [];
      }
      this.dialogObject.updateVisible = true;
    },
    //修改职工数据
    updateUserInfo() {
      const user = {
        employeeId: this.userForm.employeeId,
        roleIds: this.roleIds,
        phone: this.userForm.phone,
        address: this.userForm.address,
        sex: this.userForm.sex,
        employeeName: this.userForm.employeeName,
        departmentId: this.userForm.departmentId,
      };
      this.$api.employee.updateUser(user).then((res) => {
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
    //修改职工状态
    updateUserState(row) {
      this.$api.employee.updateUserState(row.employeeId, row.status).then((res) => {
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
      this.userForm = { ...row };
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
        formdata.append('employeeId', this.userForm.employeeId);
        this.$api.employee.uploadUserNote(formdata).then((res) => {
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
    //在线预览简历
    notePreview(row) {
      this.dialogObject.notepreviewVisible = true;
      this.noteSrc = row.noteSrcUrl;
      if (this.noteSrc.indexOf('pdf')) {
        let loadingTask = pdf.createLoadingTask(row.noteSrcUrl);
        loadingTask.promise
          .then((pdf) => {
            this.numPages = pdf.numPages;
          })
          .catch((err) => {
            console.error('pdf 加载失败', err);
          });
      }
    },
    //#region
    // //地址框选择触发
    // handleChange(value) {
    //   this.search.province = '';
    //   this.search.city = '';
    //   this.search.district = '';
    //   for (var k = 0, lengthk = provinceAndCity.length; k < lengthk; k++) {
    //     //确定省
    //     if (provinceAndCity[k].code == value[0]) {
    //       this.search.province = provinceAndCity[k].name;
    //       if (provinceAndCity[k].cityList && value.length >= 2 && value[1] != '') {
    //         for (var i = 0, lengthi = provinceAndCity[k].cityList.length; i < lengthi; i++) {
    //           //确定市
    //           if (provinceAndCity[k].cityList[i].code == value[1] || provinceAndCity[k].cityList.length == 1) {
    //             this.search.city = provinceAndCity[k].cityList[i].name;
    //             //确定区
    //             if (provinceAndCity[k].cityList[i].areaList && value.length == 3 && value[2] != '') {
    //               for (var j = 0, lengthj = provinceAndCity[k].cityList[i].areaList.length; j < lengthj; j++) {
    //                 if (provinceAndCity[k].cityList[i].areaList[j].code == value[2]) {
    //                   this.search.district = provinceAndCity[k].cityList[i].areaList[j].name;
    //                   break;
    //                 }
    //               }
    //             }
    //             break;
    //           }
    //         }
    //       }
    //       break;
    //     }
    //   }
    //   this.userForm.areadata = '';
    //   this.userForm.areadata = this.search.province + this.search.city + this.search.district;
    // },
    //#endregion
  },
  created() {
    this.loadData();
    this.getRoleList();
    this.getDepartmentList();
  },
};
</script>

<style lang="less" scoped>
.user_container {
  width: 100%;
  // height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      width: 100%;
      display: grid;
      //  border: 1px solid red;
      grid-template-columns: 2fr 2fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
    }
  }
}
</style>
