<template>
  <el-dialog :title="title" width="320px" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetDialogData">
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="任务名称">{{ info.task_name }}</el-descriptions-item>
      <el-descriptions-item label="剩余时间">{{ info.countdown }}</el-descriptions-item>
      <el-descriptions-item label="图片" >
        <img :src="info.content" class="cccccccccccc" />
      </el-descriptions-item>
    </el-descriptions>

    <template slot="footer" class="dialog-footer">
      <el-button @click="resetDialogData">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      visible: false,
      info: {},
      title: null,
    };
  },
  methods: {
    init(info) {
      console.log("info", info);
      this.visible = true;
      this.title = `查看详情`;
      this.$nextTick(() => {
        this.info = { ...info };
      });
    },
    resetDialogData() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  font-size: 24px;
  margin-right: 10px;
}
.cccccccccccc{
  max-width: 280px;
}
</style>
