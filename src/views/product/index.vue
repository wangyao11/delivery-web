<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <template>
            <el-select v-model="classId" clearable="true" placeholder="请选择商品分类">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="fetchData">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="商品名称" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="商品类型" align="center" width="300">
        <template slot-scope="scope">
          <span v-show="scope.row.type==0">斤</span>
          <span v-show="scope.row.type==1">袋</span>
          <span v-show="scope.row.type==2">瓶</span>
          <span v-show="scope.row.type==3">桶</span>
          <span v-show="scope.row.type==4">包</span>
          <span v-show="scope.row.type==5">个</span>
          <span v-show="scope.row.type==6">件</span>
        </template>
      </el-table-column>
      <el-table-column label="商品描述">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增商品"
      :visible.sync="addFormVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option label="斤" value="0"></el-option>
            <el-option label="袋" value="1"></el-option>
            <el-option label="瓶" value="2"></el-option>
            <el-option label="桶" value="3"></el-option>
            <el-option label="包" value="4"></el-option>
            <el-option label="个" value="5"></el-option>
            <el-option label="件" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="classId">
          <el-select v-model="addForm.classId" placeholder="请选择分类">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="addForm.remark" auto-complete="off" placeholder="请输入分类描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList, getClassList, addProduct } from "@/api/product";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      filters: {
        name: ""
      },
      list: null,
      listLoading: true,
      options: [],
      classId: "",
      addFormVisible: false, //新增界面是否显示
      //新增界面数据
      addForm: {
        name: "",
        remark: "",
        classId: "",
        type: ""
      },
      addFormRules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        classId: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ]
      }
    };
  },
  created() {
    const date = new Date();
    date.setTime(date.getTime() + 3600 * 1000 * 24);
    this.startTime = ["2019-09-13", "2019-09-13"];
    this.getUserLabel();
    this.fetchData();
  },
  methods: {
    fetchData() {
      const params = {};

      if (this.classId) {
        params.classId = this.classId;
      }
      this.listLoading = true;
      getProductList(params).then(response => {
        console.log(response);
        this.list = response.value;
        this.listLoading = false;
      });
    },
    getUserLabel() {
      getClassList().then(response => {
        console.log(response);
        this.options = response.value;
      });
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.$refs["addForm"].resetFields();
      this.addForm = {
        name: "",
        remark: "",
        classId: "",
        type: ""
      };
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认添加商品吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let params = Object.assign({}, this.addForm);
            addProduct(params).then(
              res => {
                this.addLoading = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.addFormVisible = false;
                this.fetchData();
              },
              error => {
                this.addLoading = false;
              }
            )
          })
        }
      })
    }
  }
}
</script>
