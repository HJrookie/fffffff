<template>
  <div class="right">
    <div>
      <el-form label-width="100px" :model="form">
        <el-form-item label="时间范围">
          <el-date-picker v-model="form.date" type="daterange" range-separator="-" start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form>

      <transition-group>
        <el-tag v-for="tag in students" :key="tag.id" closable :type="getType(tag)" @close="handleClose(...arguments, tag)" @click="handleTagClick(tag)">
          {{ tag.label }}
        </el-tag>
      </transition-group>

      <el-row>
        <stu-info :info="info"></stu-info>
      </el-row>
    </div>

        <dazi :props="props"></dazi>
<!--        <danci :props="props"></danci>-->
    <!--    <kaoqin :props="props"></kaoqin>-->
<!--    <ketang :props="props"></ketang>-->
    <!---->
    <!--    {{ selectedStus }}-->
  </div>
</template>

<script>
import StuInfo from "./stuInfo.vue";
import Dazi from "./charts/dazi.vue";
import Danci from "./charts/danci.vue";
import Kaoqin from "./charts/kaoqin.vue";
import Ketang from "./charts/ketang.vue";
import { getUserDetail } from "@/api/user";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "Right",
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
      },
      info: "",
      props: {},
    };
  },
  watch: {
    activeStu(newV, oldV) {
      l("activeStu  - v", newV, oldV);

      this.props = {
        userid: this.activeStu.userid,
        // start_time: this.form.date?.[0] ?? '',
        // end_time: this.form.date?.[1] ?? ''
        start_time: "2022-10-03 12:00:00",
        end_time: "2023-01-13 12:00:00",
      };
      this.$nextTick(() => {
        this.$EventBus.$emit("getData");
        this.getStuData(newV.id);
      });
    },
    deep: true,
    // immediatr: true
  },
  mounted() {
    this.props = {
      userid: this.activeStu.userid,
      // start_time: this.form.date?.[0] ?? '',
      // end_time: this.form.date?.[1] ?? ''
      start_time: "2022-10-03 12:00:00",
      end_time: "2023-01-13 12:00:00",
    };
    this.$nextTick(() => {
      this.$EventBus.$emit("getData");
      this.getStuData(this.activeStu.id);
    });
    // this.date[0] =  moment().format(`YYYY-MM-DD HH:mm:ss`)
    // this.date[1] =  moment().add(-7, 'd').format(`YYYY-MM-DD HH:mm:ss`)
  },
  computed: {
    ...mapGetters(["students", "activeStu", "activeMenu", "menuData"]),
  },
  methods: {
    handleClose(a, item) {
      // l(444, this.activeMenu)
      // let data = {item,}
      const _menu = this.menuData.find((v) => v.id === this.activeMenu.id);

      this.$store.dispatch("app/updateMenuData", { item, menu: _menu, targetStatus: false });
    },
    handleTagClick(item) {
      this.$store.commit("app/SET_ACTIVE_STU", item);
    },
    getType(tag) {
      return this.activeStu?.id === tag?.id ? "" : "info";
    },
    getStuData(id) {
      if (!id) {
        this.info = "";
        return;
      }
      getUserDetail({
        userid: id ? id : this.activeStu.id,
      }).then((res) => {
        this.info = res?.result?.result?.[0] ?? {};
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.right {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  //margin-left: 300px;

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
