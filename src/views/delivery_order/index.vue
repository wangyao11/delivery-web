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
          <el-button type="primary" @click.native="printVisible = true">打印</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      show-summary
      :summary-method="getSummaries"
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
      <el-table-column label="数量" prop="totalCount" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" prop="totalPrice" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPrice / 100}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="deleteById(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button @click="showUpdateProduct(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog
      title="打印预览"
      :visible.sync="printVisible"
      width="27%"
      :close-on-click-modal="false"
    >
      <el-container id="printMe">
        <el-header style="margin-top: 10px;">
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
              <span>{{ ((scope.row.totalPrice / scope.row.totalCount) / 100).toFixed(2) }}</span>
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
              <span>{{scope.row.totalPrice / 100}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="printVisible = false">取消</el-button>
        <el-button type="primary" v-print="'#printMe'">打印</el-button>
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
  line-height: 18px;
  
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
import { getList, getUserList, addProductDelivery,deleteById as apiDeleteById,listDayTotalByUserIdAndDate } from "@/api/delivery";
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
      addFormVisible: false, //打印配送单
      printVisible: false, //新增界面是否显示
      options: [],
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
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
        ]
      },
      startTime: ""
    };
  },
  created() {
    const date = new Date();
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
      listDayTotalByUserIdAndDate(params)
        .then(response => {
          this.list = response.value;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
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
          if(index === 3) {
            sums[3] = sums[3]/100;
          }
          if(index === 7) {
            sums[7] = sums[7]/100;
          }
        }
      });

      return sums;
    }
  }
};
</script>


