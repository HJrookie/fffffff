<template>
  <div class="StuMy">
    <div>
      <el-form :label-width="ismob ? '100px' : '50px'" :model="form">
        <template v-if="ismob">
          <el-form-item label="开始时间">
            <el-date-picker :value="form.t1" @input="hdt1" type="date" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间">
            <el-date-picker :value="form.t2" @input="hdt2" type="date" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </template>
        <el-form-item label="时间" v-else>
          <el-date-picker v-model="form.date" type="daterange" range-separator="-" start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form>

      <!--      <el-tag v-for="tag in students" :key="tag.id">-->
      <!--        {{ tag.label }}-->
      <!--      </el-tag>-->

      <el-row>
        <stu-info :info="info"></stu-info>
      </el-row>
    </div>

    <dazi :props="props"></dazi>
    <danci :props="props"></danci>
    <kaoqin :props="props"></kaoqin>
    <ketang :props="props"></ketang>

    <!--    {{ selectedStus }}-->
  </div>
</template>

<script>
import StuInfo from "@/views/home/stuInfo.vue";
import Dazi from "./charts/dazi.vue";
import Danci from "./charts/danci.vue";
import Kaoqin from "./charts/kaoqin.vue";
import Ketang from "./charts/ketang.vue";
import { getUserDetail } from "@/api/user";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "StuMy",
  components: {
    // AddOrUpdate,
    StuInfo,
    Dazi,
    Danci,
    Kaoqin,
    Ketang,
  },
  props: {},
  data() {
    let time_now = moment().format(`YYYY-MM-DD HH:mm:ss`);
    let timeBefore = moment().add(-7, "d").format(`YYYY-MM-DD HH:mm:ss`);
    return {
      form: {
        date: [timeBefore, time_now],
        t1: moment().add(-7, "d").format(`YYYY-MM-DD HH:mm:ss`),
        t2: moment().format(`YYYY-MM-DD HH:mm:ss`),
      },
      info: "",
      props: {},
      ismob: "",
    };
  },
  watch: {},
  mounted() {
    this.ismob = document.body.clientWidth < 766;
    this.getStuData();
    this.props = {
      userid: this.activeStu.userid,
      // start_time: this.form.date?.[0] ?? "",
      // end_time: this.form.date?.[1] ?? "",
      start_time: "2022-12-03 12:00:00",
      end_time: "2023-01-13 12:00:00",
    };
    this.$nextTick(() => {
      this.$EventBus.$emit("getData");
    });
  },
  computed: {
    ...mapGetters(["students", "activeStu", "activeMenu", "menuData"]),
  },
  methods: {
    getStuData(id) {
      if (!id) {
        this.info = "";
        return;
      }
      getUserDetail({
        userid: id ? id : this.activeStu.userid,
      }).then((res) => {
        this.info = res?.result?.result?.[0] ?? {};
      });
    },
    init() {
      this.props = {
        userid: this.activeStu.userid,
        start_time: this.ismob ? this.form.t1 : this.form.date?.[0] ?? "",
        end_time: this.ismob ? this.form.t2 : this.form.date?.[1] ?? "",
      };
      l(9999)
      this.$nextTick(() => {
        this.$EventBus.$emit("getData");
      });
    },
    hdt1(v) {
      this.form.t1 = v;
      this.init(0);
    },
    hdt2(v) {
      this.form.t2 = v;
      this.init(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.StuMy {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  //margin-left: 300px;
  overflow: auto;
  padding-bottom: 40px;

  .el-tag + .el-tag {
    margin-left: 8px;
  }

  ::v-deep .el-tag {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
  }
}
</style>
