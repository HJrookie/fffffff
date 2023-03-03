<template>
  <div class="tasks">
    <el-row>
      <el-form label-width="100px" :model="form">
        <el-form-item label="时间范围">
          <el-date-picker v-model="form.date" type="daterange" range-separator="-" start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-button @click="addNewLine" style="margin-top: 15px">新增发布</el-button>
      <el-button @click="batchAdd" style="margin-top: 15px">批量发布</el-button>
    </el-row>

    <el-table :data="tableData" class="tbl1">
      <el-table-column label="发布时间" prop="task_day">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_day" placeholder="发布时间"></el-input>
          <span v-else>{{ scope.row.task_day }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务名称" prop="task_name">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.task_name" placeholder="任务名称"></el-input>
          <span v-else>{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="班级" prop="banji">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.banji" placeholder="班级"></el-input>
          <span v-else>{{ getbanji(scope) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="入学日期" prop="dept_name">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.dept_name" placeholder="入学日期"></el-input>
          <span v-else>{{ scope.row.dept_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布状态" prop="rspd_status">
        <template scope="scope">
          <template v-if="scope.row.isEditing">
            <el-select v-model="scope.row.rspd_status" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
          <template v-else>
            已发布
            <!--            <span>{{ scope.row.rspd_status === "1" ? "已发布" : "待发布" }}</span>-->
          </template>
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
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.target_capability" placeholder=""></el-input>
          <span v-else>{{ scope.row.target_capability }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务分值" prop="target_score">
        <template scope="scope">
          <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.target_score" placeholder=""></el-input>
          <span v-else>{{ scope.row.target_score }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <template v-if="scope.row.isEditing">
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认保存？" @confirm="saveRow(scope.$index, scope.row)">
              <el-button size="small" slot="reference">保存</el-button>
            </el-popconfirm>
          </template>

          <el-button size="small" type="primary" v-else @click="editRow(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="primary" v-if="scope.row.isEditing" style="margin-left: 10px" @click="cancelRow(scope.$index, scope.row)">取消 </el-button>

          <template v-else>
            <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定删除？" @confirm="handleDelete(scope.$index, scope.row)">
              <el-button size="small" style="margin-left: 10px" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFabuData, addFabu, deleteFabu, updateFabu, deletekaoqin } from "@/api/user";
import * as echarts from "echarts";
import moment from "moment/moment";

export default {
  name: "tasks",
  props: {},
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
      form: {
        date: [moment().add(-30, "d").format(`YYYY-MM-DD HH:mm:ss`), moment().add(30, "d").format(`YYYY-MM-DD HH:mm:ss`)],
      },
      dep: JSON.parse(localStorage.getItem("dep")),
    };
  },
  watch: {},
  created() {},
  beforeDestroy() {},
  mounted() {
    this.init();
  },
  methods: {
    getbanji(v) {
      return v?.row?.dept_name?.slice(0, 3);
    },
    init() {
      let dep = JSON.parse(localStorage.getItem("dep"));

      const data = {
        dept_id: dep.dept_id?.[0] ?? "",
        start_time: this.form.date?.[0] ?? "",
        end_time: this.form.date?.[1] ?? "",
      };
      getFabuData(data).then((res) => {
        this.tableData = res?.result?.result ?? [];
      });
    },
    cancelRow(index, row) {
      this.$set(row, "isEditing", false);
      if (!row.id) {
        this.tableData.splice(index, 1);
      }
    },
    saveRow(index, row) {
      if (row.id) {
        const data = {
          ...row,
        };
        updateFabu(data).then((res) => {
          this.$set(row, "isEditing", false);
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      } else {
        let task_no = (JSON.parse(localStorage.getItem("task_no") ?? "{}")?.v ?? "") + "";

        const data = {
          ...row,
          dept_id: this.dep.dept_id?.[0] ?? "",
          task_no: task_no,
        };
        addFabu(data).then((res) => {
          this.$set(row, "isEditing", false);
          localStorage.setItem(
            "task_no",
            JSON.stringify({
              ...JSON.parse(localStorage.getItem("task_no")),
              v: +task_no + 1,
            })
          );
          this.init().finally(() => {
            this.chart.hideLoading();
          });
        });
      }
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
      this.$set(row, "isEditing", true);
    },
    batchAdd() {
      this.$router.push("/batchFabu");
    },
    addNewLine() {
      this.tableData.push({
        "task_day": "",
        "task_name": "",
        "rspd_status": "",
        "banji": "",
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
