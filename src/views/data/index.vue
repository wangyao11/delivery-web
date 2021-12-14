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
          <template>
            <el-select v-model="classId" clearable placeholder="请选择商品分类" @change="changeProducts">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <el-select v-model="productId" clearable placeholder="请选择产品" filterable @change="changeData">
            <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @change="changeData">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" v-print="'#printMe'">打印</el-button> -->
          <el-button type="primary" @click.native="addFormVisible = true">打印</el-button>
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
      <el-table-column align="center" label="学校" >
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column label="数量" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="打印预览"
      :visible.sync="addFormVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-container id="printMe">
        <el-header style="height: 50px;">
          <template>
            <div style="margin-bottom: 10px;">
              <!-- <div align="center" class="scan-header">宝鸡耀锋兄弟商贸有限公司送货清单</div> -->
              <div
                align="center"
                class="scan-content"
              >产品名称 {{ productName }} 时间 <span v-if="this.startTime[0]==this.startTime[1]">{{this.startTime[0]}}</span> <span v-if="this.startTime[0]!==this.startTime[1]">{{this.startTime[0]}}-{{this.startTime[1]}}</span></div>
            </div>
          </template>
        </el-header>
        <el-table
          v-loading="listLoading"
          :data="list"
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
          <el-table-column align="center" class="print-header" label="序号" width="45">
            <template slot-scope="scope">{{ scope.row.userNumber }}</template>
          </el-table-column>
          <el-table-column align="center"  label="学校">
            <template slot-scope="scope">{{ scope.row.userName }}</template>
          </el-table-column>
          <el-table-column label="数量" prop="totalCount" align="center">
            <template slot-scope="scope">
              <span style="font-weight: 800;font-size: 15px;">{{ scope.row.totalCount }}{{scope.row.productType}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="saveLoading" v-print="'#printMe'">打印</el-button>
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
  font-size: 15px;
}

.cell-class .cell {
  padding-left: 0px;
  padding-right: 0px;
  padding: 3px 0px;
  line-height: 14px;
  
}
.el-table__footer .cell {
  padding:0;
}
.el-table__body-wrapper {
  border-bottom: 1px solid black;
}
.el-table__footer-wrapper .has-gutter {
  border: 1px solid black;
}
.el-table__footer-wrapper .is-leaf {
  background-color: #FFF;
  color: black;
  font-size: 15px;
}
.el-dialog__body {
  padding: 0px 20px;
}

.el-table--mini td, .el-table--mini th {
  padding: 0 0;
}
</style>

<script>
import { getListByProductId} from "@/api/delivery";
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
      classList: [],
      classId:'',
      productId:'',
      productName:'所有产品',
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
    this.fetchData();
    this.getClassList();
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
      if (this.productId) {
        params.productId = this.productId;
      }
      this.listLoading = true;
      getListByProductId(params)
        .then(response => {
          var oneArr = response.value.filter(item => item.classType === 0)
          var twoArr = response.value.filter(item => item.classType === 1)

          oneArr.sort(function(a, b){
            var x = a.productName.toLowerCase();
            var y = b.productName.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
          });
          twoArr.sort(function(a, b){
            var x = a.productName.toLowerCase();
            var y = b.productName.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
          });
          this.list = oneArr.concat(twoArr);
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getClassList() {
      getClassList().then(response => {
        console.log(response);
        this.classList = response.value;
      });
    },
    getProductList(classId) {

      var productForm = {};
      if(classId) {
        productForm.classId = classId
      }

      getProductList(productForm).then(response => {
        this.products = response.value;
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总数";
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
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    changeData(index) {
      if (index) {
        for (let i in this.products) {
          if (index === this.products[i].id) {
            this.productName = this.products[i].name;
            console.log(this.products[i])
          }
        }
      }

      this.fetchData();
    },
    changeProducts(index) {
      var classId='';
      if (index) {
        for (let i in this.classList) {
          if (index === this.classList[i].id) {
            classId = this.classList[i].id;
          }
        }
      }

      this.getProductList(classId)
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

      if (!this.userId || this.userId === "" ) {
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
    }
  }
};
</script>


