<template>
  <div id="workAttendance">
    <el-row>
      <el-col class="left" :span="6">
        <h3><el-tag type="warning">当前设置</el-tag></h3>
        <el-row>
          <el-col :span="24"> 经度:{{ center.lng }} </el-col>
          <el-col :span="124"> 维度:{{ center.lat }} </el-col>
          <el-col :span="24"> 位置:{{ address }} </el-col>
          <el-col :span="24">
            <el-time-select
              placeholder="上班考勤时间设置"
              v-model="shangbanTime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '20:00',
              }"
            >
            </el-time-select>
          </el-col>
          <el-col :span="24">
            <el-time-select
              placeholder="下班考勤时间设置"
              v-model="xiabanTime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '20:00',
              }"
            >
            </el-time-select>
          </el-col>
          <el-col :span="24">
            <el-button size="small" :span="6" @click="setLocation">应用</el-button>
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
import { checkField } from '@/utils/util';
import { monthTime } from '@/utils/timeFormat';
export default {
  computed: {},
  data() {
    return {
      center: { lng: 0, lat: 0 }, //定位
      zoom: 3, //缩放等级
      keyword: '',
      location: '',
      address: '',
      infoWindowShow: false,
      shangbanTime: '',
      xiabanTime: '',
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
      // this.location = target.dh;
      this.center.lng = point.lng;
      this.center.lat = point.lat;

      const myGeo = new BMap.Geocoder(); // 创建地址解析器的实例
      myGeo.getLocation(point, (rs) => {
        let adr = rs.addressComponents;
        this.address = adr.province + adr.city + adr.district + adr.street + adr.streetNumber; // 省市区街道门牌号
        this.infoWindowShow = true;
      });
    },
    /**
     * @description: 定位成功后触发此事件
     * @param {*} point 坐标
     * @param {*} AddressComponent
     * @param {*} marker
     */
    locationSuccessHandle({ point, AddressComponent, marker }) {
      console.log('🚀 ~ file: index.vue:75 ~ locationSuccessHandle ~ marker:', marker);
      console.log(AddressComponent);
      this.center.lng = point.lng;
      this.center.lat = point.lat;
    },
    /**
     * @description: 获取当前位置
     */
    getCurrentPosition() {
      const _this = this;
      var geolocation = new BMapGL.Geolocation();
      geolocation.getCurrentPosition(function (res) {
        console.log(res);
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          const province = res.address.province;
          const city = res.address.city;
          const district = res.address.district;
          const street = res.address.street;
          const street_number = res.address.street_number;
          _this.address = province + city + district + street + street_number;
          _this.center.lng = res.longitude;
          _this.center.lat = res.latitude;
        }
      });
    },
    /**
     * @description: 设置考勤位置
     */
    setLocation() {
      if (!this.address || this.address == '') {
        this.$message({ message: '请选择考勤地点', type: 'warning' });
        return;
      }
      if (!this.shangbanTime || this.shangbanTime == '') {
        this.$message({ message: '请设置上班考勤时间', type: 'warning' });
        return;
      }
      if (!this.xiabanTime || this.xiabanTime == '') {
        this.$message({ message: '请设置下班考勤时间', type: 'warning' });
        return;
      }
      const keyArray = [
        { type: 'SystemSettings', name: '考勤地点', content: this.address },
        { type: 'SystemSettings', name: '上班打卡时间', content: this.shangbanTime },
        { type: 'SystemSettings', name: '下班打卡时间', content: this.xiabanTime },
        { type: 'SystemSettings', name: '考勤位置经度', content: this.center.lng.toString() },
        { type: 'SystemSettings', name: '考勤位置纬度', content: this.center.lat.toString() },
      ];
      this.$api.dictionary.updateDicsByName(keyArray).then((res) => {
        let { data, message, resultType } = res.data;
        if (resultType == 2) {
          console.error(message);
          return;
        } else {
          this.$message({ message: '设置成功！', type: 'success' });
        }
      });
    },
  },
  created() {
    this.$api.dictionary.getDictionaryByName('上班').then((res) => {
      const { data, resultType, message } = res.data;
      if (resultType == 2) {
        console.error(message);
        return;
      }
      this.shangbanTime = data.content;
    });
    this.$api.dictionary.getDictionaryByName('下班').then((res) => {
      const { data, resultType, message } = res.data;
      if (resultType == 2) {
        console.error(message);
        return;
      }
      this.xiabanTime = data.content;
    });
    this.$api.dictionary.getDictionaryByName('考勤地点').then((res) => {
      const { data, resultType, message } = res.data;
      if (resultType == 2) {
        console.error(message);
        return;
      }
      this.address = data.content;
    });
    this.$api.dictionary.getDictionaryByName('经度').then((res) => {
      const { data, resultType, message } = res.data;
      if (resultType == 2) {
        console.error(message);
        return;
      }
      this.lng = parseFloat(data.content);
    });
    this.$api.dictionary.getDictionaryByName('纬度').then((res) => {
      const { data, resultType, message } = res.data;
      if (resultType == 2) {
        console.error(message);
        return;
      }
      this.lat = parseFloat(data.content);
    });
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
