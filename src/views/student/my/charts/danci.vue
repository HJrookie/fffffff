<template>
  <div class="danci">
    <div class="title">单词</div>
    <hr />

    <el-checkbox-group :value="years" @input="handleYearChange">
      <el-checkbox-button v-for="item in allYears" :label="item" :key="item">{{ item }}</el-checkbox-button>
    </el-checkbox-group>

    <el-row style="margin-top: 15px">
      <el-checkbox-group :value="weeks" @input="handleWeekChange">
        <el-checkbox-button v-for="item in allWeeks" :label="item" :key="item">{{ item }}</el-checkbox-button>
      </el-checkbox-group>
    </el-row>

    <div id="main-2" />

    <!--    <hr/>-->

    <el-button @click="addNewLine" style="margin-top: 15px">新增</el-button>
    <el-table :data="tableData" class="tbl1">
      <el-table-column label="开始时间" prop="start_time"> </el-table-column>

      <el-table-column label="完成时间" prop="finsh_time"> </el-table-column>

      <el-table-column label="状态" prop="rspd_status">
        <template scope="scope">
          <template>
            <span>{{ renderData(scope.row) }}</span>
          </template>
          <!--          <el-input size="small" v-model="scope.row.rspd_status" placeholder="状态"></el-input>-->
          <!--          <span>{{ scope.row.rspd_status }}</span>-->
        </template>
      </el-table-column>

      <el-table-column label="得分" prop="score"> </el-table-column>

      <el-table-column label="教学周" prop="stage_date_name"> </el-table-column>
    </el-table>

    <!--    <div>{{ props }}</div>-->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import { setToken } from "@/utils/auth";
import { getdanciData, updateWord, deleteWord, addWord } from "@/api/user";
import * as echarts from "echarts";
import { isValid } from "@/utils";

export default {
  name: "danci",
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
      options: [
        {
          value: "0",
          label: "未完成",
        },
        {
          value: "1",
          label: "已完成",
        },
      ],
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
      var chartDom = document.getElementById("main-2");
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
    renderData(row) {
      return row?.rspd_status === "1" ? "已完成" : "未完成";
    },
    handleDelete(index, row) {
      if (row.id) {
        deleteWord({ id: row.id }).then((res) => {
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
      if (row.id) {
        const data = {
          start_time: row.start_time,
          finsh_time: row.finsh_time,
          score: row.score,
          rspd_status: row.rspd_status,
          id: row.id,
        };
        updateWord(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      } else {
        const data = {
          start_time: row.start_time,
          finsh_time: row.finsh_time,
          score: row.score,
          rspd_status: row.rspd_status,
          userid: this.props.userid,
        };
        addWord(data).then((res) => {
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
    },
    addNewLine() {
      this.tableData.push({
        "start_time": "",
        "finsh_time": "",
        "rspd_status": "",
        "score": "",
        "userid": "",
        "stage_date_name": "",
        "isEditing": true,
      });
    },
    init(data, activeIndex = 0) {
      const _data = data ? data : { ...this.props };
      return getdanciData(_data).then((res) => {
        let arr = res?.result?.result ?? [];
        this.rawData = arr;
        this.tableData = isValid(activeIndex) ? [arr[activeIndex]] : arr;
        const { xAxisdata, seriesData, years, weeks } = arr.reduce(
          (prev, cur) => {
            prev.xAxisdata.push(cur.start_time);
            prev.seriesData.push(cur.score);
            prev.years.add(cur.start_time.slice(0, 4));
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
    // 按照年过滤
    filterByYearOrWeek(activeIndex = 0) {
      const { xAxisdata, seriesData, years, weeks, tblData } = this.rawData.reduce(
        (prev, cur) => {
          let year = cur.start_time.slice(0, 4);
          let week = cur.stage_date_name;
          if ((this.filter.year && this.years.includes(year)) || (this.filter.week && this.weeks.includes(week))) {
            prev.xAxisdata.push(cur.start_time);
            prev.seriesData.push(cur.score);
            prev.years.add(cur.start_time.slice(0, 4));
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
    handleWeekChange(v) {
      this.weeks = v;
      this.filter = {
        year: false,
        week: true,
      };
      this.filterByYearOrWeek();
    },
    getOptions(xAxisdata, seriesData, activeIndex = 0) {
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
            markPoint: {
              data: [
                {
                  coord: [activeIndex, seriesData[activeIndex] ?? 0],
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
.danci {
  #main-2 {
    width: 100%;
    min-height: 300px;
    height: 300px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }
}

//.tb-edit {
//  .el-input,
//  .el-select {
//    display: none;
//  }
//}
//
//.tb-edit .current-row {
//  .el-input,
//  .el-select {
//    display: block;
//  }
//}
//
//.tb-edit .current-row {
//  .el-input + span {
//    display: none;
//  }
//
//  .el-select + span {
//    display: none;
//  }
//}
.tbl1 {
  margin-top: 10px;
}
</style>
