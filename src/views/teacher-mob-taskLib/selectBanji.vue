<template>
  <el-dialog :title="title" width="320px" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetDialogData">
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
        <el-select v-model="form.banji" placeholder="" style="width: 100%">
          <el-option v-for="item in banjis" :key="item.value" :label="item.label" :value="item.value" style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确认发布</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { checkContestInfo, editContestInfo, saveContestInfo } from "@/api/contestManage";
import { addFabu, addTask, addUser, editusertInfo } from "@/api/user";

export default {
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
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",
      otherData: {},
      banjis: banjis,
      flag: "",
      form: {
        date: undefined,
        // nianji: undefined,
        banji: undefined,
      },
      dep: JSON.parse(localStorage.getItem("dep")),

      dataRule: {
        date: [{ required: true, trigger: "change", message: "请选择" }],
        nianji: [{ required: true, trigger: "change", message: "请选择" }],
        banji: [{ required: true, trigger: "change", message: "请选择" }],
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
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let task_no = (JSON.parse(localStorage.getItem("task_no") ?? "{}")?.v ?? "") + "";

          // if (this.flag === "保存到任务库并发布") {
          //   const data1 = {
          //     ...this.otherData,
          //     dept_id: this.dep.dept_id?.[0] ?? "",
          //   };
          //   // 保存到任务库
          //   addTask(data1).then((res) => {
          //     // 发布任务
          //     addFabu({
          //       ...this.otherData,
          //       task_no,
          //       target_score: 10,
          //       task_day: this.form.date,
          //       dept_id: this.form.banji,
          //     }).then(() => {
          //       this.$message.success("保存到任务库并发布成功");
          //       // update no
          //       localStorage.setItem(
          //         "task_no",
          //         JSON.stringify({
          //           ...JSON.parse(localStorage.getItem("task_no")),
          //           v: +task_no + 1,
          //         })
          //       );
          //       this.resetDialogData();
          //     });
          //   });
          // } else {
          //
          // }
          //
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
                  dept_id: this.form.banji,
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
