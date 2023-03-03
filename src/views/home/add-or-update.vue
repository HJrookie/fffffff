<template>
  <el-dialog :title="title" width="600px" :modal-append-to-body="false" :close-on-click-modal="false"
             :visible.sync="visible" :before-close="resetDialogData">
    <el-form ref="form" :model="form" :rules="dataRule" label-width="100px">
      <el-form-item label="学生姓名" prop="user_name">
        <el-input size="small" v-model="form.user_name" maxlength="90" placeholder="请输入学生姓名"
                  clearable/>
        <!--        <input id="hiddenText" type="text" style="display: none"/>-->
      </el-form-item>

      <el-form-item label="学号" prop="student_no">
        <el-input size="small" v-model="form.student_no" disabled placeholder="请输入学号" clearable/>
      </el-form-item>

      <el-form-item label="行政班级" prop="xzbj" disabled>
        <el-input size="small" v-model="form.xzbj" placeholder="" disabled clearable/>
      </el-form-item>

      <el-form-item label="班级" prop="dept_name" disabled>
        <el-input size="small" v-model="form.dept_name" placeholder="请输入班级" disabled clearable/>
      </el-form-item>


      <el-form-item label="手机号" prop="mobile">
        <el-input size="small" v-model="form.mobile" placeholder="请输入手机号" clearable/>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-input size="small" v-model="form.sex" placeholder="请输入性别" clearable/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input size="small" v-model="form.email" placeholder="请输入邮箱" clearable/>
      </el-form-item>
      <el-form-item label="小组" prop="child_dept_name">
        <el-input size="small" v-model="form.child_dept_name" placeholder="请输入小组" clearable/>
      </el-form-item>

      <el-form-item label="职位" prop="title">
        <el-input size="small" v-model="form.title" placeholder="请输入职位" clearable/>
      </el-form-item>


    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetDialogData">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {checkContestInfo, editContestInfo, saveContestInfo} from "@/api/contestManage";
import {debounce} from "@/utils";
import {addUser, editusertInfo} from "@/api/user";

export default {
  data() {
    return {
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",
      timer: null,
      form: {
        user_name: "",
        "student_no": "",
        "child_dept_name": "",
        "dept_id": '',
        "dept_name": "",
        "parent_id": '',
        "mobile": "",
        "title": "",
        "email": "",
        "sex": "",
        "xzbj": "",
      },
      dataRule: {
        user_name: [{required: true, trigger: "change", message: '请输入姓名'}],
        child_dept_name: [{required: true, trigger: "change", message: '请输入小组'}],
        mobile: [{required: true, trigger: "change", message: '请输入手机号'}],
        title: [{required: true, trigger: "change", message: '请输入职位'}],
        email: [{required: true, trigger: "change", message: '请输入邮箱'}],
        sex: [{required: true, trigger: "change", message: '请输入性别'}],
      },
    };
  },
  methods: {
    init(info) {
      console.log("info", info);
      this.visible = true;
      this.isUpdate = info ? true : false;
      this.title = `${info ? "修改" : "添加"}学生`;
      this.$nextTick(() => {
        this.$refs.form?.resetFields();
        if (info) {
          this.id = info.userid ?? undefined;
          this.form = {
            ...info, xzbj: info['行政班级']
          };
        }
      });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = {
            ...this.form
          };
          delete data.xzbj;
          delete data['行政班级'];
          // 如果有 id ,就是修改,否则, 就是新建
          const ajaxFunc = this.id ? editusertInfo : addUser;
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
