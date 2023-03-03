<template>
  <div class="app-container">
    <el-row type="flex">
      <div class="top-item" v-for="(value, name) of topData" :key="value">
        <div class="item-name">{{ name }}</div>
        <div class="value">{{ value }}</div>
      </div>
    </el-row>
    <el-row :gutter="12" style="margin-top: 10px">
      <el-col :xs="24" :sm="24" :lg="5">
        <div class="progress">
          <div id="progress"></div>
          <div class="infos" id="infos"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="13">
        <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick" style="margin-left: 10px">
          <el-tab-pane label="赛项人数排名" name="赛项人数排名">
            <transition name="el-fade-in-linear">
              <div id="c-item" v-if="activeTabName === '赛项人数排名'"></div>
            </transition>
          </el-tab-pane>
          <el-tab-pane label="报名情况" name="报名情况">
            <transition name="el-fade-in-linear">
              <div id="c-enroll" v-if="activeTabName === '报名情况'"></div>
            </transition>
          </el-tab-pane>
          <el-tab-pane label="参赛情况" name="参赛情况">
            <transition name="el-fade-in-linear">
              <div id="c-match" v-if="activeTabName === '参赛情况'"></div>
            </transition>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="units" id="units">
          <div class="unit-title">参赛单位排名</div>
          <div class="unit" v-for="(item, i) of units">
            <div class="index">{{ i + 1 }}</div>
            <div class="wrap">
              <div class="name">{{ item }}</div>
              <div class="value">100</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="40" style="margin-top: 20px">
      <el-col :xs="24" :sm="24" :lg="12">
        <div id="origin1"></div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="12">
        <div id="ages"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getContestInfo, deleteContestInfo } from "@/api/contestManage";
import FormTableMixins from "@/mixins";
import { mapGetters } from "vuex";
import * as echarts from "echarts";
export default {
  name: "SjDashboard",
  mounted() {
    this.initChartDom();
    this.initChartData();

    this.getContestInfoChart();
  },
  data() {
    // 这个是 gauge 的默认配置

    return {
      activeTabName: "赛项人数排名",
      topData: {
        "报名人数": "12444",
        "参赛人数": "8846",
        "参赛单位数": "120",
        "赛项数": "70",
      },
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      myChart5: null,
      loading: false,
      addOrUpdateVisible: false,
      page: 1,
      pageSize: 10,
      total: 0,
      units: ["工专路 1 号店", "工专路 2 号店", "工专路 3 号店", "工专路 4 号店", "工专路 6 号店", "工专路 6 号店", "工专路 7 号店"],
    };
  },
  computed: {
    ...mapGetters(["dicts"]),
  },
  methods: {
    initChartDom() {
      const chartDom1 = document.getElementById("progress");

      this.myChart1 = echarts.init(chartDom1);
      // var chartDom = document.getElementById('main');
      // var myChart = echarts.init(chartDom);

      const chartDom2 = document.getElementById("infos");
      this.myChart2 = echarts.init(chartDom2);

      // 初始化柱状图
      this.initContestInfoChart();

      const chartDom4 = document.getElementById("origin1");
      this.myChart4 = echarts.init(chartDom4);

      const chartDom5 = document.getElementById("ages");
      this.myChart5 = echarts.init(chartDom5);

      //
      // const chartDom3 = document.getElementById("units");
      // const myChart3 = echarts.init(chartDom3);

      // const options = this.initGaugeOption({
      //   value: 30,
      //   name: "Perfect",
      //   title: {
      //     offsetCenter: ["0%", "-03%"],
      //   },
      //   detail: {
      //     valueAnimation: true,
      //     offsetCenter: ["0%", "-55%"],
      //   },
      // });
      // this.myChart1.setOption(options);
    },
    handleTabClick() {
      this.initContestInfoChart();
    },
    initContestInfoChart() {
      this.$nextTick(() => {
        const domIdMap = {
          "赛项人数排名": "c-item",
          "报名情况": "c-enroll",
          "参赛情况": "c-match",
        };
        const chartDom3 = document.getElementById(domIdMap[this.activeTabName]);
        this.myChart3 = echarts.init(chartDom3);

        const data = Array.from({ length: 7 }, () => Math.round(Math.random() * 100));

        Promise.resolve([...data]).then((res) => {
          const options = this.initCategoryOptions(res);

          this.myChart3.setOption(options);
        });
      });
    },
    initChartData() {
      Promise.resolve([
        {
          value: 30,
          name: "报名进度",
          title: {
            offsetCenter: ["0%", "-10%"],
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ["0%", "30%"],
          },
        },
      ]).then((res) => {
        const options = this.initGaugeOption(res, "#8bd786");

        this.myChart1.setOption(options);
      });

      Promise.resolve([
        {
          value: 30,
          name: "比赛进度",
          title: {
            offsetCenter: ["0%", "-10%"],
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ["0%", "30%"],
          },
        },
      ]).then((res) => {
        const options = this.initGaugeOption(res, "#409eff");

        this.myChart2.setOption(options);
      });

      // 饼图 1
      Promise.resolve([]).then((res) => {
        const options = this.initPitOption(res, "选手来源统计");
        this.myChart4.setOption(options);
      });
      // 饼图 2
      Promise.resolve([]).then((res) => {
        const options = this.initPitOption(res, "年龄统计");
        this.myChart5.setOption(options);
      });
    },
    getContestInfoChart() {
      const ajaxMap = {
        "赛项人数排名": Promise.resolve(),
        "报名情况": undefined,
        "参赛情况": undefined,
      };

      const ajax = ajaxMap[this.activeTabName];
    },
    addNew(rowInfo) {
      console.log("rowInfo", rowInfo);
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(rowInfo);
      });
    },
    edit(rowInfo) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(rowInfo);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query();
    },
    // 获取柱状图的选项
    initCategoryOptions(data) {
      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // x 轴数据
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data,
            type: "bar",
          },
        ],
      };
      return option;
    },
    initGaugeOption(data, itemStyleColor) {
      return {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            radius: "60%",
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                color: itemStyleColor,
                borderColor: itemStyleColor,
              },
            },
            axisLine: {
              lineStyle: {
                width: 10,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            data: data,
            title: {
              fontSize: 12,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 12,
              // color: "auto",
              // borderColor: "auto",
              borderRadius: 4,
              // borderWidth: 1,
              formatter: "{value}%",
            },
          },
        ],
      };
    },
    initPitOption(data, text) {
      return {
        title: {
          text: text,
          // subtext: "纯属虚构",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          // left: "center",

          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.top-item {
  /*width: 24%;*/
  flex-grow: 1;
  min-width: 80px;
  padding: 10px 10px;
  border: 1px solid gainsboro;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  -webkit-transition: all ease-in-out 0.3s;
  -moz-transition: all ease-in-out 0.3s;
  -ms-transition: all ease-in-out 0.3s;
  -o-transition: all ease-in-out 0.3s;
  transition: all ease-in-out 0.3s;
  cursor: pointer;
  &:hover {
    background: #e0e0e01c;
  }
  &:not(:first-child) {
    margin-left: 10px;
  }
  .item-name {
    color: gray;
  }
  .value {
    margin-top: 5px;
    color: black;
  }
}
#progress {
  height: 200px;
  border: 1px solid #e0e0e0;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  border-bottom: none;
}
#infos {
  height: 200px;
  border: 1px solid #e0e0e0;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  border-top: none;
}
#c-item,
#c-enroll,
#c-match {
  /*width: 700px;*/
  height: 370px;
}
#units {
  margin-top: 10px;
  margin-left: 10px;
  padding-top: 30px;
  .unit-title {
    font-weight: bold;
    font-size: 16px;
  }
  .unit {
    display: flex;
    font-size: 14px;
    margin-top: 20px;

    &:nth-of-type(2),
    &:nth-of-type(3),
    &:nth-of-type(4) {
      .index {
        background: #34373c;
        color: #dedee1;
      }
    }
    .index {
      cursor: pointer;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      background: #bbbbbb55;
      border-radius: 50%;
    }
    .name {
      margin-left: 10px;
      color: #3e3b3be8;
    }
    .wrap {
      width: 80%;
      display: flex;
      justify-content: space-around;
    }
    .value {
    }
  }
}

#origin1,
#ages {
  height: 400px;
}
</style>
