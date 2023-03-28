<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8">
      <!--shadow属性设置卡片阴影出现的时机-->
      <el-card shadow="hover">
        <div class="user">
          <img :src="userInfo.headerImgUrl" />
          <div class="userinfo">
            <p class="name">{{ userInfo.employeeName }}</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2023-05-10</span></p>
          <p>上次登录地点：<span>桂林市雁山区</span></p>
        </div>
      </el-card>
      <!-- 系统通知 -->
      <el-card style="height: 554px; margin-top: 20px">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="系统通知" name="systemMessage">
            <el-collapse v-model="activeSysMessageId" accordion>
              <el-collapse-item
                v-for="item in systemMessageList"
                :key="item.messageId"
                :name="item.messageId"
              >
                <template slot="title">
                  <h4>{{ item.title }}</h4>
                </template>
                <div class="collapseContent">{{ item.content }}</div>
                <div>
                  <el-button
                    v-if="item.messageParameter"
                    type="warning"
                    size="mini"
                    @click="processEvent(item.messageParameter)"
                    >详情
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="我的消息" name="second">
            <el-collapse v-model="activeMyMessageId" @change="readMessage" accordion>
              <el-collapse-item
                v-for="item in messageList"
                :key="item.messageId"
                :name="item.messageId"
              >
                <template slot="title">
                  <i class="el-icon-chat-dot-round"></i>
                  <h4>{{ item.title }}</h4>
                  <el-badge v-if="item.messageState != 4" is-dot />
                </template>
                <div class="collapseContent">{{ item.content }}</div>
                <div>
                  <el-button
                    v-if="item.messageParameter"
                    type="warning"
                    size="mini"
                    @click="processEvent(item.messageParameter)"
                    >详情
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
    <el-col :span="16">
      <div class="num">
        <el-card
          shadow="hover"
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <i class="icon" :class="item.icon" :style="{ background: item.color }"></i>
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover" style="height: 380px">
        <div id="otnerCountStatistics" :style="{ width: '550px', height: '380px' }"></div>
      </el-card>
      <!-- 考勤统计 -->
      <div class="graph">
        <el-card shadow="hover">
          <div id="toWorkCountStatistics" :style="{ height: '300px' }"></div>
        </el-card>
        <el-card shadow="hover">
          <div id="offWorkCountStatistics" :style="{ height: '300px' }"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
export default {
  data() {
    return {
      countData: [
        {
          name: '今日系统活跃',
          value: 0,
          icon: 'el-icon-star-on',
          color: '#2ec7c9',
        },
        {
          name: '今日打卡',
          value: 0,
          icon: 'el-icon-place',
          color: '#ffb980',
        },
        {
          name: '系统用户',
          value: 0,
          icon: 'el-icon-user-solid',
          color: '#5ab1ef',
        },
      ],
      tableData: [],
      messageList: [],
      systemMessageList: [],
      activeSysMessageId: '',
      activeMyMessageId: '',
      activeName: 'systemMessage',
      data1: [
        { value: 0, name: '打卡' },
        { value: 0, name: '未打卡' },
      ],
      data2: [
        { value: 0, name: '打卡' },
        { value: 0, name: '未打卡' },
      ],
      data3: [
        { product: '迟到', 上班: 0, 下班: 0 },
        { product: '早退', 上班: 0, 下班: 0 },
        { product: '正常', 上班: 0, 下班: 0 },
        { product: '异常', 上班: 0, 下班: 0 },
      ],
    };
  },
  computed: {
    ...mapGetters({ userInfo: 'user/userInfo' }),
  },
  methods: {
    gethomeData() {
      this.$api.mock.gethomeData().then((res) => {
        res = res.data;
        this.tableData = res.data.tableData;
      });
    },
    /**
     * @description: 基础数据统计
     * @return {*}
     */
    initBaseData() {
      try {
        //改变this指向问题
        const _this = this;
        this.$signalR.connectionBuilder.on('SendBaseDataStatistics', function (message) {
          if (message && message.MessageParameter) {
            _this.countData.forEach((item) => {
              if (item.name.indexOf('系统活跃') !== -1) {
                item.value = message.MessageParameter.todayLoginTotal;
              } else if (item.name.indexOf('今日打卡') !== -1) {
                item.value = message.MessageParameter.workAttendanceCount;
              } else if (item.name.indexOf('系统用户') !== -1) {
                item.value = message.MessageParameter.employeeCount;
              }
            });
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    //初始化考勤信息统计
    initClockInCountStatistics() {
      const _this = this;
      //获取dom
      let chartDom = document.getElementById('toWorkCountStatistics'); //上班
      let myChart = echarts.init(chartDom);
      let chartDom1 = document.getElementById('offWorkCountStatistics'); //下班
      let myChart1 = echarts.init(chartDom1);
      let chartDom2 = document.getElementById('otnerCountStatistics'); //柱形图
      let myChart2 = echarts.init(chartDom2);
      //设置数据
      this.$signalR.connectionBuilder.on('SendClockInStatistics', function (message) {
        if (message && message.MessageParameter) {
          message.MessageParameter.data1.forEach((item) => {
            _this.data3.forEach((el) => {
              if (el.product == item.Status) {
                if (item.WATypeStr == '上班') {
                  el.上班 = item.ClockInCount;
                } else if (item.WATypeStr == '下班') {
                  el.下班 = item.ClockInCount;
                }
                return;
              }
            });
          });
          message.MessageParameter.data2.forEach((item) => {
            if (item.WATypeStr == '上班') {
              _this.data1[0].value = item.ClockInCount;
              _this.data1[1].value = item.UnClockInCount;
            } else if (item.WATypeStr == '下班') {
              _this.data2[0].value = item.ClockInCount;
              _this.data2[1].value = item.UnClockInCount;
            }
          });
        }
      });
      myChart.setOption({
        title: {
          text: '今日上班考勤',
          subtext: '统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: _this.data1,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });

      myChart1.setOption({
        title: {
          text: '今日下班考勤',
          subtext: '统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: _this.data2,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });

      myChart2.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '上班', '下班'],
          source: _this.data3,
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }],
      });
    },
    //获取我的消息列表
    async getMessageListByUserId() {
      await this.$api.message.getMessageListByUserId().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.messageList = data;
      });
    },
    //获取系统所有消息列表
    async getSystemMessageList() {
      const query = {
        page: 1,
        row: 10,
        conditions: '',
        messageType: 4,
      };
      await this.$api.message.getMessageList(query).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          return;
        }
        this.systemMessageList = data.message;
      });
    },
    //点开面板 消息被读取
    readMessage(messageId) {
      //展开面板时触发
      if (messageId == '') {
        return;
      }
      //判断是否需要调取接口messageState == 4（已读）则不需要
      for (let i = 0; i < this.messageList.length; i++) {
        let message = this.messageList[i];
        if (message.messageId == messageId && message.messageState == 4) {
          return;
        }
      }
      this.$api.message.readMessage(messageId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        } else {
          this.messageList.forEach((item) => {
            if (item.messageId == messageId) {
              item.messageState = 4;
              return;
            }
          });
        }
      });
    },
  },
  created() {
    this.gethomeData();
    this.getMessageListByUserId();
    this.getSystemMessageList();
    //延迟执行 防止获取不到DOM
    this.$nextTick(() => {
      this.initClockInCountStatistics();
    });
    this.initBaseData();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    // background: linear-gradient(135deg,#17ead9,#6078ea);
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .userinfo {
      .name {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .access {
        color: #999999;
      }
    }
  }
  .login-info {
    background: linear-gradient(135deg, #17ead9, #6078ea);

    p {
      line-height: 28px;
      font-size: px;
      color: #999999;
      text-align: left;
      span {
        color: #666666;
        margin-left: 10px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icon {
      font-size: 30px;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
    }
  }
}
</style>
