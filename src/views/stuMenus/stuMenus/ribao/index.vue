<template>
  <div class="ribao">
    <div class="wrapper">
      <el-button @click="goBack" icon="el-icon-arrow-left">返回</el-button>

      <h3>日报</h3>
      <hr />
      <el-form ref="form" size="small" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="任务日期" prop="date">
          <el-select v-model="form.date" placeholder="请选择任务日期" filterable clearable style="width: 100%">
            <el-option v-for="item in dates" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="任务得分" prop="score">
          <el-input v-model="form.score" placeholder="请输入任务得分" maxlength="90" clearable style="width: 100%" />
        </el-form-item>

        <el-form-item label="任务图片" prop="pics">
          <el-upload ref="upload" :action="uploadUrl" list-type="picture-card" :on-success="handleSuccess" :on-remove="handleRemove" accept="image/*">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <!--                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">-->
                <!--                  <i class="el-icon-download"></i>-->
                <!--                </span>-->
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                  <!--                  -->
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="今日总结" prop="zongjie">
          <el-input type="textarea" placeholder="请输入今日总结" v-model="form.zongjie" maxlength="30" rows="10" show-word-limit> </el-input>
        </el-form-item>

        <el-form-item label="问题汇总" prop="wenti">
          <el-input type="textarea" placeholder="请输入问题汇总" v-model="form.wenti" maxlength="30" rows="10" show-word-limit> </el-input>
        </el-form-item>

        <el-form-item>
          <el-row type="flex" justify="center">
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getDates, getRibaoInfo } from "@/api/user";
import { checkContestInfo, editContestInfo, saveContestInfo } from "@/api/contestManage";

export default {
  name: "ribao",
  data() {
    return {
      form: {
        pics: [],
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      dates: [],
      rules: {
        date: [{ required: true, trigger: "change", message: "请选择日期" }],
        score: [{ required: true, trigger: "change", message: "请输入分数" }],
        pics: [{ required: true, trigger: "change", message: "请上传图片" }],
        zongjie: [{ required: true, trigger: "change", message: "请输入今日总结" }],
        wenti: [{ required: true, trigger: "change", message: "请输入问题汇总" }],
      },

      //
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // getRibaoInfo({}).then((res) => {
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
    handleRemove(file) {
      let uploadFiles = this.$refs.upload.uploadFiles;
      uploadFiles.forEach((v, i) => {
        if (v.response.id === file.response.id) {
          uploadFiles.splice(i, 1);
        }
      });
      this.form.pics = this.form.pics.filter((v) => v.response.id !== file.response.id);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      // l("sssssssssss", response, file, fileList);
      this.form.pics.push({
        file: file,
        response,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ribao {
  height: 100%;
  background: #f1f1f1;
  padding-top: 100px;
  .wrapper {
    width: 800px;
    margin: 0 auto;
  }
  .el-form-item {
    margin-bottom: 20px;
  }

  //padding-top: 100px;
}
</style>
