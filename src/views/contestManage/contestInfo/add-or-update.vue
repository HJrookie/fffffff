<template>
  <el-dialog :title="title" width="500px" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetDialogData">
    <el-form ref="form" :model="form" :rules="dataRule" label-width="auto" class="el-form-fixed">
      <el-form-item label="赛事名称" prop="name">
        <el-input
          size="small"
          :value="form.name"
          @input="handleNameChange"
          maxlength="90"
          placeholder="请输入赛事名称"
          @keyup.enter.native="submitForm"
          clearable
        />
        <input id="hiddenText" type="text" style="display: none" />
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

export default {
  data() {
    const validName = (rule, value, callback) => {
      if (!value || !value.trim().length) {
        callback(new Error("请输入赛事名称"));
      } else {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () => {
          const value = await checkContestInfo({
            id: this.id,
            competitionName: this.form.name,
          });

          if (value) {
            callback();
          } else {
            callback(new Error(`名称 ${this.form.name} 已存在`));
          }
        }, 500);
      }
    };

    return {
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",
      timer: null,
      form: {
        name: "",
      },
      dataRule: {
        name: [{ required: true, trigger: "change", validator: validName }],
      },
    };
  },
  methods: {
    init(info) {
      console.log("info", info);
      this.visible = true;
      this.isUpdate = info ? true : false;
      this.title = `${info ? "修改" : "添加"}赛事`;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        if (info) {
          const { competitionName: name } = info;
          this.id = info.id ?? undefined;
          this.form = {
            name,
          };
        }
      });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const result = await checkContestInfo({
            id: this.id,
            competitionName: this.form.name,
          });
          if (!result) {
            this.$message.error(`名称 ${this.form.name} 已存在`);
            return;
          }
          const data = {
            competitionName: this.form.name ?? undefined,
            id: this.id,
          };
          // 如果有 id ,就是修改,否则, 就是新建
          const ajaxFunc = this.id ? editContestInfo : saveContestInfo;
          ajaxFunc(data)
            .then((res) => {
              this.$message.success(`${this.isUpdate ? "修改" : "新增"}成功`);
              this.$emit("refreshDataList");
              this.resetDialogData();
            })
            .catch(() => {
              // this.$message.error(`${this.isUpdate ? "修改" : "新增"}失败`);
              this.$emit("refreshDataList");
              this.resetDialogData();
            });
        }
      });
    },
    handleNameChange(v) {
      this.form.name = v;
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
