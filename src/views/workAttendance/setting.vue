<template>
  <div id="workAttendance">
    <el-row>
      <el-col class="left" :span="6">
        <el-row>
          <el-col :span="12"> 当前经度:{{ center.lng }} </el-col>
          <el-col :span="12"> 当前维度:{{ center.lat }} </el-col>
          <el-col :span="12"> 当前位置:{{ location }} </el-col>
          <el-col :span="24">
            <el-time-picker
              v-model="value1"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
              placeholder="上班考勤时间设置"
            >
            </el-time-picker>
          </el-col>
          <el-col :span="24">
            <el-time-picker
              arrow-control
              v-model="value2"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
              placeholder="下班考勤时间设置"
            >
            </el-time-picker>
          </el-col>
          <el-col :span="24">
            <el-button size="small" :span="6" @click="SetLocation">点击设置</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="right" :span="17">
        <el-row :gutter="20" class="serch">
          <el-col :span="6">
            <el-input size="medium" v-model="keyword" prefix-icon="el-icon-search" placeholder="请输入关键词" />
          </el-col>
          <el-col :span="6">
            <el-input size="medium" v-model="location" prefix-icon="el-icon-search" placeholder="请输入地区" />
          </el-col>
        </el-row>
        <!-- 属性说明 -->
        <!-- center：按照经纬度定位；scroll-wheel-zoom：允许滚动缩放； double-click-zoom：是否允许双击缩放-->
        <baidu-map
          class="bm-view"
          :center="center"
          :zoom="zoom"
          @ready="handler"
          :scroll-wheel-zoom="true"
          @dblclick="dblclickMap"
          :double-click-zoom="false"
        >
          <!-- 比例尺 -->
          <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
          <!-- // 缩放控件 -->
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
          <!-- // 地区检索 -->
          <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location"></bm-local-search>
          <!-- // 红点 -->
          <bm-marker :position="{ lng: center.lng, lat: center.lat }" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" />
          <!-- 定位 -->
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
            @locationSuccess="locationSuccessHandle"
          ></bm-geolocation>
        </baidu-map>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios';
import { serverAK } from '@/config/defaultString.js';
export default {
  computed: {},
  data() {
    return {
      center: { lng: 0, lat: 0 }, //定位
      zoom: 3, //缩放等级
      keyword: '',
      location: '',
      value1: '',
      value2: '',
    };
  },
  methods: {
    //地图组件渲染完毕时触发，返回一个百度地图的核心类和地图实例
    handler({ BMap, map }) {
      //用于描述地图上点的经纬度
      this.center.lng = 113.474161;
      this.center.lat = 23.166621;
      this.zoom = 15;
    },
    /**
     * @description: 双击地图触发事件
     * @return {*}
     * @param {*} type 事件类型
     * @param {*} target 目标
     * @param {*} pixel 图上像素点的坐标
     * @param {*} point 坐标(经纬度)
     */
    dblclickMap({ type, target, pixel, point }) {
      console.log('🚀 ~ file: setting.vue:108 ~ dblclickMap ~ target:', target);
      this.center.lng = point.lng;
      this.center.lat = point.lat;
    },
    /**
     * @description: 定位成功后触发此事件
     * @param {*} point 坐标
     * @param {*} AddressComponent
     * @param {*} marker
     */
    locationSuccessHandle({ point, AddressComponent, marker }) {
      console.log('🚀 ~ file: index.vue:75 ~ locationSuccessHandle ~ marker:', marker);
      this.center.lng = point.lng;
      this.center.lat = point.lat;
    },
    /**
     * @description: 获取当前位置
     */
    getCurrentPosition() {
      axios({
        method: 'get',
        url: `https://api.map.baidu.com/location/ip`,
        params: {
          ak: serverAK,
          coor: 'bd09ll',
        },
      }).then(function (res) {
        console.log(res);
      });
    },
    /**
     * @description: 设置考勤位置
     */
    SetLocation() {
      if (this.location || this.location == '') {
        this.$message({ message: '请选择考勤地点', type: 'warning' });
        return;
      }
      if (this.value1 || this.value1 == '') {
        this.$message({ message: '请设置上班考勤时间', type: 'warning' });
        return;
      }
      if (this.value2 || this.value2 == '') {
        this.$message({ message: '请设置下班考勤时间', type: 'warning' });
        return;
      }
      const keyArray = [
        { name: '考勤地点', content: this.location },
        { name: '上班时间', content: this.value1 },
        { name: '下班时间', content: this.value2 },
        { name: '考勤位置经度', content: this.center.lng },
        { name: '考勤位置纬度', content: this.center.lat },
      ];
      this.$api.dictionary.updateByName(keyArray).then((res) => {
        let { data, message } = res.data;
        if (!data) {
          this.$message.error('设置失败！');
        } else {
          this.$message({ message: '设置成功！', type: 'success' });
          this.loadData();
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
#workAttendance {
  .left {
    // margin-left: 10px;
    // border-right: 1px solid rgb(190, 178, 178);
    .el-col {
      margin-top: 10px;
    }
  }
  .right {
    .serch {
      margin-bottom: 10px;
    }
    .bm-view {
      width: 100%;
      height: 550px;
    }
  }
}
</style>
