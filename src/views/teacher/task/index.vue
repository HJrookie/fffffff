<template>
  <div class="stuTasks">
    <transition>
      <div v-if="msgShow" class="top">
        {{ msg.name }}提交了任务,完成度{{ msg.wancehgnduA }}/{{ msg.wanchengdub }}
        <span class="errorIcon" @click="msgShow = false"><i class="el-icon-error"></i> </span>
      </div>
    </transition>

    <el-row type="flex" justify="end" style="margin-top: 10px">
      <a class="href"><router-link to="/tea-mob-taskLib">任务库</router-link></a>
    </el-row>

    <div style="margin-top: 10px">
      <el-form ref="form" :model="form" :rules="dataRule" label-width="60px">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>

        <!--      <el-form-item label="技术模块" prop="nianji">-->
        <!--        <el-select v-model="form.nianji" placeholder="" style="width: 100%">-->
        <!--          <el-option v-for="item in nianjis" :key="item.value" :label="item.label" :value="item.value" style="width: 100%"></el-option>-->
        <!--        </el-select>-->
        <!--      </el-form-item>-->

        <el-form-item label="班级" prop="banji">
          <el-select v-model="form.banji" placeholder="">
            <el-option v-for="item in banjis" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-row type="flex" justify="center">
          <el-button type="primary" @click="submitFom">确认发布</el-button>
        </el-row>
      </el-form>
    </div>

    <div>
      <div>{{ date }} 发布</div>
      <hr />
    </div>

    <div class="userinfos">
      <div class="info" v-for="(item, i) of data">
        <div>任务: {{ item.task_name }}</div>
        <div>技术模块:{{ item.task_module }}</div>
        <div>能力目标:{{ item.target_capability }}</div>
      </div>
    </div>

    <add ref="addRef"></add>
  </div>
</template>

<script>
import { getCurUserInfo, getnenglis, getjishus, getPersionalInfo, savePersonalInfo, savePersonInfo, getBanjis, getFabuData } from "@/api/user";
import { mapGetters } from "vuex";
import { isMobile } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import { checkContestInfo, editContestInfo, getFileInfoById, saveContestInfo } from "@/api/contestManage";
import _ from "lodash";
import moment from "moment/moment";
import Add from "./fabu-info.vue";

export default {
  name: "StuTasks",
  components: {
    // Left,
    Add,
  },
  data() {
    const { dept_id = [], dept_name = [] } = JSON.parse(localStorage.getItem("dep") ?? "{}");
    let banjis = dept_id.reduce((prev, cur, i) => {
      prev.push({
        value: cur,
        label: dept_name[i],
      });
      return prev;
    }, []);
    return {
      date: moment().format(`YYYY-MM-DD`),
      form: {
        date: undefined,
        // nianji: undefined,
        banji: undefined,
      },
      banjis: banjis,
      dataRule: {
        date: [{ required: true, trigger: "change", message: "请选择" }],
        // nianji: [{ required: true, trigger: "change", message: "请选择" }],
        banji: [{ required: true, trigger: "change", message: "请选择" }],
      },

      msgShow: true,
      dep: JSON.parse(localStorage.getItem("dep")),
      msg: {
        name: "张三",
        wancehgnduA: 13,
        wanchengdub: 30,
      },
      data: [],
    };
  },
  mounted() {
    getFabuData({
      dept_id: this.dep?.dept_id?.[0] ?? "",
      start_time: moment().format(`YYYY-MM-DD`) + " 00:00:00",
      end_time: moment().format(`YYYY-MM-DD`) + " 23:59:59",
    }).then((res) => {
      l(4343, res);
      this.data = res?.result?.result ?? [];
      // let d = res?.result?.result ?? [];
      // this.data = [d[0],d[0],d[0],d[0],d[0],d[0],d[0],d[0],d[0],d[0],d[0],d[0],d[0],]
    });
  },
  computed: {},
  methods: {
    submitFom() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // this.$refs.addRef.init();
          this.$refs.addRef.init(
            undefined,
            {
              task_day: this.form.date,
              dept_id: this.form.banji,
              // task_name: this.form.name,
              // task_module: this.form.jishu,
              // target_capability: this.form.nengli,
            },
            "保存到任务库并发布"
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.stuTasks {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid darkblue;
  position: relative;
  padding: 10px;

  .href {
    color: #0a6cd6;
  }
  .top {
    width: 100%;
    height: 30px;
    padding: 3px 10px;
    top: 0;
    border-bottom: 1px solid darkblue;

    .errorIcon {
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .form {
    margin-top: 30px;
  }

  .userinfos {
    padding: 10px;
    width: 100%;
    overflow: auto;
    padding-bottom: 64px;
    height: calc(100% - 300px);

    .info {
      border: 1px solid darkblue;
      border-radius: 5px;
      padding: 5px;

      &:not(:first-child) {
        margin-top: 10px;
      }
    }
  }
}
</style>
