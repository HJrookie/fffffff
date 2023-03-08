<template>
  <el-dialog :title="title" width="500px" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetDialogData">
    <el-descriptions title="宿舍信息" :column="2" size="small" border>
      <el-descriptions-item>
        <template slot="label"> 宿舍名称 </template>
        {{ info.dormName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 宿舍楼层 </template>
        {{ info.dormFloor }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 人数 </template>
        {{ info.nowNumber }} / {{ info.number }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 窗户方向 </template>
        {{ info.orientation === 0 ? "上" : "下" }}
      </el-descriptions-item>
    </el-descriptions>

    <el-table :data="tableData" class="tbl1">
      <el-table-column label="用户id" prop="userId"> </el-table-column>
      <el-table-column label="姓名" prop="userName"> </el-table-column>
      <el-table-column label="手机号" prop="phone"> </el-table-column>
      <el-table-column label="床号" prop="bedId"> </el-table-column>

      <!--      <el-table-column label="操作" width="240px" align="center" fixed="right">-->
      <!--        <template scope="scope">-->
      <!--          <el-button size="small" type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-button>-->

      <!--          <el-button size="small" style="margin-left: 10px" type="danger" @click="deleteSuseh(scope.$index, scope.row)">删除</el-button>-->
      <!--          <el-button size="small" @click="getUsers(scope.$index, scope.row)">查看住户</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <template slot="footer" class="dialog-footer">
      <!--      <el-button type="primary" @click="submitForm">确 定</el-button>-->
      <el-button @click="resetDialogData">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { checkContestInfo, editContestInfo, saveContestInfo } from "@/api/contestManage";
import { debounce } from "@/utils";
import { addSushe, getRoomDetail, updatsuseh } from "@/api/user";

export default {
  data() {
    return {
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",

      info: {},
      tableData: [],
    };
  },
  methods: {
    init(info) {
      console.log("info", info);
      this.visible = true;
      this.isUpdate = info ? true : false;
      this.title = `查看住户`;
      this.info = { ...info };

      // this.$nextTick(() => {
      //   this.$refs.form?.resetFields();
      //   if (info) {
      //   }
      // });

      getRoomDetail({ dormId: info.dormId })
        .then((res) => {
          this.tableData = res?.data ?? [];
          // this.$router.push("/roomDetail" + "/" + v.id);
        })
        .catch((err) => {});
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
      this.tableData = [];
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tbl1 {
  margin-top: 10px;
}
.btn {
  cursor: pointer;
  font-size: 24px;
  margin-right: 10px;
}
</style>
