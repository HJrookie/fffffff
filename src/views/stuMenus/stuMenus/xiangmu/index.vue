<template>
  <div class="xiangmu">
    <div class="wrapper">
      <el-button @click="goBack" icon="el-icon-arrow-left">返回</el-button>

      <h3>项目</h3>
      <hr />
      <el-form ref="form" size="small" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" maxlength="90" clearable style="width: 100%" />
        </el-form-item>

        <el-form-item label="团队/个人名称" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入团队/个人名称" maxlength="90" clearable style="width: 100%" />
        </el-form-item>

        <el-form-item label="项目地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入项目地址" maxlength="90" clearable style="width: 100%" />
        </el-form-item>

        <el-form-item label="UI设计" prop="design">
          <el-input v-model="form.design" placeholder="请输入UI设计" maxlength="90" clearable style="width: 100%" />
        </el-form-item>

        <el-form-item label="需求文档" prop="xuqiuFiles">
          <el-upload :action="uploadUrl" :on-remove="handleRemoveXuqiu" multiple :limit="3" :file-list="form.xuqiuFiles" :on-success="handleXuqiuSuccess">
            <el-button size="small" type="primary">点击上传需求文档</el-button>
            <!--            <div slot="tip" class="el-upload__tip">请选择需求文档</div>-->
          </el-upload>
        </el-form-item>

        <el-form-item label="UI设计(网页文件)" prop="uiFiles">
          <el-upload :action="uploadUrl" :on-remove="handleRemoveUi" multiple :limit="3" :file-list="form.uiFiles" :on-success="handleUISuccess">
            <el-button size="small" type="primary">点击上传UI设计(网页文件)</el-button>
            <!--            <div slot="tip" class="el-upload__tip">请选择需求文档</div>-->
          </el-upload>
        </el-form-item>

        <el-form-item label="测试用例(pdf 格式)" prop="pdfFiles">
          <el-upload
            :action="uploadUrl"
            :on-remove="handleRemovepdf"
            multiple
            accept="*/pdf"
            :limit="3"
            :file-list="form.pdfFiles"
            :on-success="handlepdfSuccess"
          >
            <el-button size="small">点击上传测试用例(pdf 格式)</el-button>
            <!--            <div slot="tip" class="el-upload__tip">请选择需求文档</div>-->
          </el-upload>
        </el-form-item>

        <el-form-item label="其他文件" prop="otherFiles">
          <el-upload :action="uploadUrl" :on-remove="handleRemoveOther" multiple :limit="3" :file-list="form.otherFiles" :on-success="handleOtherSuccess">
            <el-button size="small" type="primary">点击上传其他文件</el-button>
            <!--            <div slot="tip" class="el-upload__tip">请选择需求文档</div>-->
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-row type="flex" justify="center">
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDates, getxiangmuInfo } from "@/api/user";
import { checkContestInfo, editContestInfo, saveContestInfo } from "@/api/contestManage";

export default {
  name: "xiangmu",
  data() {
    return {
      form: {
        xuqiuFiles: [], // 需求
        uiFiles: [], // ui
        pdfFiles: [], // pdf
        otherFiles: [], // other
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      dates: [],
      rules: {
        projectName: [{ required: true, trigger: "change", message: "请输入项目名称" }],
        personName: [{ required: true, trigger: "change", message: "请输入团队/个人名称" }],
        addr: [{ required: true, trigger: "change", message: "请输入项目地址" }],
        design: [{ required: true, trigger: "change", message: "请输入UI设计" }],
        xuqiuFiles: [{ required: true, trigger: "change", message: "请上传需求文档" }],
        uiFiles: [{ required: true, trigger: "change", message: "请上传UI设计(网页文件)" }],
        pdfFiles: [{ required: true, trigger: "change", message: "请上传测试用例(pdf 格式)" }],
        otherFiles: [{ required: true, trigger: "change", message: "请上传其他文件" }],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // getxiangmuInfo({}).then((res) => {
      //   this.form = {};
      // });
      // getDates().then((res) => {
      //   this.dates = [];
      // });
    },
    submitForm() {
      l(this.form.pics);
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // if (!result) {
          //   this.$message.error(`名称 ${this.form.name} 已存在`);
          //   return;
          // }
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
    goBack() {
      this.$router.push("/stuMenus");
    },
    // 需求
    handleRemoveXuqiu(file) {
      this.form.xuqiuFiles.forEach((item, i) => {
        if (item.response.id === file.response.id) {
          this.form.xuqiuFiles.splice(i, 1);
        }
      });
    },
    handleXuqiuSuccess(response, file, fileList) {
      this.form.xuqiuFiles.push({ ...file, response });
    },
    // ui
    handleRemoveUi(file) {
      this.form.uiFiles.forEach((item, i) => {
        if (item.response.id === file.response.id) {
          this.form.uiFiles.splice(i, 1);
        }
      });
    },
    handleUISuccess(response, file, fileList) {
      this.form.uiFiles.push({ ...file, response });
    },
    // 测试
    handleRemovepdf(file) {
      this.form.pdfFiles.forEach((item, i) => {
        if (item.response.id === file.response.id) {
          this.form.pdfFiles.splice(i, 1);
        }
      });
    },
    handlepdfSuccess(response, file, fileList) {
      this.form.pdfFiles.push({ ...file, response });
    },

    // 其他
    handleRemoveOther(file) {
      this.form.otherFiles.forEach((item, i) => {
        if (item.response.id === file.response.id) {
          this.form.otherFiles.splice(i, 1);
        }
      });
    },
    handleOtherSuccess(response, file, fileList) {
      this.form.otherFiles.push({ ...file, response });
    },
  },
};
</script>

<style scoped lang="scss">
.xiangmu {
  height: 100%;
  background: #f1f1f1;
  padding-top: 60px;
  .wrapper {
    width: 800px;
    margin: 0 auto;
  }
  .el-form-item {
    margin-bottom: 24px;
  }

  //padding-top: 100px;
}
</style>
