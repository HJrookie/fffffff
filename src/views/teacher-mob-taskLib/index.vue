<template>
  <div class="tasks">
    <!--    <transition>-->
    <!--      <div v-if="msgShow" class="top">-->
    <!--        {{ msg.name }}提交了任务,完成度{{ msg.wancehgnduA }}/{{ msg.wanchengdub }}-->
    <!--        <span class="errorIcon" @click="msgShow = false"><i class="el-icon-error"></i> </span>-->
    <!--      </div>-->
    <!--    </transition>-->

    <el-row>
      <el-button @click="goback" style="margin: 10px 0px">返回</el-button>
    </el-row>

    <div class="userinfos">
      <div class="info" v-for="(item, i) of tableData" @click="toggleSEc(item)">
        <div class="selec">
          <el-checkbox :value="item.checked" @input="(...args) => setV(...args, item)"></el-checkbox>
        </div>
        <div class="cont">
          <div>任务: {{ item.task_name }}</div>
          <div>技术模块:{{ item.task_module }}</div>
          <div>能力目标:{{ item.target_capability }}</div>
        </div>
      </div>
    </div>

    <el-row type="flex" justify="center" style="margin-top: 10px">
      <el-button @click="subm">发布</el-button>
    </el-row>
    <fabu ref="addRef"></fabu>
  </div>
</template>

<script>
import { getTaskData, addTask, deleteTask, updateTask } from "@/api/user";
import * as echarts from "echarts";
import Fabu from "./selectBanji";

export default {
  name: "tasks",
  props: {},
  components: {
    Fabu,
  },
  data() {
    return {
      msgShow: true,
      msg: {
        name: "张三",
        wancehgnduA: 13,
        wanchengdub: 30,
      },
      chart: undefined,
      tableData: [], // 原始数据
      options: [
        // todo
        {
          label: "已发布",
          value: 1,
        },
        {
          label: "待发布",
          value: 2,
        },
      ],
    };
  },
  watch: {},
  mounted() {
    this.init(0);
  },
  methods: {
    goback() {
      this.$router.push("/teacher");
    },
    init() {
      let data = {
        dept_id: JSON.parse(localStorage.getItem("dep") ?? "{}")?.dept_id?.[0] ?? "",
      };
      getTaskData(data).then((res) => {
        this.tableData = res?.result?.result ?? [];
      });
    },
    toggleSEc(item) {
      this.$set(item, "checked", item.checked ? false : true);
    },
    setV(v, item) {
      this.$set(item, "checked", !v);
    },
    subm() {
      if (!this.tableData.some((v) => v.checked === true)) {
        return this.$message.warning("请选中后再发布");
      }
      let data = this.tableData.filter((v) => v.checked === true);

      this.$refs.addRef.init(undefined, data, "发布");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tasks {
  padding: 10px;
  max-width: 600px;
  height: 100%;
  margin: 0 auto;
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

.userinfos {
  padding-top: 10px;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 14px;
  border-bottom: 1px solid #bbb;
  border-top: 1px solid #bbb;
  //height: calc(100% - 300px);

  .info {
    display: flex;
    padding-left: 5px;

    .selec {
      width: 40px;
      display: flex;
      align-items: center;
    }

    .cont {
      border: 1px solid darkblue;
      padding: 5px;
      border-radius: 5px;
      width: 100%;
    }

    &:not(:first-child) {
      margin-top: 10px;
    }
  }
}
</style>
