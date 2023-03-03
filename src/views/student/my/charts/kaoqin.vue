<template>
  <div class="kaoqin">
    <div class="title">考勤</div>
    <hr />

    <el-checkbox-group :value="years" @input="handleYearChange">
      <el-checkbox-button v-for="item in allYears" :label="item" :key="item">{{ item }}</el-checkbox-button>
    </el-checkbox-group>

    <el-row style="margin-top: 15px">
      <el-checkbox-group :value="weeks" @input="handleWeekChange">
        <el-checkbox-button v-for="item in allWeeks" :label="item" :key="item">{{ item }}</el-checkbox-button>
      </el-checkbox-group>
    </el-row>

    <div id="main-3" />

    <!--    <hr/>-->

    <el-button @click="addNewLine" style="margin-top: 15px">新增</el-button>
    <el-table :data="tableData" class="tbl1" @row-click="handleRowClick">
      <el-table-column label="打卡日期" prop="work_date">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.work_date" placeholder="打卡日期"></el-input>
          <span v-else>{{ scope.row.work_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打卡时间" prop="user_check_time">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.user_check_time" placeholder="打卡时间"></el-input>
          <span v-else>{{ scope.row.user_check_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="打卡类型" prop="check_type">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.check_type" placeholder="打卡类型"></el-input>
          <span v-else>{{ scope.row.check_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考勤状态" prop="time_result">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.time_result" placeholder="考勤状态"></el-input>
          <span v-else>{{ scope.row.time_result }}</span>
        </template>
      </el-table-column>

      <el-table-column label="审批编号" prop="procInst_id">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.procInst_id" placeholder="审批编号"></el-input>
          <span v-else>{{ scope.row.procInst_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="教学周" prop="stage_date_name">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.stage_date_name" placeholder="教学周"></el-input>
          <span v-else>{{ scope.row.stage_date_name }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--    <div>{{ props }}</div>-->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import { setToken } from "@/utils/auth";
import { getkaoqinData, updatekaoqin, deletekaoqin, addkaoqin } from "@/api/user";
import * as echarts from "echarts";
import { isValid } from "@/utils";

export default {
  name: "kaoqin",
  props: {
    props: {
      type: Object,
    },
  },
  data() {
    return {
      chart: undefined,
      rawData: [], // 原始数据
      tableData: [], // 原始数据
      years: [], // 年
      allYears: [], // 年
      weeks: [], //教学周
      allWeeks: [], //教学周
      filter: {
        year: false,
        week: false,
      },
    };
  },
  watch: {},
  created() {},
  beforeDestroy() {
    this.$EventBus.$off("getData");
  },
  mounted() {
    this.$nextTick(() => {
      var chartDom = document.getElementById("main-3");
      this.chart = echarts.init(chartDom);
      this.$EventBus.$on("getData", (data) => {
        if (!this.props.userid) {
          this.tableData = [];
          this.chart = echarts.init(chartDom);
          return;
        }
        this.chart.showLoading();
        this.init(data).finally(() => {
          this.chart.hideLoading();
        });
      });

      this.chart.on("click", (params) => {
        if (this.filter.year || this.filter.week) {
          this.filterByYearOrWeek(params.dataIndex);
        } else {
          this.chart.showLoading();
          this.init(undefined, params.dataIndex).finally(() => {
            this.chart.hideLoading();
          });
        }
      });
    });
  },
  methods: {
    handleDelete(index, row) {
      if (row.id) {
        deletekaoqin({ id: row.id }).then((res) => {
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    saveRow(index, row) {
      l(index, row);
      let commonData = {
        work_date: row.work_date,
        check_type: row.check_type,
        user_check_time: row.user_check_time,
        procInst_id: row.procInst_id,
        time_result: row.time_result,
      };
      if (row.id) {
        const data = {
          ...commonData,
          id: row.id,
        };
        updatekaoqin(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      } else {
        const data = {
          ...commonData,
          userid: this.props.userid,
        };
        addkaoqin(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      }
    },
    editRow(index, row) {
      this.$set(row, "isEditing", true);
    },
    cancelRow(index, row) {
      this.$set(row, "isEditing", false);
      if (!row.id) {
        this.tableData.splice(index, 1);
      }
    },
    addNewLine() {
      this.tableData.push({
        "work_date": "",
        "check_type": "",
        "time_result": "",
        "user_check_time": "",
        "procInst_id": "",
        "stage_date_name": "",
        "isEditing": true,
      });
    },
    handleRowClick(row, column, event) {},
    init(data, activeIndex = 0) {
      const _data = data ? data : { ...this.props };
      return getkaoqinData(_data).then((res) => {
        let arr = res?.result?.result ?? [];
        this.rawData = arr;
        this.tableData = isValid(activeIndex) ? [arr[activeIndex]] : arr;
        const { xAxisdata, seriesData, years, weeks } = arr.reduce(
          (prev, cur) => {
            prev.xAxisdata.push(cur.work_date);
            if (["请假", "未打卡", "迟到"].includes(cur.time_result)) {
              prev.seriesData.push({
                // value: cur.score,
                value: 1,
                itemStyle: {
                  color: "red",
                },
                type: cur.time_result,
              });
            } else {
              prev.seriesData.push({
                value: 1,
                type: cur.time_result,
              });
            }
            prev.years.add(cur.work_date.slice(0, 4));
            prev.weeks.add(cur.stage_date_name);
            return prev;
          },
          {
            xAxisdata: [],
            seriesData: [],
            years: new Set(),
            weeks: new Set(),
          }
        );
        const option = this.getOptions(xAxisdata, seriesData, activeIndex);
        this.years = [...years];
        this.allYears = [...years];
        this.weeks = [...weeks];
        this.allWeeks = [...weeks];
        this.chart.setOption(option);
      });
    },

    handleYearChange(v, a, b) {
      l("eee", v, a, b);
      this.years = v;
      this.filter = {
        year: true,
        week: false,
      };
      this.filterByYearOrWeek();
    },
    handleWeekChange(v) {
      this.weeks = v;
      this.filter = {
        year: false,
        week: true,
      };
      this.filterByYearOrWeek();
    },
    filterByYearOrWeek(activeIndex = 0) {
      const { xAxisdata, seriesData, years, weeks, tblData } = this.rawData.reduce(
        (prev, cur) => {
          let year = cur.work_date.slice(0, 4);
          let week = cur.stage_date_name;
          if ((this.filter.year && this.years.includes(year)) || (this.filter.week && this.weeks.includes(week))) {
            prev.xAxisdata.push(cur.work_date);
            if (["请假", "未打卡", "迟到"].includes(cur.time_result)) {
              prev.seriesData.push({
                // value: cur.score,
                value: 1,
                itemStyle: {
                  color: "red",
                },
                type: cur.time_result,
              });
            } else {
              prev.seriesData.push({
                value: 1,
                type: cur.time_result,
              });
            }
            prev.years.add(year);
            prev.weeks.add(cur.stage_date_name);
            prev.tblData.push(cur);
          }
          return prev;
        },
        {
          xAxisdata: [],
          seriesData: [],
          years: new Set(),
          weeks: new Set(),
          tblData: [],
        }
      );
      this.tableData = [tblData[activeIndex]];
      const option = this.getOptions(xAxisdata, seriesData, activeIndex);
      this.years = [...years];
      this.weeks = [...weeks];
      this.chart.setOption(option);
    },
    getOptions(xAxisdata, seriesData, activeIndex = 0) {
      l(999, seriesData);
      return {
        xAxis: {
          type: "category",
          data: [...xAxisdata],
          // axisLabel: {
          //   interval: 0,
          //   rotate: -45, //倾斜度 -90 至 90 默认为0
          //   margin: 2,
          //   textStyle: {
          //     color: "#000000",
          //   },
          // },
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [...seriesData],
            type: "bar",
            smooth: true,
            // label: {
            //   show: true,
            //   position: "inside",
            //   formatter: (params) => {
            //     return params?.data?.type ?? "";
            //   },
            // },
            markPoint: {
              data: [
                {
                  coord: [activeIndex, seriesData[activeIndex].value ?? 0],
                },
              ],
            },
          },
        ],
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.kaoqin {
  #main-3 {
    width: 100%;
    min-height: 300px;
    height: 300px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }
}

.tbl1 {
  margin-top: 10px;
}
</style>
