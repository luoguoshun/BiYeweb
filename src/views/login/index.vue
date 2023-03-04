<template>
  <div class="login">
    <div id="container">
      <div id="output">
        <div class="containerT">
          <div class="login-con">
            <div class="info-head">
              <h2>员工考核管理系统</h2>
            </div>
            <!-- 登录信息 -->
            <div class="login-info">
              <el-input placeholder="请输入账号" prefix-icon="el-icon-user-solid" style="width: 70%" v-model="loginInfo.account"> </el-input>

              <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" show-password style="width: 70%" v-model="loginInfo.password"> </el-input>
              <el-button @click="login" class="btn">登 录 </el-button>
            </div>
            <!-- 登录信息 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import store from '@/store';
export default {
  data() {
    return {
      loginInfo: {
        account: '',
        password: '',
      },
    };
  },
  methods: {
    //将 this.setToken(token) 映射为 this.$store.commit('setToken'，token)
    ...mapMutations({
      setTokenInfo: 'token/setTokenInfo',
      setUserInfo: 'userInfo/setUserInfo',
    }),
    login() {
      if (this.validateLoginInfo()) {
        this.$api.login.login(this.loginInfo.account, this.loginInfo.password).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            try {
              this.setTokenInfo(data);
              // this.setRouters(data.routers);
              this.setUserInfo(data.userInfo);
              // this.connectionSignalR();
              if (this.$route.query.redirectUrl) {
                this.$router.replace(this.$route.query.redirectUrl); //跳转至进入登录页前的路由（重定向）
              } else {
                this.$router.replace('home'); //否则跳转至首页
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            this.$message({
              message: message,
              type: 'error',
              center: true,
            });
          }
        });
      }
    },  
    validateLoginInfo() {
      if (this.loginInfo.account == '') {
        this.$message({
          showClose: true,
          message: '帐号不能为空',
          type: 'warning',
        });
        return false;
      }
      if (this.loginInfo.password == '') {
        this.$message({
          showClose: true,
          message: '密码不能为空',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    connectionSignalR() {
      if (this.$signalR.connection['_connectionState'] == 'Disconnected') {
        this.$signalR.connection.start();
      }
    },
  },
  created() {
    localStorage.removeItem('tokenData');
    localStorage.removeItem('routersData');
    localStorage.removeItem('userInfo');
  },
};
</script>
<style lang="less" scoped>
.login {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .login-con {
    // margin: 15% auto 0 auto;
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 0 5px rgb(158, 158, 158);

    .info-head {
      padding: 0 20px;
      height: 50px;
      line-height: 60px;
      color: #44abf0;
      background-color: #f2f6f9;
      border-radius: 20px 20px 0 0;
    }
    .login-info {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: -24px;
      .el-input {
        margin-bottom: 12px;
        &:nth-child(2) {
          margin-bottom: 20px;
        }
      }
      .el-input__inner {
        width: 100%;
      }
      .el-input__icon {
        height: auto;
      }
      input {
        margin: 0 0 20px 0;
      }
      button {
        width: 70%;
        background-color: #44abf0;
        color: #fff;
      }
    }
  }
  #container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  #output {
    width: 100%;
    height: 100%;
  }
  .prompt {
    width: 60%;
    height: 30px;
    margin: 5px auto;
    text-align: center;
    line-height: 30px;
    font-family: microsoft yahei, Arial, sans-serif;
    font-size: 13px;
    color: #df0000;
  }
  .containerT {
    width: 500px;
    height: 300px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 45%;
    margin: -150px 0 0 -200px;
    border-radius: 3px;
  }
  .containerT h1 {
    font-size: 18px;
    font-family: microsoft yahei, Arial, sans-serif;
    -webkit-transition-duration: 1s;
    transition-duration: 1s;
    -webkit-transition-timing-function: ease-in-put;
    transition-timing-function: ease-in-put;
    font-weight: 500;
  }
}
</style>
