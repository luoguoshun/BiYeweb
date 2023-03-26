<template>
  <div class="notice">
    <el-row class="editbar">
      <el-col :span="14">
        <el-button type="primary" size="mini" class="el-icon-check" @click="OpenAddMessageDiolog()">新建</el-button>
        <el-button type="danger " size="mini" class="el-icon-check" @click="deletetMessage()">删除</el-button>
      </el-col>
      <el-col :span="3">
        <el-select size="mini" v-model="queryForm.messageType" placeholder="消息类型">
          <el-option :value="0" label="所有类型"></el-option>
          <el-option :value="1" label="消息发送"></el-option>
          <el-option :value="2" label="个人通知"></el-option>
          <el-option :value="3" label="数据统计"></el-option>
          <el-option :value="4" label="系统通知"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" style="margin-right: 5px">
        <el-input size="mini" label-width="80px" placeholder="请输入关键字" v-model="queryForm.conditions"></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="getMessageList()" size="mini">查找</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="" ref="MessageTable" :data="table.MessageList">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="messageId" label="消息编号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>消息编号: {{ scope.row.messageId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.messageId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="messageState" label="状态编号" v-if="false"> </el-table-column>
      <el-table-column prop="messageStateStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.messageStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="messageType" label="消息类型" align="center"> </el-table-column>
      <el-table-column prop="receiverId" label="接收人" align="center" width="100px"> </el-table-column>
      <el-table-column prop="sendTime" label="接收时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.sendTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="senderId" label="发送人" align="center" width="100px"> </el-table-column>
      <el-table-column prop="title" label="抬头" align="center"> </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.sendTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" align="center"> </el-table-column>
      <el-table-column prop="messageParameter" label="消息参数" align="center" v-if="true">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openMessageParameter(scope.row.messageParameter)" plain>查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title="新建消息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="addMessageForm" label-width="100px">
        <el-form-item label="发送人">
          <el-input v-model="addMessageForm.senderName" disabled></el-input>
        </el-form-item>
        <el-form-item label="发送人Id" v-if="false">
          <el-input v-model="addMessageForm.senderId" disabled></el-input>
        </el-form-item>
        <el-form-item label="消息类型">
          <el-select size="mini" v-model="addMessageForm.messageType" placeholder="消息类型">
            <el-option :value="1" label="消息发送"></el-option>
            <el-option :value="2" label="个人通知"></el-option>
            <el-option :value="3" label="数据统计"></el-option>
            <el-option :value="4" label="系统通知"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收人" prop="receiverId" v-if="addMessageForm.messageType == 2">
          <el-select v-model="addMessageForm.receiverId" filterable placeholder="请选择接收人">
            <el-option v-for="item in userList" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addMessageForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addMessageForm.content" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addMessage()">新建消息</el-button>
      </div>
    </el-dialog>
    <!-- 消息参数对话框 -->
    <el-dialog title="消息参数" :visible.sync="MessageParameterDialog.visible" center width="40%">
      <el-descriptions class="margin-top" title="详细信息" :column="1">
        <el-descriptions-item label="处理编号">{{ MessageParameterDialog.instanceId }}</el-descriptions-item>
        <el-descriptions-item label="是否处理">{{ MessageParameterDialog.isHandle }}</el-descriptions-item>
        <el-descriptions-item label="目标路由">{{ MessageParameterDialog.targetRouterName }}</el-descriptions-item>
        <el-descriptions-item label="文本提示">{{ MessageParameterDialog.text }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store';
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        messageType: 0,
      },
      addMessageForm: {
        senderId: '',
        senderName: '', //发送人
        title: '',
        receiverId: '', //接收人
        messageType: '通知',
        content: '',
      },
      table: {
        MessageList: [],
        total: 0,
      },
      MessageIds: [],
      dialogObject: {
        addVisible: false,
        updateVisible: false,
      },
      userList: [],
      MessageParameterDialog: {
        visible: false,
        instanceId: '',
        isHandle: true,
        targetRouterName: '',
        text: '',
      },
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getMessageList();
    },
    //获取所有消息列表
    async getMessageList() {
      await this.$api.message.getMessageList(this.queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.MessageList = data.message;
        this.table.total = data.count;
      });
    },
    //新建消息
    async addMessage() {
      const from = {
        Title: this.addMessageForm.title,
        SenderId: this.addMessageForm.senderId,
        ReceiverId: this.addMessageForm.receiverId,
        Content: this.addMessageForm.content,
        MessageType: this.addMessageForm.messageType,
        MessageParameter: '',
      };
      await this.$api.message.addMessage(from).then((res) => {
        const { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error('新建失败');
        } else {
          this.$message({ message: '新建成功', type: 'success' });
          this.dialogObject.addVisible = false;
          this.loadData();
        }
      });
    },
    //删除消息
    async deletetMessage() {
      if (this.MessageIds.length == 0) {
        this.$message({
          message: '请选择要删除的消息信息',
          type: 'warning',
        });
        return false;
      } else {
        await this.$api.message.deleteMessage(this.MessageIds).then((res) => {
          const { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败');
          } else {
            this.$message({ message: '删除成功', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //获取用户信息
    async getUserList() {
      await this.$api.employee.getUserList(1, 100, '', '').then((res) => {
        const { data, success, message } = res.data;
        if (!data) {
          return;
        }
        this.userList = data;
      });
    },
    openMessageParameter(row) {
      if (row.messageParameter != '' && row.messageParameter != undefined) {
        const messageParameter = JSON.parse(row.messageParameter);
        this.MessageParameterDialog.instanceId = messageParameter.InstanceId;
        this.MessageParameterDialog.isHandle = messageParameter.IsHandle;
        this.MessageParameterDialog.targetRouterName = messageParameter.TargetRouterName;
        this.MessageParameterDialog.text = messageParameter.Text;
      }
      this.MessageParameterDialog.visible = true;
    },
    getElTagClass(row) {
      if (row.orderStateStr == '待编辑') {
        return 'success';
      } else if (row.orderStateStr == '已完成') {
        return 'warning';
      } else {
        return '';
      }
    },
    selectRows(selection) {
      this.MessageIds = [];
      selection.forEach((element) => {
        this.MessageIds.push(element.messageId);
      });
    },
    //打开新建弹窗
    OpenAddMessageDiolog() {
      this.addMessageForm.senderName = store.getters['user/userInfo'].name;
      this.addMessageForm.senderId = store.getters['user/userInfo'].userId;
      this.dialogObject.addVisible = true;
    },
    handleSizeChange(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.page = 1;
      this.queryForm.row = 10;
      this.queryForm.messageType = 0;
      this.queryForm.conditions = '';
      this.loadData();
    },
  },
  created() {
    this.loadData();
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.notice {
  height: 100%;
  width: 100%;
  .editbar {
    margin-bottom: 10px;
  }
}
</style>
