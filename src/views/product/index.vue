<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <template>
            <el-select v-model="classId" clearable placeholder="请选择商品分类">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <template>
            <el-input v-model="productName" placeholder="请输入产品名称"></el-input>
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
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <img :src="settings.imageUrl + scope.row.imageUrl" onerror="this.src='/favicon.ico'" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="商品单位" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column label="商品价格" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="商品状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.states==0" type="success">已上架</el-tag>
          <el-tag v-if="scope.row.states==1" type="warning">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品描述">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row.id)" type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.states==0" @click="updateStates(scope.row.id, 1)" type="text" size="small">下架</el-button>
          <el-button v-if="scope.row.states==1" @click="updateStates(scope.row.id, 0)" type="text" size="small">上架</el-button>
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
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            :action="settings.imageUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.imageUrl" :src="settings.imageUrl + addForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="addForm.price" auto-complete="off" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品排序">
          <el-input v-model="addForm.sort" auto-complete="off" placeholder="请输入排序值0-100"></el-input>
        </el-form-item>
        <el-form-item label="商品类别">
          <el-select v-model="addForm.classType" placeholder="请选择类别">
            <el-option v-for="item in classOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="classId">
          <el-select v-model="addForm.classId" placeholder="请选择分类">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品单位" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="addForm.remark" auto-complete="off" placeholder="请输入分类描述"></el-input>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="addForm.manufactureDate" auto-complete="off" placeholder="请输入生产日期"></el-input>
        </el-form-item>
        <el-form-item label="保质期">
          <el-input v-model="addForm.guaranteeDate" auto-complete="off" placeholder="请输入保质期"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改商品"
      :visible.sync="updateFormVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="updateForm" label-width="80px" :rules="addFormRules" ref="updateForm">
        <el-input v-model="updateForm.id" style="display:none"></el-input>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="updateForm.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            :action="settings.imageUpload"
            :show-file-list="false"
            :on-success="handleUpdateSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="updateForm.imageUrl"
              :src="settings.imageUrl + updateForm.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="updateForm.price" auto-complete="off" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品排序">
          <el-input v-model="updateForm.sort" auto-complete="off" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品类别">
          <el-select v-model="updateForm.classType" placeholder="请选择类别">
            <el-option 
              v-for="item in classOptions" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="classId">
          <el-select v-model="updateForm.classId" placeholder="请选择分类">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品单位" prop="type">
          <el-select v-model="updateForm.type" placeholder="请选择类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="updateForm.remark" auto-complete="off" placeholder="请输入分类描述"></el-input>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="updateForm.manufactureDate" auto-complete="off" placeholder="请输入生产日期"></el-input>
        </el-form-item>
        <el-form-item label="保质期">
          <el-input v-model="updateForm.guaranteeDate" auto-complete="off" placeholder="请输入保质期"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="updateFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="updateSubmit" :loading="updateLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
import {
  getProductList,
  getClassList,
  addProduct,
  updateProduct,
  updateStatesById
} from "@/api/product";

import SETTINGS from "@/settings";

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
      settings: SETTINGS,
      imageUrl: "",
      list: null,
      listLoading: true,
      addLoading: false,
      updateLoading: false,
      options: [],
      classOptions:[{
        "id":0,
        "name":"干货"
      },{
        "id":1,
        "name":"生鲜"
      }],
      typeOptions: [
        {value: "斤" },
        {value: "两" },
        {value: "袋" },
        {value: "瓶" },
        {value: "桶" },
        {value: "包" },
        {value: "个" },
        {value: "件" },
        {value: "盒" },
        {value: "盘" }
      ],
      classId: "",
      productName:"",
      addFormVisible: false, //新增界面是否显示
      updateFormVisible: false, //新增界面是否显示
      //新增界面数据
      addForm: {
        name: "",
        price: "",
        remark: "",
        classId: "",
        type: "",
        imageUrl: "",
        manufactureDate:"",
        guaranteeDate:""
      },
      updateForm: {
        id: "",
        name: "",
        price: "",
        remark: "",
        classId: "",
        sort:"",
        classType:"",
        type: "",
        imageUrl: "",
        manufactureDate:"",
        guaranteeDate:""
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
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "change" },
          {
            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
            message: "请输入正确的价格",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    const date = new Date();
    date.setTime(date.getTime() + 3600 * 1000 * 24);
    this.getUserLabel();
    this.fetchData();
  },
  methods: {
    fetchData() {
      const params = {};

      if (this.classId) {
        params.classId = this.classId;
      }
      if (this.productName) {
        params.name = this.productName;
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
      if (this.$refs["addForm"]) {
        this.$refs["addForm"].resetFields();
      }
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
        var product = this.list[i];
        if (product.id === id) {
          this.updateForm.name = product.name;
          this.updateForm.price = product.price;
          this.updateForm.remark = product.remark;
          this.updateForm.type = product.type;
          this.updateForm.sort = product.sort;
          this.updateForm.classType = product.classType;
          this.updateForm.classId = product.classId;
          this.updateForm.imageUrl = product.imageUrl;
          this.updateForm.manufactureDate = product.manufactureDate;
          this.updateForm.guaranteeDate = product.guaranteeDate;
        }
      }
      console.log(this.updateForm);
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
            );
          });
        }
      });
    },
    //修改
    updateSubmit: function() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          let params = Object.assign({}, this.updateForm);
          updateProduct(params).then(
            res => {
              this.updateLoading = false;
              this.$message({
                message: "修改 成功",
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
    },
    handleAvatarSuccess(res, file) {
      this.$set(this.addForm, "imageUrl", res.image);
    },
    handleUpdateSuccess(res, file) {
      this.$set(this.updateForm, "imageUrl", res.image);
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG,jpg,png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    },
    updateStates(id, states) {
      let params = {
        id:id,
        states:states
      }
      updateStatesById(params).then(
        res => {
          this.updateLoading = false;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.fetchData();
        },
        error => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        }
      );
    }
  }
};
</script>

