<template>
  <div class="stuMenus">
    <el-row type="flex" justify="space-around">
      <el-col :span="6" class="gray">
        <div @click="goTarget('dazi')">111</div>
      </el-col>
      <el-col :span="6" class="gray"> <div @click="goTarget('danci')">111</div> </el-col>
      <el-col :span="6" class="gray"> <div @click="goTarget('ribao')">111</div> </el-col>
    </el-row>

    <el-row type="flex" justify="space-around">
      <el-col :span="6" class="gray"> <div @click="goTarget('xiangmu')">111</div> </el-col>
      <el-col :span="6" class="gray"> <div @click="goTarget('kaoshi')">111</div> </el-col>
      <el-col :span="6" class="gray">
        <div @click="goTarget('ketang')">3434</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "StuMenus",
  data() {
    return {};
  },
  methods: {
    goTarget(v) {
      // 打字 单词 日报 项目 考试 课堂任务
      l(v);

      this.$router.push(`/${v}`).catch(() => {});

      // window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.stuMenus {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  padding-top: 100px;
  .gray {
    transition: all ease-in-out 0.3s;
    cursor: pointer;
    background: white;
    height: 300px;
    line-height: 300px;
    text-align: center;
    border-radius: 10%;
    font-size: 20px;
    margin-bottom: 100px;
    &:hover {
      background: #e0dede;
    }
  }
}
</style>
