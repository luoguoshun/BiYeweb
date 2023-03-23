<template>
  <div class="dic-container">
    <el-row class="editbar">
      <el-col :span="18">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="handleOpenDialog('add', {})">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteDicById()"> 移除 </el-button>
      </el-col>
      <el-col :span="4">
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
      </el-col>
      <el-col :span="1"> <el-button type="primary" @click="loadData()" size="mini">查找</el-button> </el-col>
      <el-col :span="1"> <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button></el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="table.dictionaryList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="id" fixed label="编号" width="180" align="center"> </el-table-column>
      <el-table-column prop="type" label="类型" width="150" align="center"></el-table-column>
      <el-table-column prop="name" label="字典名称" align="center"></el-table-column>
      <el-table-column prop="content" label="内容" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="Status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            :inactive-value="0"
            :active-value="1"
            active-text="开"
            inactive-text="关"
            active-color="rgb(0, 255, 149)"
            inactive-color="rgb(151, 148, 148)"
            v-model="scope.row.Status"
            @change="updateState(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleOpenDialog('update', scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
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
    <!-- 添加字典信息对话框 -->
    <el-dialog title="字典信息" center :visible.sync="editVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="createform" :model="dictionaryForm" label-width="80px">
        <el-form-item label="类型">
          <el-input v-model="dictionaryForm.type" required></el-input>
        </el-form-item>
        <el-form-item label="字典名称" required>
          <el-input v-model="dictionaryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="字典内容" required>
          <el-input type="textarea" :rows="6" v-model="dictionaryForm.content" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="success" @click="handleConfirm()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dictionaryForm: {
        id: 0,
        type: '',
        name: '',
        content: '',
      },
      queryForm: {
        conditions: '',
        page: 1,
        row: 10,
      },
      table: {
        dictionaryList: [{ id: '1', type: 'system', name: 'haha', content: '8：00', remark: '' }],
        total: 0,
      },
      editVisible: false,
      dicIds: [],
      routerIds: [],
      editType: '',
    };
  },
  methods: {
    //修改字典状态
    updateState(row) {
      this.$api.dictionary.updateStatus(row.id, row.status).then((res) => {
        const { data, message } = res.data;
        if (!data) {
          this.$message({ message: message, type: 'error' });
        } else {
          if (row.state == 1) {
            this.$message({ message: '开启成功！', type: 'success' });
          } else {
            this.$message({ message: '禁用成功！', type: 'success' });
          }
          this.loadData();
        }
      });
    },
    loadData() {
      this.getDictionaryList();
    },
    /**
     * @description: 重置搜索条件
     */
    resetQueryForm() {
      this.queryForm.row = 10;
      this.queryForm.page = 1;
      this.queryForm.conditions = '';
      this.loadData();
    },
    //获取字典数据
    async getDictionaryList() {
      await this.$api.dictionary.getDictionaryList(this.queryForm).then((res) => {
        const { data, count, message } = res.data;
        if (!data) {
          console.log(message);
          return;
        } else {
          this.table.dictionaryList = data;
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
    //打开添加弹窗弹窗
    handleOpenDialog(type, row) {
      if (type == 'add') {
        this.editType = 'add';
        this.dictionaryForm.id = 0;
        this.dictionaryForm.type = '';
        this.dictionaryForm.name = '';
        this.dictionaryForm.content = '';
      } else if (type == 'update') {
        this.editType = 'update';
        this.dictionaryForm.id = row.id ?? 0;
        this.dictionaryForm.type = row.type ?? '';
        this.dictionaryForm.name = row.name ?? '';
        this.dictionaryForm.content = row.content ?? '';
      } else {
        return;
      }
      this.editVisible = true; //打开添加弹窗
    },
    //添加字典数据
    addDictionary() {
      this.$api.dictionary.addDictionary(this.dictionaryForm).then((res) => {
        const { data, resultType } = res.data;
        if (!data) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.dialogObject.createVisible = false;
          this.loadData();
        }
      });
    },
    //修改字典数据
    updateDicsByName() {
      this.$api.dictionary.updateDicsByName([this.dictionaryForm]).then((res) => {
        console.log(res);
        const { data, resultType } = res.data;
        if (!data) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },
    handleConfirm() {
      if (this.dictionaryForm.type == '') {
        this.$message({ message: '请填写类型', type: 'info' });
        return;
      }
      if (this.dictionaryForm.name == '') {
        this.$message({ message: '请填写字典名称', type: 'info' });
        return;
      }
      if (this.dictionaryForm.content == '') {
        this.$message({ message: '请填写字典内容', type: 'info' });
        return;
      }
      if (this.editType == 'add') {
        this.addDictionary();
      } else if (this.editType == 'update') {
        this.updateDicsByName();
      }
    },
    //获取选中行的数据
    selectRows(selection) {
      this.dicIds = [];
      selection.forEach((element) => {
        this.dicIds.push(element.id);
      });
    },
    //删除字典
    deleteDicById() {
      if (this.dicIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.dictionary.deleteByIds(this.dicIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error(message);
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.dic-container {
  width: 100%;
  height: 100%;
  .editbar {
    margin: 5px 0px;
  }
}
</style>
