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
      <el-table-column label="开始时间" prop="start_time">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.start_time" placeholder="开始时间"></el-input>
          <span v-else>{{ scope.row.start_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="完成时间" prop="finsh_time">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.finsh_time" placeholder="完成时间"></el-input>
          <span v-else>{{ scope.row.finsh_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="rspd_status">
        <template scope="scope">
          <template v-if="scope.row.isEditing">
            <el-select v-model="scope.row.rspd_status" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
          <template v-else>
            <span>{{ scope.row.rspd_status === "1" ? "已完成" : "未完成" }}</span>
          </template>
          <!--          <el-input size="small" v-model="scope.row.rspd_status" placeholder="状态"></el-input>-->
          <!--          <span>{{ scope.row.rspd_status }}</span>-->
        </template>
      </el-table-column>

      <el-table-column label="得分" prop="score">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.score" placeholder="得分"></el-input>
          <span v-else>{{ scope.row.score }}</span>
        </template>
      </el-table-column>

      <el-table-column label="教学周" prop="stage_date_name">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.stage_date_name" placeholder="教学周"></el-input>
          <span v-else>{{ scope.row.stage_date_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <template v-if="scope.row.isEditing">
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认保存？" @confirm="saveRow(scope.$index, scope.row)">
              <el-button size="small" slot="reference">保存</el-button>
            </el-popconfirm>
          </template>

          <el-button size="small" type="primary" v-else @click="editRow(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="primary" v-if="scope.row.isEditing" style="margin-left: 10px" @click="cancelRow(scope.$index, scope.row)">取消 </el-button>

          <template v-else>
            <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定删除？" @confirm="handleDelete(scope.$index, scope.row)">
              <el-button size="small" style="margin-left: 10px" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
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
      if (!row.id) {
        this.tableData.splice(index, 1);
      }
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
            // prev.seriesData.push(cur.score);

            if (["请假", "未打卡"].includes(cur.time_result)) {
              prev.seriesData.push({
                value: cur.score,
                itemStyle: {
                  color: "red",
                },
                type: cur.time_result,
              });
            } else {
              prev.seriesData.push(cur.score);
            }

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
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 30
          },
        ],
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
