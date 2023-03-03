<template>
  <div class="tasks">
    <el-row>
      <el-button @click="back" style="margin-top: 15px">返回</el-button>
    </el-row>

    <h3>从任务库中选择</h3>

    <el-row>
      <el-button @click="importExcel" style="margin-top: 15px">导入 excel</el-button>
    </el-row>

    <el-table :data="tableData" class="tbl1" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column label="创建时间" prop="create_time"></el-table-column>

      <el-table-column label="任务名称" prop="task_name"></el-table-column>

      <el-table-column label="任务来源" prop="banji"></el-table-column>

      <el-table-column label="技术模块" prop="task_module"></el-table-column>

      <el-table-column label="能力目标" prop="target_capability"></el-table-column>
    </el-table>

    <el-row style="margin-top: 20px">
      <el-form label-width="100px" :model="form" :rules="rules" ref="form">
        <el-form-item label="班级" prop="banji">
          <el-select v-model="form.banji" placeholder="请选择年级">
            <el-option v-for="item in banjis" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发布日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-row type="flex" justify="center">
          <el-button type="primary" class="ack" @click="sub">确认发布</el-button>
        </el-row>
      </el-form>
    </el-row>

    <excel ref="excel" @excelAddData="handleEcelAdat"></excel>
  </div>
</template>

<script>
import {addFabu, getBanjis, getFabuData, getkuData, getNianjis} from "@/api/user";
import Excel from './import-file.vue'

export default {
  name: "tasks",
  props: {},
  components: {
    Excel
  },
  data() {
    const {dept_id = [], dept_name = []} = JSON.parse(localStorage.getItem("dep") ?? "{}");
    let banjis = dept_id.reduce((prev, cur, i) => {
      prev.push({
        value: cur,
        label: dept_name[i],
      });
      return prev;
    }, []);
    return {
      chart: undefined,
      tableData: [],
      banjis: banjis,
      form: {
        banji: "",
        date: "",
      },
      multipleSelection: [],

      rules: {
        date: [{required: true, trigger: "change", message: "请选择"}],
        banji: [{required: true, trigger: "change", message: "请选择"}],
      },
    };
  },
  watch: {},
  created() {
  },
  beforeDestroy() {
  },
  mounted() {
    this.init();
  },
  methods: {
    sub() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (!this.multipleSelection.length) {
            return this.$message.warning("请选择任务");
          }
          let task = JSON.parse(localStorage.getItem('task_no') ?? '{}')
          let task_no = task?.v ?? 1;

          //
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let data = {
              ...this.multipleSelection[i],
              id: undefined,
              task_no: task_no + i,
              dept_id: this.form.banji,
              target_score: 10,
              task_day: this.form.date
            }
            addFabu(data).then(res => {
            }).catch(err => {
            })
          }
          setTimeout(() => {
            localStorage.setItem('task_no', JSON.stringify({...task, task_no: task_no + this.multipleSelection.length}))
          }, 1000)


          this.$message.success('发布成功')
          this.multipleSelection = [];
          this.init();
          this.$refs.form.resetFields()
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEcelAdat(data) {
      this.tableData = this.tableData.concat(data)
    },
    init() {
      let data = {
        dept_id: JSON.parse(localStorage.getItem("dep") ?? "{}")?.dept_id?.[0] ?? "",
      };
      getkuData(data).then((res) => {
        this.tableData = res?.result?.result ?? [];
      });
    },
    importExcel() {
      // this.$router.push("/batchFabu");
      l("importExcel");
      this.$refs.excel.init()
    },
    back() {
      this.$router.push("/fabus");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tasks {
}

.tbl1 {
  margin-top: 10px;
}

.ack {
  width: 160px;
}
</style>
