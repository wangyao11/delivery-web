<template>
  <div class="dashboard-container">
    
    <el-row :gutter="20">
      <el-col :span="12"><BarChart/></el-col>
      <el-col :span="12"><PieChart/></el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
  },
  components: {BarChart, PieChart}
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
