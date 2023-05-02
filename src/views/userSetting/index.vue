<!--
 * @LastEditTime: 2023-05-02 14:00:14
 * @Descripttion: 个人设置
-->
<template>
  <div id="info">
    <el-row class="updatePwd-from">
      <el-col :span="10">
        <el-form ref="updateForm" :model="updateForm" :rules="updatePwdRules"  label-width="100px" status-icon>
          <el-form-item label="原密码" prop="oldPwd" required>
            <el-input type="password" v-model="updateForm.oldPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd" required>
            <el-input type="password" v-model="updateForm.newPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd" required>
            <el-input type="password" v-model="updateForm.confirmPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePwd('updateForm')">提交</el-button>
            <el-button @click="resetForm('updateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    var checkOldPwd = (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    var checkNewPwd = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.updateForm.newPws !== '') this.$refs.updateForm.validateField('checkconfirmPwd');
        callback();
      }
    };
    var checkconfirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.updateForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      updateForm: {
        userId: '',
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
      updatePwdRules: {
        oldPwd: [{ validator: checkOldPwd, trigger: 'blur' }],
        newPwd: [{ validator: checkNewPwd, trigger: 'blur' }],
        confirmPwd: [{ validator: checkconfirmPwd, trigger: 'blur' }],
      },
    };
  },
  methods: {
    //修改密码
    updatePwd(updateForm) {
      this.$refs[updateForm].validate((valid) => {
        if (valid) {
          this.$api.employee
            .updatePwd(this.updateForm.userId, this.updateForm.oldPwd, this.updateForm.newPwd)
            .then((res) => {
              const { data, resultType, message } = res.data;
              if (resultType && resultType == 1) {
                this.$message({
                  message: '修改成功!',
                  type: 'success',
                  center: true,
                });
              } else {
                this.$message({
                  message: message,
                  type: 'warning',
                  center: true,
                });
              }
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  created() {
    this.updateForm.userId = this.$store.getters['user/userInfo']['employeeId'];
  },
};
</script>

<style lang="less" scoped>
#info {
  .updatePwd-from {
  }
}
</style>
