<template>
  <div class="danci"></div>
</template>

<script>
export default {
  name: "danci",
  data() {
    return {};
  },
  methods: {
    goTarget(v) {
      // 打字 单词 日报 项目 考试 课堂任务
      l(v);
      // window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.danci {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  padding-top: 100px;
}
</style>
