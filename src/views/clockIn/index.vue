<template>
  <div id="workAttendance">
    <el-row>
      <el-col :span="6" style="border-right: ">
        <div>
          <el-select
            v-model="wAType"
            @change="checkClockIn()"
            placeholder="考勤类别"
            style="width: 300px; margin-bottom: 10px"
            size="mini"
          >
            <el-option label="上班" value="1"></el-option>
            <el-option label="下班" value="2"></el-option>
          </el-select>
          <div style="width: 300px">
            <p>
              <el-tag type="warning">我的位置</el-tag>
            </p>
            <h3>{{ address }}</h3>
          </div>
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
          <bm-marker
            :position="{ lng: center.lng, lat: center.lat }"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          />
          <!-- 定位 -->
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
            @locationSuccess="locationSuccessHandle"
          ></bm-geolocation>
        </baidu-map>
        <div class="edit">
          <div class="sign" @click="handleSign">{{ tip }}</div>
        </div>
      </el-col>
      <el-col :span="18">
        <el-row class="editbar" style="margin-bottom: 10px">
          <el-col :span="10"> <el-tag>历史纪录 </el-tag></el-col>
          <el-col :span="7">
            <el-date-picker
              v-model="queryForm.publicationDates"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-select size="mini" v-model="queryForm.wAType" placeholder="考勤类别">
              <el-option label="上班" value="1"></el-option>
              <el-option label="下班" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" style="display: flex">
            <el-button type="primary" @click="loadData()" size="mini">查找</el-button>
            <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="table.workAttendanceList" :header-cell-style="{ 'text-align': 'center' }" border="">
          <el-table-column type="selection" width="50" align="center"> </el-table-column>
          <el-table-column prop="id" label="编号" align="center"> </el-table-column>
          <el-table-column prop="employeeName" label="考勤人" width="150" align="center"></el-table-column>
          <el-table-column prop="waTypeStr" label="上班/下班" align="center"></el-table-column>
          <el-table-column prop="waMethodStr" label="考勤方式" align="center"></el-table-column>
          <el-table-column prop="waLocation" label="考勤地点" align="center"></el-table-column>
          <!-- <el-table-column prop="longitude" label="考勤经度" align="center"></el-table-column>
          <el-table-column prop="latitude" label="考勤纬度" align="center"></el-table-column> -->
          <el-table-column prop="isOutRange" label="是否超出范围" align="center">
            <template slot-scope="scope">
              {{ scope.row.isOutRange == 0 ? '否' : '是' }}
            </template>
          </el-table-column>
          <el-table-column prop="distanceTarget" label="距离位置(米)" align="center">
            <template slot-scope="scope">
              {{ scope.row.distanceTarget }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row.status)['type']">
                {{ getTagType(scope.row.status)['text'] }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createdTime" label="考勤日期" align="center">
            <template slot-scope="scope">
              {{ longTime(scope.row.createdTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" fixed="right"></el-table-column>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { checkField } from '@/utils/util';
import { longTime } from '@/utils/timeFormat';
export default {
  computed: {},
  data() {
    return {
      center: { lng: 0, lat: 0 }, //定位
      keyword: '',
      zoom: 10, //缩放等级
      location: '',
      address: '',
      wAType: '1',
      infoWindowShow: false,
      tip: '打卡',
      employeeId: '',
      queryForm: {
        wAType: '',
        employeeId: '',
        publicationDates: [],
        page: 1,
        row: 20,
      },
      table: {
        workAttendanceList: [],
        total: 0,
      },
    };
  },
  methods: {
    longTime,
    //地图组件渲染完毕时触发，返回一个百度地图的核心类和地图实例
    handler({ BMap, map }) {
      //用于描述地图上点的经纬度
      this.getCurrentPosition();
    },
    /**
     * @description: 定位成功后触发此事件
     * @param {*} point 坐标
     * @param {*} AddressComponent
     * @param {*} marker
     */
    locationSuccessHandle({ point, AddressComponent, marker }) {
      const _this = this;
      _this.center.lng = point.lng;
      _this.center.lat = point.lat;
      const myGeo = new BMap.Geocoder(); // 创建地址解析器的实例
      myGeo.getLocation(point, (rs) => {
        let adr = rs.addressComponents;
        this.address = adr.province + adr.city + adr.district + adr.street + adr.streetNumber; // 省市区街道门牌号
        this.infoWindowShow = true;
        _this.$store.commit('baiduMap/setLocation', {
          longitude: point.lng,
          latitude: point.lat,
          address: this.address,
        });
      });
    },
    /**
     * @description: 从Store获取当前位置
     */
    getCurrentPosition() {
      // const _this = this;
      // var geolocation = new BMapGL.Geolocation();
      // geolocation.getCurrentPosition(function (res) {
      //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      //     const province = res.address.province;
      //     const city = res.address.city;
      //     const district = res.address.district;
      //     const street = res.address.street;
      //     const street_number = res.address.street_number;
      //     _this.address = province + city + district + street + street_number;
      //     _this.center.lng = res.longitude;
      //     _this.center.lat = res.latitude;
      //   }
      // });
      this.employeeId = this.$store.getters['user/userInfo'].employeeId;
      this.center.lng = this.$store.getters['baiduMap/longitude'];
      this.center.lat = this.$store.getters['baiduMap/latitude'];
      this.address = this.$store.getters['baiduMap/address'];
    },
    /**
     * @description: 打卡
     */
    handleSign() {
      if (this.tip == '已打卡') {
        this.$message({ message: '您已打卡，请勿重读操作', type: 'warning' });
        return;
      }
      const employeeId = this.$store.getters['user/userInfo'].employeeId;
      const workAttendance = {
        employeeId: employeeId,
        wAType: this.wAType,
        remark: '',
        wAMethod: '1',
        wALocation: this.address,
        Longitude: this.center.lng,
        Latitude: this.center.lat,
      };
      if (!checkField(workAttendance.employeeId)) {
        this.$message({ message: '未获取您的信息', type: 'warning' });
        return;
      }
      if (!checkField(workAttendance.wALocation) || workAttendance.wALocation == 0 || workAttendance.wALocation == 0) {
        this.$message({ message: '未获取位置', type: 'warning' });
        return;
      }
      this.$api.workAttendance.addWorkAttendance(workAttendance).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.$message({ message: '打卡成功', type: 'success' });
          this.tip = '已打卡';
          this.loadData();
        }
      });
    },
    /**
     * @description: 检查今日（上班/下班）是否打卡
     * @return {*}
     */
    checkClockIn() {
      if (!checkField(this.wAType)) {
        this.$message({ message: '请选择考勤类别', type: 'warning' });
        return;
      }
      const employeeId = this.$store.getters['user/userInfo'].employeeId;
      this.$api.workAttendance.checkClockIn(employeeId, this.wAType).then((res) => {
        const { data, message, resultType } = res.data;
        if (!resultType || resultType == 2) {
          this.$message({ message, type: 'error' });
        } else {
          this.tip = data ? '已打卡' : '打卡';
        }
      });
    },
    getTagType(status) {
      switch (status) {
        case 1:
          return {
            type: 'danger',
            text: '迟到',
          };
        case 2:
          return {
            type: 'danger',
            text: '早退',
          };
        case 3:
          return {
            type: 'success',
            text: '正常',
          };
        case 4:
          return {
            type: 'warning',
            text: '异常',
          };
        default:
          return {
            type: '',
            text: '',
          };
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1 || row.status === 2 || row.status === 4) {
        return 'warning-row';
      } else if (row.status === 3) {
        return 'success-row';
      }
      return 'success-row';
    },
    /**
     * @description: 获取考勤数据获取我的考勤数据
     * @return {*}
     */
    async getMyworkAttendanceList() {
      this.queryForm.employeeId = this.$store.getters['user/userInfo'].employeeId;
      await this.$api.workAttendance.getworkAttendanceList(this.queryForm).then((res) => {
        const { data, count, message } = res.data;
        if (!data) {
          console.log(message);
          return;
        } else {
          this.table.workAttendanceList = data;
          this.table.total = count;
        }
      });
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
    resetQueryForm() {
      this.queryForm.row = 10;
      this.queryForm.page = 1;
      this.queryForm.wAType = '';
      this.queryForm.publicationDates = [];
      this.queryForm.conditions = '';
      this.loadData();
    },
  },
  created() {
    this.checkClockIn();
    // this.getCurrentPosition();
    this.getMyworkAttendanceList();
  },
};
</script>

<style lang="less" scoped>
#workAttendance {
  .bm-view {
    margin-top: 10px;
    width: 300px;
    height: 550px;
  }
  .edit {
    margin-top: 10px;
    margin-left: 100px;
  }
  .sign {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5efce8, #736efe);

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
