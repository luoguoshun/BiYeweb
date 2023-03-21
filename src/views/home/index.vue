<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
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
          <p>上次登录时间：<span>2019-10-20</span></p>
          <p>上次登录地点：<span>北京</span></p>
        </div>
      </el-card>
      <el-card style="height: 460px; margin-top: 20px">
        <el-table :data="tableData">
          <el-table-column show-overflow-tooltip v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card shadow="hover" v-for="item in countData" :key="item.name" :body-style="{ display: 'flex', padding: 0 }">
          <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
          <div class="detail">
            <p class="num">￥ {{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover" style="height: 350px;">
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
var wHMaterialStatistics; //全局变量:仓库物资统计
import * as echarts from 'echarts';
export default {
  data() {
    return {
      userImg: require('../../assets/images/user.png'),
      countData: [
        {
          name: '今日支付订单',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9',
        },
        {
          name: '今日收藏订单',
          value: 210,
          icon: 'star-on',
          color: '#ffb980',
        },
        {
          name: '今日未支付订单',
          value: 1234,
          icon: 's-goods',
          color: '#5ab1ef',
        },
        {
          name: '本月支付订单',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9',
        },
        {
          name: '本月收藏订单',
          value: 210,
          icon: 'star-on',
          color: '#ffb980',
        },
        {
          name: '本月未支付订单',
          value: 1234,
          icon: 's-goods',
          color: '#5ab1ef',
        },
      ],
      tableData: [],
      tableLabel: {
        name: '课程',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总购买',
      },
    };
  },
  computed: {
    ...mapGetters({ userInfo: 'userInfo/getUserInfo' }),
  },
  methods: {
    gethomeData() {
      this.$api.mock.gethomeData().then((res) => {
        res = res.data;
        this.tableData = res.data.tableData;
      });
    },
    //初始化 仓库物资 成本统计
    initWHStatistics() {
      var chartDom1 = document.getElementById('wHmaterialStatistics');
      wHMaterialStatistics = echarts.init(chartDom1);
      var chartDom2 = document.getElementById('wHCostStatistics');
      wHCostStatistics = echarts.init(chartDom2);
      //#region
      // this.$api.warehouse.warehouseStatistics().then((res) => {
      //   const { data, success, message } = res.data;
      //   if (!success) {
      //     console.log(message);
      //     return;
      //   }
      //   wHMaterialStatistics.setOption({
      //     title: {
      //       text: '仓库物资统计',
      //       left: 'center',
      //     },
      //     tooltip: {
      //       trigger: 'item',
      //     },
      //     legend: {
      //       orient: 'vertical',
      //       left: 'left',
      //     },
      //     series: [
      //       {
      //         name: 'Access From',
      //         type: 'pie',
      //         radius: '50%',
      //         data: data.goodsCountStatistics,
      //         emphasis: {
      //           itemStyle: {
      //             shadowBlur: 10,
      //             shadowOffsetX: 0,
      //             shadowColor: 'rgba(0, 0, 0, 0.5)',
      //           },
      //         },
      //       },
      //     ],
      //   });
      //   wHCostStatistics.setOption({
      //     title: {
      //       text: '仓库成本统计',
      //       left: 'center',
      //     },
      //     tooltip: {
      //       trigger: 'item',
      //     },
      //     legend: {
      //       orient: 'vertical',
      //       left: 'left',
      //     },
      //     series: [
      //       {
      //         name: 'Access From',
      //         type: 'pie',
      //         radius: '50%',
      //         data: data.totalCostStatistics,
      //         emphasis: {
      //           itemStyle: {
      //             shadowBlur: 10,
      //             shadowOffsetX: 0,
      //             shadowColor: 'rgba(0, 0, 0, 0.5)',
      //           },
      //         },
      //       },
      //     ],
      //   });
      // });
      //#endregion
    },
    //初始化部门人数统计
    initDeptCountStatistics() {
      let chartDom = document.getElementById('deptCountStatistics');
      let myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'bottom',
        // },
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
          }
        ],
      };
      myChart.setOption(option);
    },
  },
  created() {
    this.gethomeData();
  },
  mounted() {
    this.initDeptCountStatistics();
    this.initotnerCountStatistics();
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
