<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="fetchData"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="userId" clearable placeholder="请选择学校" @change="selectUser">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="classType" clearable placeholder="请选择类别" @change="selectUser">
            <el-option v-for="item in classOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @change="selectUser">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" v-print="'#printMe'">打印</el-button> -->
          <el-button type="primary" @click.native="addFormVisible = true">打印</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddProduct">手动补充商品</el-button>
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
      <el-table-column align="center" label="名称" width="300">
        <template slot-scope="scope">{{ scope.row.productName }}</template>
      </el-table-column>
      <el-table-column label="单位" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.productType }}</template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="添加时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="deleteById(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button @click="showUpdateProduct(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="打印预览"
      :visible.sync="addFormVisible"
      width="36%"
      :close-on-click-modal="false"
    >
      <el-container id="printMe">
        <el-header style="margin-top: 35px;">
          <template>
            <div style="margin-bottom: 10px;">
              <!-- <div align="center" class="scan-header">宝鸡耀锋兄弟商贸有限公司送货清单</div> -->
              <div
                align="center"
                class="scan-content"
              >营养餐收货单位 {{ school }} 时间 <span v-if="this.startTime[0]==this.startTime[1]">{{this.startTime[0]}}</span> <span v-if="this.startTime[0]!==this.startTime[1]">{{this.startTime[0]}}-{{this.startTime[1]}}</span>        <span style="font-size:30px;margin-left: 20px;">{{schoolId}}</span></div>
            </div>
          </template>
        </el-header>
        <el-table
          v-loading="listLoading"
          :data="list"
          v-model="deliveryLists"
          element-loading-text="Loading"
          border
          size="mini"
          highlight-current-row
          show-summary
          :summary-method="getSummaries"
          class="print-header"
          :header-cell-class-name="headerCellClass"
          :header-row-class-name="headerRowClass"
          :cell-class-name="cellClass"
          :row-class-name="rowClass"
        >
          <el-table-column align="center" class="print-header" label="名称">
            <template slot-scope="scope">{{ scope.row.productName }}</template>
          </el-table-column>
          <el-table-column label="单位" align="center" width="40">
            <template slot-scope="scope">{{ scope.row.productType }}</template>
          </el-table-column>
          <el-table-column label="数量" prop="totalCount" align="center" width="40">
            <template slot-scope="scope">
              <span style="font-weight: 800;font-size: 15px;">{{ scope.row.totalCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="price" align="center" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.productPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="送货企业" align="center" width="50">
            <span></span>
          </el-table-column>
          <el-table-column label="生产日期" align="center" width="50">
            <span></span>
          </el-table-column>
          <el-table-column label="保质期" align="center" width="50">
            <span></span>
          </el-table-column>
          <el-table-column label="总额" prop="totalPrice" align="center" width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.totalPrice = accMul(scope.row.totalCount, scope.row.productPrice)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDeliveyEvent(this)" :loading="saveLoading" v-print="'#printMe'">打印</el-button>
        <el-button type="primary" @click="saveDeliveyEvent(this)" :loading="saveLoading">{{isSaveDeliveryStr}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="手动编辑商品"
      :visible.sync="addDeliveryVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="addDeliveryForm" label-width="80px" ref="addDeliveryForm">
        <el-form-item label="配送日期">
          <el-input v-model="school" auto-complete="off" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="配送日期">
          <el-input v-model="startTime[0]" auto-complete="off" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="addDeliveryForm.productId" filterable placeholder="请选择商品">
            <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="addDeliveryForm.count"
            auto-complete="off"
            placeholder="请输入商品数量"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addDeliveryVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.scan-header {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.scan-content {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
}
.print-header {
  border: 1px solid black;
  color: black;
}

.row-class {
  color: black;
  border: 1px solid black; 
}
.cell-class {
  border: 1px solid black; 
}

.cell-class .cell {
  padding-left: 0px;
  padding-right: 0px;
  padding: 0px 0px;
  
}
.el-table__footer-wrapper .has-gutter {
  border: 1px solid black;
}
.el-table__footer-wrapper .is-leaf {
  background-color: #FFF;
  color: black;
}
.el-dialog__body {
  padding: 0px 20px;
}

.el-table--mini td, .el-table--mini th {
  padding: 0 0;
}
</style>

<script>
import { getList, getUserList, addProductDelivery,deleteById as apiDeleteById, saveDelivery, isSaveDelivery} from "@/api/delivery";
import { getProductList, getClassList } from "@/api/product";
let moment = require("moment");

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
      addLoading: false,
      saveLoading: false,
      addFormVisible: false, //打印配送单
      addDeliveryVisible: false, //新增界面是否显示
      isSaveDeliveryStr:"未保存，点击保存",
      options: [],
      deliveryLists:[],
      classOptions:[{
        'id':'0',
        'name':'干货'
      },{
        'id':'1',
        'name':'生鲜'
      }],
      classType:"",
      school: "所有学校",
      schoolId:"无",
      userId: "",
      products: [],
      addDeliveryForm: {
        count: 0,
        productId: "",
        dateTime: "",
        userId: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24);
              start.setTime(start.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      startTime: ""
    };
  },
  created() {
    const date = new Date();
    date.setTime(date.getTime() + 3600 * 1000 * 24);
    this.startTime = [
      moment(date).format("YYYY-MM-DD"),
      moment(date).format("YYYY-MM-DD")
    ];
    this.getUserLabel();
    this.fetchData();
    this.getProductList();
  },
  methods: {
    rowClass() {
      return 'row-class';
    },
    cellClass() {
      return 'cell-class';
    },
    headerCellClass() {
      return 'cell-class';
    },
    headerRowClass() {
      return 'row-class';
    },
    fetchData() {
      
      const params = {
        startTime: this.startTime[0],
        endTime: this.startTime[1]
      };
      if (this.userId) {
        params.userId = this.userId;
      }
      if (this.classType) {
        params.classType = this.classType;
      }
      this.listLoading = true;
      getList(params)
        .then(response => {
          this.list = response.value;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
      this.isSaveDeliveryEvent();
    },
    getProductList() {
      getProductList({}).then(response => {
        this.products = response.value;
      });
    },
    getUserLabel() {
      const params = {
        start: 0,
        size: 1000
      };
      getUserList(params).then(response => {
        this.options = response.value.list;
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number((prev + curr).toFixed(2));
            } else {
              return Number(prev.toFixed(2))
            }
          }, 0);
          if (index == 2) {
            sums[index] = "";
          } else {
            sums[index] += "";
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    selectUser(index) {
      if (index) {
        for (let i in this.options) {
          if (index === this.options[i].id) {
            this.school = this.options[i].name;
            this.schoolId = this.options[i].number;
          }
        }
      } else {
        this.school = "所有学校";
        this.schoolId = "无";
      }

      this.fetchData();
    },
    showAddProduct() {
      if (this.startTime === "") {
        this.$message({
          message: "日期不能为空",
          type: "error"
        });
        return;
      }
      if (this.startTime[0] !== this.startTime[1]) {
        this.$message({
          message: "必须选择同一天",
          type: "error"
        });
        return;
      }

      if (this.userId === "") {
        this.$message({
          message: "学校不能为空",
          type: "error"
        });
        return;
      }
      this.addDeliveryForm = {
        count: 0,
        productId: ""
      }
      this.addDeliveryVisible = true;
    },
    addSubmit() {
      this.$confirm("确认添加商品吗？", "提示", {}).then(() => {
        this.addLoading = true;
        let params = Object.assign({}, this.addDeliveryForm);
        params.dateTime = this.startTime[0];
        params.userId = this.userId;
        addProductDelivery(params).then(
          res => {
            this.addLoading = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.addDeliveryVisible = false;
            this.fetchData();
          },
          error => {
            this.addLoading = false;
          }
        );
      });
    },
    deleteById(deliveryId) {
      if (this.startTime === "") {
        this.$message({
          message: "日期不能为空",
          type: "error"
        });
        return;
      }
      if (this.startTime[0] !== this.startTime[1]) {
        this.$message({
          message: "必须选择同一天",
          type: "error"
        });
        return;
      }

      if (this.userId === "") {
        this.$message({
          message: "请选择学校",
          type: "error"
        });
        return;
      }
      this.$confirm("确认删除配送单中的商品吗？", "提示", {}).then(() => {
        this.addLoading = true;
        apiDeleteById(deliveryId).then(
          res => {
            this.addLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.fetchData();
          },
          error => {
            this.$message({
              message: "删除失败！",
              type: "error"
            });
          }
        );
      });
    },
    showUpdateProduct(delivery){
      if (this.startTime === "") {
        this.$message({
          message: "日期不能为空",
          type: "error"
        });
        return;
      }
      if (this.startTime[0] !== this.startTime[1]) {
        this.$message({
          message: "必须选择同一天",
          type: "error"
        });
        return;
      }

      if (this.userId === "") {
        this.$message({
          message: "学校不能为空",
          type: "error"
        });
        return;
      }
      this.addDeliveryForm = {
        count: delivery.totalCount,
        productId: delivery.productId
      }
      this.addDeliveryVisible = true;
    },
    accMul(arg1,arg2)
    {
      var m=0,s1=arg1.toString(),s2=arg2.toString();
      try{m+=s1.split(".")[1].length}catch(e){}
      try{m+=s2.split(".")[1].length}catch(e){}
      return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    },
    saveDeliveyEvent() {
      if (this.startTime[0] !== this.startTime[1]) {
        this.$message({
          message: "必须选择同一天",
          type: "error"
        });
        return;
      }

      if (this.userId === "") {
        this.$message({
          message: "学校不能为空",
          type: "error"
        });
        return;
      }

      if(this.list.length == 0) {
        this.$message({
          message: "暂无数据可保存",
          type: "error"
        });
        return;
      }

      var arrayList = [];
      this.list.forEach(item=>{  
        let deliveryItem = {};
        deliveryItem.totalPrice=item.totalPrice;
        deliveryItem.totalCount=item.totalCount;
        deliveryItem.productId=item.productId;
        arrayList.push(deliveryItem)
      });

      this.saveLoading = true;
      let params = {};
      params.dateTime = this.startTime[0];
      params.userId = this.userId;
      params.classType = this.classType
      params.values = arrayList;
      saveDelivery(params).then(
        res => {
          this.saveLoading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.addDeliveryVisible = false;
          this.fetchData();
        },
        error => {
          this.saveLoading = false;
        }
      );
      this.isSaveDeliveryEvent()
    }, 
    isSaveDeliveryEvent(){
      if (this.startTime[0] !== this.startTime[1]) {
        return;
      }
      if (this.userId === "") {
        return;
      }
      var params = {
        dateTime:this.startTime[0],
        userId:this.userId
      }
      isSaveDelivery(params).then(
        res => {
          if(res.value == true) {
            this.isSaveDeliveryStr="已保存，点击更新"
          }
        },
        error => {
          console.log("juege isSaveDelivery error")
        }
      );
    }
  }
};
</script>


