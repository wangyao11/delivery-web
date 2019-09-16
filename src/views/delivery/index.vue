<template>
  <div class="app-container" >
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
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="userId" clearable="true" placeholder="请选择学校">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="fetchData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-print="'#printMe'">打印</el-button>
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
        <template slot-scope="scope">{{ scope.row.productName }}</template>
      </el-table-column>
      <el-table-column label="商品数量" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校名称">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" id="printMe" style="visibility:hidden">
      <div v-for="item in list" :key="item" class="text item">{{item.productName}}*{{item.totalCount}}</div>
    </el-card>
  </div>
</template>

<script>
import { getList, getUserList } from "@/api/delivery";

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
      options: [
        {
          value: "1",
          label: "黄金糕"
        },
        {
          value: "2",
          label: "双皮奶"
        },
        {
          value: "3",
          label: "蚵仔煎"
        },
        {
          value: "4",
          label: "龙须面"
        },
        {
          value: "5",
          label: "北京烤鸭"
        }
      ],
      userId: '',
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
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              start.setTime(start.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            }
          }
        ]
      },
      startTime: ''
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
      const params = {
        startTime: this.startTime[0],
        endTime: this.startTime[1]
      };
      if (this.userId) {
        params.userId = this.userId;
      }
      this.listLoading = true;
      getList(params).then(response => {
        console.log(response);
        this.list = response.value;
        this.listLoading = false;
      });
    },
    getUserLabel() {
      const params = {
        start: 0,
        size: 100
      };
      getUserList(params).then(response => {
        console.log(response);
        this.options = response.value.list;
      });
    }
  }
};
</script>
