<template>
  <div id="workAttendance">
    <el-row>
      <el-col :span="5">
        <div>
          <h3>
            <el-tag type="warning">我的位置</el-tag>
            {{ address }}
          </h3>
        </div>
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
        <div class="edit">
          <div class="sign" @click="handleSign">打卡</div>
        </div>
      </el-col>
      <el-col :span="12"> </el-col>
    </el-row>
  </div>
</template>

<script>
import { checkField } from '@/utils/util';
import { longTime } from '@/utils/timeFormat';
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 }, //定位
      keyword: '',
      zoom: 3, //缩放等级
      location: '',
      address: '',
      infoWindowShow: false,
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
    handleSign() {
      const employeeId = this.$store.getters['user/userInfo'].employeeId;
      const workAttendance = {
        employeeId,
        wAType: '1',
        remark: '',
        wAMethod: '1',
        wALocation: this.address,
        Longitude: this.center.lng,
        Latitude: this.center.lat,
      };
      console.log(workAttendance);
      if (!checkField(workAttendance.employeeId)) {
        this.$message({ message: 'c出错了', type: 'warning' });
        return;
      }
      if (!checkField(workAttendance.wAType)) {
        this.$message({ message: '请选择补入类型', type: 'warning' });
        return;
      }
      this.$api.workAttendance.addWorkAttendance(workAttendance).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message, type: 'success' });
          this.editVisible = false;
          this.loadData();
        }
      });
    },
  },
  created() {},
  mounted() {
    this.getCurrentPosition();
  },
};
</script>

<style lang="less" scoped>
#workAttendance {
  .bm-view {
    margin-top: 20px;
    width: 300px;
    height: 550px;
  }
  .edit {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .sign {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #1890ff;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #fff;
    font-size: 30px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }
}
</style>
