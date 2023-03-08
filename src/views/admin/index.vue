<template>
  <div class="Admin">
    <el-row>
      <el-button @click="addNewLine" style="margin-top: 15px">新增</el-button>
    </el-row>

    <el-table :data="tableData" class="tbl1">
      <el-table-column label="宿舍 id" prop="dormId"> </el-table-column>
      <el-table-column label="宿舍名称" prop="task_name">
        <template v-slot:default="row">
          <div>{{ row.row.dormFloor }} - {{ row.row.dormName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="人数" prop="banji">
        <template v-slot:default="row">
          <div>{{ row.row.nowNumber }} / {{ row.row.number }}</div>
        </template>
      </el-table-column>
      <el-table-column label="窗户方向" prop="banji">
        <template v-slot:default="row">
          <div>{{ row.row.orientation === 0 ? "上" : "下" }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="240px" align="center" fixed="right">
        <template scope="scope">
          <el-button size="small" type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-button>

          <el-button size="small" style="margin-left: 10px" type="danger" @click="deleteSuseh(scope.$index, scope.row)">删除</el-button>
          <el-button size="small" @click="getUsers(scope.$index, scope.row)">查看住户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update @refresh="init" ref="addOrUpdateRef"></add-or-update>
    <user-list @refresh="init" v-if="vvv" ref="userListRef"></user-list>
  </div>
</template>

<script>
import { getFabuData, addFabu, deleteFabu, updateFabu, deletekaoqin, getRooms, getRoomDetail, deleteSushe } from "@/api/user";
import * as echarts from "echarts";
import moment from "moment/moment";
import AddOrUpdate from "./add-or-update";
import UserList from "./userList";

export default {
  name: "tasks",
  components: { AddOrUpdate, UserList },
  props: {},
  data() {
    return {
      chart: undefined,
      vvv: false,
      tableData: [],
      userData: [], //宿舍人的信息
    };
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      getRooms()
        .then((res) => {
          this.tableData = res?.data ?? [];
        })
        .catch((err) => {});
    },
    addNewLine(info) {
      // this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init();
      });
    },
    handleDelete(index, row) {
      if (row.id) {
        deleteFabu({
          dept_id: row.dept_id ?? "",
          task_no: row?.task_no ?? "",
          task_day: row?.task_day ?? "",
        }).then((res) => {
          this.init();
        });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    editRow(index, row) {
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(row);
      });
    },
    deleteSuseh(index, row) {
      this.$confirm(`是否确认删除该宿舍`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          l(999999999);
          deleteSushe({ dormId: row.dormId })
            .then((res) => {
              this.$message.success("删除成功");
              this.init();
            })
            .catch((err) => {
              this.$message.error("删除失败");
              this.init();
            });
        })
        .catch(() => {});
    },
    getUsers(index, row) {
      this.vvv = true;
      this.$nextTick(() => {
        this.$refs.userListRef.init(row);
      });
    },
    batchAdd() {
      this.$router.push("/batchFabu");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Admin {
  overflow: auto;
  width: 1000px;
  margin: 0 auto;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
}

.tbl1 {
  margin-top: 10px;
}
</style>
