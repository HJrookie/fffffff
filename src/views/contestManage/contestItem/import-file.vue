<template>
  <el-dialog title="导入文件" width="600px" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="form" :model="form" :rules="dataRule" label-width="130px" class="el-form-fixed">
      <!--      <el-form-item label="导入方式" prop="way">-->
      <!--        <el-select v-model="form.way" placeholder="请选择导入方式" filterable clearable>-->
      <!--          <el-option v-for="item in dict.ways" :key="item.value" :label="item.label" :value="item.value" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <el-form-item label="导入模板下载">
        <el-row type="flex" justify="start">
          <el-button type="info" plain icon="el-icon-upload" size="mini" @click="downloadTemplate">赛项批量导入模板</el-button>
        </el-row>
      </el-form-item>

      <el-form-item label="Excel 数据文件" prop="fileName">
        <el-row type="flex">
          <el-input v-model="form.fileName" placeholder="请选择文件" disabled />
          <input type="file" ref="file" style="display: none" @change="handleFileChange" />
          <el-button style="margin-left: 5px" @click="chooseFile" type="primary">选择文件</el-button>
        </el-row>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { saveContestInfo } from "@/api/contestManage";
import { download } from "@/utils/request";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      visible: false,
      isUpdate: false,
      form: {
        way: "",
        file: undefined,
        fileName: undefined,
      },
      dataRule: {
        way: [{ required: true, message: "请选择导入方式", trigger: "blur" }],
        fileName: [{ required: true, message: "请导入Excel 数据文件", trigger: "blur" }],
      },
      dict: {
        ways: [
          {
            value: "Excel 导入",
            label: "Excel 导入",
          },
        ],
      },
    };
  },
  methods: {
    init(info, dict) {
      this.visible = true;
      this.isUpdate = !!info;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        if (info) {
          this.form = {
            ...info,
          };
        }
      });
    },
    downloadTemplate() {
      const url = "";
      download({ url, method: "get", responseType: "blob", headers: { JSESSIONID: getToken() } });
    },
    chooseFile() {
      this.$refs.file.click();
    },
    handleFileChange() {
      const files = event.target.files;
      const rawFile = files[0];
      console.log("file", rawFile);
      this.form.fileName = rawFile.name;
      this.form.file = rawFile;

    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          saveContestInfo(this.form)
            .then((res) => {
              if (res.errorCode === 0) {
                this.$message.success(`${this.isUpdate ? "修改" : "新增"}成功`);
                this.visible = false;
                this.$emit("refreshDataList");
              }
            })
            .catch(() => {});
        }
      });
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
