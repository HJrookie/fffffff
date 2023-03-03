<template>
  <el-dialog :title="title" width="320px" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetDialogData">
    <el-form label-width="100px" :model="form" :rules="rules" ref="form" class="form">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="" clearable />
      </el-form-item>

      <el-form-item label="技术模块" prop="jishu">
        <el-select v-model="form.jishu" placeholder="" style="width: 100%">
          <el-option v-for="item in jishus" :key="item.value" :label="item.label" :value="item.value" style="width: 100%"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="能力目标" prop="nengli">
        <el-select v-model="form.nengli" placeholder="" style="width: 100%">
          <el-option v-for="item in nenglis" :key="item.value" :label="item.label" :value="item.value" style="width: 100%"></el-option>
        </el-select>
      </el-form-item>

      <el-row type="flex" justify="center">
        <el-button @click="resetDialogData">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-row>
    </el-form>

    <!--    <template slot="footer" class="dialog-footer">-->
    <!--      <el-button type="primary" @click="submitForm">确认发布</el-button>-->
    <!--    </template>-->
  </el-dialog>
</template>


<script>
import { checkContestInfo, editContestInfo, saveContestInfo } from "@/api/contestManage";
import { addFabu, addTask, addUser, editusertInfo, getBanjis } from "@/api/user";

export default {
  data() {
    return {
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",
      jishus: [],
      nenglis: [],
      otherData: {},
      flag: "",

      dep: JSON.parse(localStorage.getItem("dep")),

      form: {
        name: "",
        jishu: "",
        nengli: "",
      },
      rules: {
        name: [{ required: true, trigger: "blur", message: "请输入" }],
        jishu: [{ required: true, trigger: "change", message: "请选择" }],
        nengli: [{ required: true, trigger: "change", message: "请选择" }],
      },
    };
  },
  methods: {
    init(info, otherData, flag) {
      console.log("info", info);
      this.otherData = otherData ?? {};
      this.flag = flag;
      this.visible = true;
      this.isUpdate = info ? true : false;
      this.title = ``;
      this.$nextTick(() => {
        this.$refs.form?.resetFields();
      });

      getBanjis({
        dept_id: this.dep.dept_id?.[0] ?? "",
      }).then((res) => {
        l(999, res);
        this.jishus = (res?.result?.task_module ?? []).map((v) => ({ label: v, value: v }));
        this.nenglis = (res?.result?.target_capability ?? []).map((v) => ({ label: v, value: v }));
      });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let task_no = (JSON.parse(localStorage.getItem("task_no") ?? "{}")?.v ?? "") + "";

          if (this.flag === "保存到任务库并发布") {
            const data1 = {
              // ...this.otherData,
              task_name: this.form.name,
              task_module: this.form.jishu,
              target_capability: this.form.nengli,
              dept_id: this.otherData.dept_id,
            };
            // 保存到任务库
            addTask(data1).then((res) => {
              // 发布任务
              addFabu({
                ...this.otherData,
                task_name: this.form.name,
                task_module: this.form.jishu,
                target_capability: this.form.nengli,

                task_no,
                target_score: 10,
                // task_day: this.form.date,
                // dept_id: this.dep.dept_id?.[0] ?? "",
              }).then(() => {
                this.$message.success("保存到任务库并发布成功");
                // update no
                localStorage.setItem(
                  "task_no",
                  JSON.stringify({
                    ...JSON.parse(localStorage.getItem("task_no")),
                    v: +task_no + 1,
                  })
                );
                this.resetDialogData();
              });
            });
          } else {
            l(this.otherData);
            // 发布
            Promise.all(
              this.otherData.map((item) => {
                return new Promise((resolve) => {
                  let _data = {
                    target_capability: item.target_capability,
                    task_module: item.target_capability,
                    task_name: item.target_capability,
                    task_no,
                    target_score: 10,
                    task_day: this.form.date,
                    dept_id: this.dep.dept_id?.[0] ?? "",
                  };
                  addFabu(_data).then((res) => {
                    resolve();
                  });
                });
              })
            ).then(() => {
              this.$message.success("发布成功");
            });
          }
          //
        }
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
</style>
