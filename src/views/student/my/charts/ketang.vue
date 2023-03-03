<template>
  <div class="ketang">
    <div class="title">课堂</div>
    <hr />

    <el-checkbox-group :value="years" @input="handleYearChange">
      <el-checkbox-button v-for="item in allYears" :label="item" :key="item">{{ item }}</el-checkbox-button>
    </el-checkbox-group>

    <el-row style="margin-top: 15px">
      <el-checkbox-group :value="weeks" @input="handleWeekChange">
        <el-checkbox-button v-for="item in allWeeks" :label="item" :key="item">{{ item }}</el-checkbox-button>
      </el-checkbox-group>
    </el-row>

    <div id="main-4" />

    <!--    <hr/>-->

    <!--    <el-button @click="addNewLine" style="margin-top: 15px">新增</el-button>-->
    <el-table :data="tableData" class="tbl1" @row-click="handleRowClick">
      <el-table-column label="任务日期" prop="task_day">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_day" placeholder="任务日期"></el-input>
          <span v-else>{{ scope.row.task_day }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" prop="task_no" width="80">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_no" placeholder="任务编号"></el-input>
          <span v-else>{{ scope.row.task_no }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务名称" prop="task_name" show-overflow-tooltip>
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_name" placeholder="任务名称"></el-input>
          <span v-else>{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务得分" prop="student_score">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.student_score" placeholder="任务得分"></el-input>
          <span v-else>{{ scope.row.student_score }}</span>
          <!--          <span v-else>{{ getScore(scope) }}</span>-->
        </template>
      </el-table-column>

      <el-table-column label="技术模块" prop="task_module">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_module" placeholder="技术模块"></el-input>
          <span v-else>{{ scope.row.task_module }}</span>
        </template>
      </el-table-column>

      <el-table-column label="能力目标" prop="target_capability">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.target_capability" placeholder="能力目标"></el-input>
          <span v-else>{{ scope.row.target_capability }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--    <div>{{ props }}</div>-->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import { setToken } from "@/utils/auth";
import { getketangData, updateketang, deleteketang, addketang } from "@/api/user";
import * as echarts from "echarts";
import { isValid } from "@/utils";

export default {
  name: "ketang",
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
      var chartDom = document.getElementById("main-4");
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
    getScore(scope) {
      return `${scope.row.student_score ?? "-"}/${scope.row.target_score ?? "-"}`;
    },
    handleDelete(index, row) {
      if (row.id) {
        deleteketang({ id: row.id }).then((res) => {
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
          student_score: row.student_score,
          id: row.id,
        };
        updateketang(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      }
      // else {
      //   const data = {
      //     ...commonData,
      //     userid: this.props.userid,
      //   };
      //   addketang(data).then((res) => {
      //     this.$set(row, "isEditing", false);
      //     this.init().finally(() => {
      //       this.chart.hideLoading();
      //     });
      //   });
      // }
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
      return getketangData(_data).then((res) => {
        let arr = res?.result?.result ?? [];
        this.rawData = arr;
        this.tableData = isValid(activeIndex) ? [arr[activeIndex]] : arr;

        const { xAxisdata, seriesData, years, weeks } = arr.reduce(
          (prev, cur) => {
            let year = cur.task_day.slice(0, 4);
            let week = cur.stage_date_name;

            prev.xAxisdata.push(cur.work_date);
            prev.seriesData.push(cur.student_score);
            prev.years.add(year);
            prev.weeks.add(week);
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
      l("v", v);
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
          let year = cur.task_day.slice(0, 4);
          let week = cur.stage_date_name;
          if ((this.filter.year && this.years.includes(year)) || (this.filter.week && this.weeks.includes(week))) {
            prev.xAxisdata.push(cur.stage_date_name);
            prev.seriesData.push(cur.student_score);
            prev.years.add(year);
            prev.weeks.add(week);
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
      return {
        xAxis: {
          type: "category",
          data: [...xAxisdata],
          axisLabel: {
            interval: 0,
            rotate: -45, //倾斜度 -90 至 90 默认为0
            margin: 2,
            textStyle: {
              color: "#000000",
            },
          },
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
.ketang {
  #main-4 {
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
