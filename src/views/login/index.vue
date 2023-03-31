<template>
  <div class="login">
    <div class="login-con">
      <div class="info-head">
        <h2>员工考核管理系统</h2>
      </div>
      <!-- 登录信息 -->
      <div class="login-info">
        <el-input
          placeholder="请输入账号"
          prefix-icon="el-icon-user-solid"
          style="width: 70%"
          v-model="loginInfo.account"
        >
        </el-input>
        <el-input
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          show-password
          style="width: 70%"
          v-model="loginInfo.password"
        >
        </el-input>
        <el-button type="primary" @click="login" class="btn">登 录 </el-button>
      </div>
      <!-- 登录信息 -->
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
      setUserInfo: 'user/setUserInfo',
    }),
    login() {
      if (this.validateLoginInfo()) {
        this.$api.login.login(this.loginInfo.account, this.loginInfo.password).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            try {
              this.setTokenInfo(data);
              this.setUserInfo(data.userInfo);
              this.connectionSignalR();
              if (this.$route.query.redirectUrl && this.$route.query.redirectUrl.length > 0) {
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
      if (this.$signalR && !this.$signalR.connectionBuilder['_connectionStarted']) {
        this.$signalR.connectionBuilder.start();
      }
    },
    /**
     * @description: 进入登入界面的时候就去获取地理位置
     */
    getCurrentPosition() {
      const _this = this;
      var geolocation = new BMapGL.Geolocation();
      geolocation.getCurrentPosition(function (res) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          const province = res.address.province;
          const city = res.address.city;
          const district = res.address.district;
          const street = res.address.street;
          const street_number = res.address.street_number;
          const location = {
            longitude: res.longitude,
            latitude: res.latitude,
            address: province + city + district + street + street_number,
          };
          _this.$store.commit('baiduMap/setLocation', location);
        }
      });
    },
  },
  created() {
    this.getCurrentPosition();
  },
};
</script>
<style lang="less" scoped>
.login {
  position: absolute; //绝对定位的参考物是：距离最近的使用了定位的父级，父级都没有使用时找body
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #abdcff, #0396ff);
  .login-con {
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 320px;
    background-color: #ffffff;
    border-radius: 15px;
    .info-head {
      height: 70px;
      line-height: 70px;
      color: #747f89;
      text-align: center;
      box-shadow: 0 2px 8px 0 rgba(99, 99, 99, 0.2);
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
      button {
        width: 70%;
        background: linear-gradient(135deg, #3c8ce7, #00eaff);
        color: #fff;
      }
    }
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
