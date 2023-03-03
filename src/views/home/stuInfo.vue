<template>
  <div class="stuInfo" v-if="info">
    <el-row type="flex" justify="space-between" align="middle">
      <div>姓名: {{ info.user_name }}</div>
      <div>ID: {{ info.userid }}</div>
      <div>学号: {{ info.student_no }}</div>
      <div>班级: {{ info.dept_name }}</div>
    </el-row>

    <el-row type="flex" justify="space-between" align="middle">
      <div>小组: {{ info.child_dept_name }}</div>
      <div>手机号: {{ info.mobile }}</div>
      <!--      <div>职位: {{ info.zhiwei }}</div>-->
      <div>性别: {{ info.sex }}</div>
      <div>邮箱: {{ info.email }}</div>
      <div>行政班级: {{ info["行政班级"] }}</div>
      <el-button @click="editStu">编辑</el-button>
    </el-row>

    <add-or-update ref="stuInfo"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./add-or-update.vue";

export default {
  name: "StuInfo",
  components: {
    AddOrUpdate,
  },
  props: {
    info: {},
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    editStu() {
      this.$refs.stuInfo.init(this.info);
    },
  },
};
</script>

<style lang="scss" scoped>
.stuInfo {
}
</style>
