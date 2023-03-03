<template>
  <div class="tasks">
    <el-row>
      <el-button @click="addNewLine" style="margin-top: 15px">新增</el-button>
      <el-button @click="importExcel" style="margin-top: 15px">导入 excel</el-button>
    </el-row>

    <el-table :data="tableData" class="tbl1">
      <el-table-column label="创建时间" prop="create_time">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.create_time"
                    placeholder="创建时间"></el-input>
          <span v-else>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务名称" prop="task_name">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_name"
                    placeholder="任务名称"></el-input>
          <span v-else>{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务来源" prop="renwulaiyuan">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.renwulaiyuan"
                    placeholder="任务来源"></el-input>
          <span v-else>{{ scope.row.renwulaiyuan }}</span>
        </template>
      </el-table-column>

      <el-table-column label="技术模块" prop="task_module">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_module" placeholder=""></el-input>
          <span v-else>{{ scope.row.task_module }}</span>
        </template>
      </el-table-column>

      <el-table-column label="能力目标" prop="target_capability">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.target_capability"
                    placeholder=""></el-input>
          <span v-else>{{ scope.row.target_capability }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <template v-if="scope.row.isEditing">
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                           title="确认保存？" @confirm="saveRow(scope.$index, scope.row)">
              <el-button size="small" slot="reference">保存</el-button>
            </el-popconfirm>
          </template>

          <el-button size="small" type="primary" v-else @click="editRow(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="primary" v-if="scope.row.isEditing" style="margin-left: 10px"
                     @click="cancelRow(scope.$index, scope.row)">取消
          </el-button>
          <template v-else>
            <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                           title="确定删除？" @confirm="handleDelete(scope.$index, scope.row)">
              <el-button size="small" style="margin-left: 10px" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <excel ref="excel" @excelAddData="handleEcelAdat"></excel>
  </div>
</template>

<script>
import {getTaskData, addTask, deleteTask, updateTask} from "@/api/user";
import * as echarts from "echarts";
import Excel from "./import-file.vue";

export default {
  name: "tasks",
  props: {},
  components: {
    Excel,
  },
  data() {
    return {
      chart: undefined,
      tableData: [], // 原始数据
      options: [
        // todo
        {
          label: "已发布",
          value: 1,
        },
        {
          label: "待发布",
          value: 2,
        },
      ],
    };
  },
  watch: {},
  mounted() {
    this.init(0);
  },
  methods: {
    init() {
      let data = {
        dept_id: JSON.parse(localStorage.getItem("dep") ?? "{}")?.dept_id?.[0] ?? "",
      };
      getTaskData(data).then((res) => {
        this.tableData = res?.result?.result ?? [];
      });
    },
    saveRow(index, row) {
      if (row.id) {
        const data = {
          task_name: row?.task_name ?? "",
          task_module: row?.task_module ?? "",
          target_capability: row?.target_capability ?? "",
          dept_id: row?.dept_id ?? "",
          id: row.id,
        };
        updateTask(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init();
        });
      } else {
        const data = {
          task_name: row?.task_name ?? "",
          task_module: row?.task_module ?? "",
          target_capability: row?.target_capability ?? "",
          dept_id: row?.dept_id ?? "",
        };
        addTask(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init();
        });
      }
    },
    handleDelete(index, row) {
      if (row.id) {
        deleteTask({id: row.id}).then((res) => {
          this.init();
        });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    editRow(index, row) {
      this.$set(row, "isEditing", true);
    },
    cancelRow(index, row) {
      this.$set(row, "isEditing", false);
      if (!row.id) {
        this.tableData.splice(index, 1);
      }
    },
    handleEcelAdat(data) {
      // this.tableData = this.tableData.concat(data);
      let dept_id = JSON.parse(localStorage.getItem("dep") ?? "{}")?.dept_id?.[0] ?? "";
      Promise.all(
        data.map(
          (item) =>
            new Promise((resolve, rej) => {
              let data = {
                ...item,
                dept_id,
                create_time: undefined,
              };
              return addTask(data).then((res) => {
                resolve();
              });
            })
        )
      ).then((res) => {
        l(43434);
        this.init();
      });
    },
    importExcel() {
      this.$refs.excel.init();
    },
    addNewLine() {
      this.tableData.push({
        "create_time": "",
        "task_name": "",
        "rspd_status": "",
        "renwulaiyuan": "",
        "userid": "",
        "stage_date_name": "",
        "isEditing": true,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tasks {
  #main-2 {
    width: 100%;
    min-height: 300px;
    height: 300px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }
}

.tbl1 {
  margin-top: 10px;
}
</style>
