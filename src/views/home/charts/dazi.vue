<template>
  <div class="dazi">
    <div class="title">打字</div>
    <hr />

    <el-checkbox-group :value="years" @input="handleYearChange">
      <el-checkbox-button v-for="item in allYears" :label="item" :key="item">{{ item }}</el-checkbox-button>
    </el-checkbox-group>

    <el-row style="margin-top: 15px">
      <el-checkbox-group :value="weeks" @input="handleWeekChange">
        <el-checkbox-button v-for="item in allWeeks" :label="item" :key="item">{{ item }}</el-checkbox-button>
      </el-checkbox-group>
    </el-row>
    <!--    <hr/>-->
    <div id="main-1" />

    <el-button @click="addNewLine" style="margin-top: 15px">新增</el-button>
    <el-table :data="tableData" class="tbl1">
      <el-table-column label="时间" prop="time">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.test_time" placeholder="时间"></el-input>
          <span v-else>{{ scope.row.test_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="速度" prop="typing_speed">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.typing_speed" placeholder="速度"></el-input>
          <span v-else>{{ scope.row.typing_speed }}</span>
        </template>
      </el-table-column>

      <el-table-column label="准确率" prop="accuracy">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.accuracy" placeholder="准确率"></el-input>
          <span v-else>{{ scope.row.accuracy + "%" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退格" prop="space_count">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.space_count" placeholder="退格"></el-input>
          <span v-else>{{ scope.row.space_count }}</span>
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

          <el-button size="small" type="primary" v-if="scope.row.isEditing" style="margin-left: 10px" @click="cancelRow(scope.$index, scope.row)">取消</el-button>

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
import { getDaziData, updatetyping, deletetyping, addTyping } from "@/api/user";
import * as echarts from "echarts";
import { isValid } from "@/utils";

export default {
  name: "Dazi",
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
  beforeDestroy() {
    this.$EventBus.$off("getData");
  },
  mounted() {
    this.$nextTick(() => {
      var chartDom = document.getElementById("main-1");
      this.chart = echarts.init(chartDom);
      this.$EventBus.$on("getData", (data) => {
        if (!this.props.userid) {
          this.chart = echarts.init(chartDom);
          this.tableData = [];
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
        deletetyping({ id: row.id }).then((res) => {
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
          accuracy: row.accuracy,
          space_count: row.space_count,
          test_time: row.test_time,
          typing_speed: row.typing_speed,
          stage_date_name: row.stage_date_name,
          id: row.id,
        };
        updatetyping(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      } else {
        const data = {
          accuracy: row.accuracy,
          space_count: row.space_count,
          test_time: row.test_time,
          typing_speed: row.typing_speed,
          stage_date_name: row.stage_date_name,
          userid: this.props.userid,
        };
        addTyping(data).then((res) => {
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
        "typing_speed": "",
        "accuracy": "",
        "space_count": "",
        "test_time": "",
        "userid": "",
        "stage_date_name": "",
        "isEditing": true,
      });
    },
    init(data, activeIndex = 0) {
      const _data = data ? data : { ...this.props };
      // const data = {
      //   userid: "016123285001652923",
      //   start_time: "2023-01-03 12:00:00",
      //   end_time: "2023-01-13 12:00:00",
      // };
      return getDaziData(_data).then((res) => {
        let arr = res?.result?.result ?? [];
        this.rawData = arr;
        this.tableData = isValid(activeIndex) ? [arr[activeIndex]] : arr;
        const { xAxisdata, seriesData, years, weeks } = arr.reduce(
          (prev, cur) => {
            prev.xAxisdata.push(cur.test_time);
            prev.seriesData.push(cur.typing_speed);
            prev.years.add(cur.test_time.slice(0, 4));
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
          let year = cur.test_time.slice(0, 4);
          let week = cur.stage_date_name;
          if ((this.filter.year && this.years.includes(year)) || (this.filter.week && this.weeks.includes(week))) {
            prev.xAxisdata.push(cur.test_time);
            prev.seriesData.push(cur.typing_speed);
            prev.years.add(cur.test_time.slice(0, 4));
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
          containLabel: true,

        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 20,
          },
        ],
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [...seriesData],
            type: "line",
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
.dazi {
  #main-1 {
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
