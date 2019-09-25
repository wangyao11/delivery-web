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
      <el-table-column align="center" label="名称" width="300">
        <template slot-scope="scope">{{ scope.row.productName }}</template>
      </el-table-column>
      <el-table-column label="单位" width="300" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.productType==0">斤</span>
          <span v-show="scope.row.productType==1">袋</span>
          <span v-show="scope.row.productType==2">瓶</span>
          <span v-show="scope.row.productType==3">桶</span>
          <span v-show="scope.row.productType==4">包</span>
          <span v-show="scope.row.productType==5">个</span>
          <span v-show="scope.row.productType==6">件</span>
        </template>
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
    </el-table>
    <el-dialog
      title="打印预览"
      :visible.sync="addFormVisible"
      width="40%"
      :close-on-click-modal="false"
    > 
      <el-container id='printMe'>
        <el-header>
          <template>
            <div style="margin-bottom: 10px;">
              <div align="center" class="scan-header">宝鸡耀锋兄弟商贸有限公司送货清单</div>
              <div align="center" class="scan-content">营养参收货单位 {{ school }} 时间 {{this.startTime[0]}}-{{this.startTime[1]}}</div>
            </div>
          </template>
        </el-header>
        <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        highlight-current-row
        show-summary
        :summary-method="getSummaries"
        class="print-header"
      >
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="单位" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.productType==0">斤</span>
            <span v-show="scope.row.productType==1">袋</span>
            <span v-show="scope.row.productType==2">瓶</span>
            <span v-show="scope.row.productType==3">桶</span>
            <span v-show="scope.row.productType==4">包</span>
            <span v-show="scope.row.productType==5">个</span>
            <span v-show="scope.row.productType==6">件</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="totalCount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalCount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="单价" prop="price" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="送货企业" align="center">
            <span></span>
        </el-table-column>
        <el-table-column label="生产日期" align="center">
            <span></span>
        </el-table-column>
        <el-table-column label="保质期" align="center">
            <span></span>
        </el-table-column>
        <el-table-column label="总额" prop="totalPrice" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalPrice = scope.row.totalCount*scope.row.productPrice }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" v-print="'#printMe'">打印</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<style scoped>
  .scan-header {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .scan-content {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .print-header {
    margin-top:10px;
    font-weight: bold;
    color: black;
  }
</style>

<script>
import { getList, getUserList } from "@/api/delivery";
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
      addFormVisible: false, //新增界面是否显示
      options: [],
      school:"所有学校",
      userId: "",
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
  },
  methods: {
    fetchData() {
      const params = {
        startTime: this.startTime[0],
        endTime: this.startTime[1]
      };
      if (this.userId) {
        params.userId = this.userId;
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
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(index == 2) {
              sums[index] = '';
            } else {
              sums[index] += ' 元';
            }
            
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      selectUser(index){
        if(index){
          for(let i in this.options) {
            if(index === this.options[i].id) {
              this.school = this.options[i].name;
            }
          }
        } else {
          this.school = "所有学校";
        }
        
        this.fetchData();
      }
  }
};
</script>


