<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
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
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column label="名称" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="账户" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row.id)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增界面-->
    <el-dialog
      title="新增学校"
      :visible.sync="addFormVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入学校名称"></el-input>
        </el-form-item>
        <el-form-item label="学校编号" prop="number">
          <el-input v-model="addForm.number" auto-complete="off" placeholder="学校编号，用于打印配送单"></el-input>
        </el-form-item>
        <el-form-item label="登录账户" prop="account">
          <el-input v-model="addForm.account" auto-complete="off" placeholder="请输入登录手机号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="学校备注">
          <el-input v-model="addForm.remark" auto-complete="off" placeholder="请输入学校备注"></el-input>
        </el-form-item>
        <el-form-item label="学校地址">
          <el-input type="textarea" v-model="addForm.address" placeholder="请输入学校地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改学校"
      :visible.sync="updateFormVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="updateForm" label-width="80px" :rules="addFormRules" ref="updateForm">
        <el-input v-model="updateForm.id" style="display:none"></el-input>
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="updateForm.name" auto-complete="off" placeholder="请输入学校名称"></el-input>
        </el-form-item>
        <el-form-item label="学校编号" prop="number">
          <el-input v-model="updateForm.number" auto-complete="off" placeholder="学校编号，用于打印配送单"></el-input>
        </el-form-item>
        <el-form-item label="登录账户" prop="account">
          <el-input v-model="updateForm.account" auto-complete="off" placeholder="请输入登录手机号"></el-input>
        </el-form-item>
        <el-form-item label="学校备注">
          <el-input v-model="updateForm.remark" auto-complete="off" placeholder="请输入学校备注"></el-input>
        </el-form-item>
        <el-form-item label="学校地址">
          <el-input type="textarea" v-model="updateForm.address" placeholder="请输入学校地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="updateFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="updateSubmit" :loading="updateLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addUser, updateUser } from "@/api/table";

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
      list: null,
      listLoading: true,
      addFormVisible: false, //新增界面是否显示
      updateFormVisible: false,
      addLoading: false,
      updateLoading: false,
      //新增界面数据
      addForm: {
        name: "",
        account: "",
        password: "",
        remark: "",
        address: ""
      },
      updateForm: {
        id: "",
        name: "",
        account: "",
        remark: "",
        address: "",
        number:""
      },
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入编号", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 12, message: "请输入正确的手机号码", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "密码长度为3到10个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList({ start: 0, size: 500 }).then(response => {
        console.log(response);
        this.list = response.value.list;
        this.listLoading = false;
      });
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.$refs["addForm"].resetFields();
      this.addForm = {
        name: "",
        account: "",
        password: "",
        remark: "",
        addr: ""
      };
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认添加学校吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let params = Object.assign({}, this.addForm);
            addUser(params).then(res => {
              this.addLoading = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.addFormVisible = false;
              this.fetchData();
            },error => {
              this.addLoading = false;
            });
          });
        }
      });
    },
    //显示编辑界面
    handleUpdate: function(id) {
      console.log("id:" + id);
      this.updateForm.id = id;
      this.updateFormVisible = true;
      if (this.$refs["updateForm"]) {
        this.$refs["updateForm"].resetFields();
      }
      for (var i in this.list) {
        var user = this.list[i];
        if (user.id === id) {
          this.updateForm.name = user.name;
          this.updateForm.account = user.account;
          this.updateForm.remark = user.remark;
          this.updateForm.address = user.address;
          this.updateForm.number = user.number;
        }
      }
    },
    //修改
    updateSubmit: function() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          let params = Object.assign({}, this.updateForm);
          updateUser(params).then(
            res => {
              this.updateLoading = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.updateFormVisible = false;
              this.fetchData();
            },
            error => {
              this.updateLoading = false;
            }
          );
        }
      });
    }
  }
};
</script>
