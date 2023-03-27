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
      <el-card style="height: 460px; margin-top: 20px">
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
      <el-card shadow="hover" style="height: 350px">
        <div id="otnerCountStatistics" :style="{ width: '550px', height: '300px' }"></div>
      </el-card>
      <div class="graph">
        <el-card shadow="hover">
          <div id="deptCountStatistics" :style="{ height: '300px' }"></div>
        </el-card>
        <el-card shadow="hover"> </el-card>
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
    //初始化考勤信息统计
    initClockInCountStatistics() {
      let chartDom = document.getElementById('deptCountStatistics');
      let myChart = echarts.init(chartDom);
      this.$signalR.connectionBuilder.on('SendBaseDataStatistics', function (message) {
        if (message && message.MessageParameter) {
          console.log(message.MessageParameter);
        }
      });

      let option = {
        title: {
          text: '今日考勤',
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
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    initotnerCountStatistics() {
      let chartDom = document.getElementById('otnerCountStatistics');
      let myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: 'Stacked Line',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Email', 'Union Ads'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };
      myChart.setOption(option);
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
    /**
     * @description: 基础数据统计
     * @return {*}
     */
    initBaseData() {
      try {
        //改变this指向问题
        const _this = this;
        this.$signalR.connectionBuilder.on('SendDataStatistics', function (message) {
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
  },
  created() {
    this.gethomeData();
    this.getMessageListByUserId();
    this.getSystemMessageList();
  },
  mounted() {
    this.initClockInCountStatistics();
    this.initotnerCountStatistics();
    this.initBaseData();
  },
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
