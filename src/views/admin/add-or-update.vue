<template>
  <el-dialog :title="title" width="500px" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetDialogData">
    <el-form ref="form" :model="form" :rules="dataRule" label-width="auto" class="el-form-fixed">
      <el-form-item label="宿舍名称" prop="dormName">
        <el-input size="small" v-model="form.dormName" maxlength="20" placeholder="请输入宿舍名称" clearable />
      </el-form-item>

      <el-form-item label="宿舍楼层" prop="dormFloor">
        <el-input size="small" v-model="form.dormFloor" maxlength="20" placeholder="请输入宿舍楼层" clearable />
      </el-form-item>

      <el-form-item label="总人数" prop="number">
        <el-input-number v-model="form.number" :min="1" :max="20" label="" style="width: 100%"></el-input-number>
      </el-form-item>

      <el-form-item label="窗户方向" prop="orientation">
        <el-select clearable v-model="form.orientation" style="width: 100%">
          <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetDialogData">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { checkContestInfo, editContestInfo, saveContestInfo } from "@/api/contestManage";
import { debounce } from "@/utils";
import { addSushe, updatsuseh } from "@/api/user";

export default {
  data() {
    return {
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",
      options: [
        {
          label: "上",
          value: 0,
        },
        {
          label: "下",
          value: 1,
        },
      ],
      form: {
        dormName: "",
        dormFloor: "",
        number: undefined,
        orientation: undefined,
      },
      dataRule: {
        dormName: [{ required: true, trigger: "change", message: "请输入宿舍名称" }],
        dormFloor: [{ required: true, trigger: "change", message: "请输入宿舍楼层" }],
        number: [{ required: true, trigger: "change", message: "请输入总人数" }],
        orientation: [{ required: true, trigger: "change", message: "请选择窗户方向" }],
      },
    };
  },
  methods: {
    init(info) {
      console.log("info", info);
      this.visible = true;
      this.isUpdate = info ? true : false;
      this.title = `${info ? "修改" : "添加"}宿舍`;
      this.$nextTick(() => {
        this.$refs.form?.resetFields();
        if (info) {
          this.form = { ...info };
        }
      });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let ajaxFunc = this.isUpdate ? updatsuseh : addSushe;
          let data = { ...this.form };
          ajaxFunc(data)
            .then((res) => {
              this.$message.success(`${this.isUpdate ? "更新" : "新增"}成功`);
              this.resetDialogData();
              this.$emit("refresh");
            })
            .catch((err) => {
              this.$message.error(`${this.isUpdate ? "更新" : "新增"}失败`);
              this.resetDialogData();
              this.$emit("refresh");
            });
        }
      });
    },
    resetDialogData() {
      this.id = undefined;
      this.isUpdate = false;
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
</style>
