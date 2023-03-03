<template>
  <el-dialog :title="title" width="600px" :modal-append-to-body="false" :close-on-click-modal="false"
             :visible.sync="visible" :before-close="resetDialogData">
    <el-row style="margin-top: 20px">
      <el-form label-width="100px" :model="form" :rules="rules" ref="form">

        <input type="file" style="display: none" ref="file" @change="handleCcc"></input>
        <el-form-item label="Excel文件" prop="wenjian">
          <el-row type="flex">
            <el-input v-model="form.name" disabled></el-input>
            <el-button style="margin-left: 20px;" @click="hhhh">选择文件</el-button>
          </el-row>
        </el-form-item>

      </el-form>
    </el-row>

  </el-dialog>


</template>

<script>
import {addFabu, getBanjis, getFabuData, getkuData, getNianjis} from "@/api/user";
import moment from "moment";
// import  XLSX from "https://cdn.sheetjs.com/xlsx-0.19.2/xlsx-0.19.2.tgz"
export default {
  props: {},
  data() {

    return {
      visible: false,
      isUpdate: false,
      id: undefined,
      title: "",
      timer: null,
      form: {name: ''},

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
  },
  methods: {
    sub() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {


        }
      });
    },
    init(info) {
      console.log("info", info);
      this.visible = true;
      this.isUpdate = info ? true : false;
      this.title = '导入文件';
      this.$nextTick(() => {
        this.$refs.form?.resetFields();

      });
    },
    hhhh() {
      this.$refs.file.click();
    },
    handleCcc(v) {
      let files = v.target.files;
      let file = files[0]
      this.form.name = file.name;
      var reader = new FileReader();
      reader.readAsBinaryString(file);

      let _this = this;
      reader.onload = function (e) {
        var data = e.target.result;
        var wb = XLSX.read(data, {type: 'binary'});

        let sheetName = wb.SheetNames[1]   // 获取文档中第一个sheet页签的名字
        let sheets = wb.Sheets[sheetName]   // 获sheet名页签下的数据
        _this.readfile(sheets)


        // l(wb.SheetNames)
        console.log(sheets);   // 返回sheet对象到控制台
      };
    },
    resetDialogData() {
      this.id = undefined;
      this.isUpdate = false;
      this.visible = false;
    },
    readfile(data) {
      // get all rows
      const {c: name_c, res: name_res} = this.getRow(data, 'B')
      const {c: tecl_c, res: tecl_res} = this.getRow(data, 'C')
      const {c: capb_c, res: capb_res} = this.getRow(data, 'D')
      if (name_c !== tecl_c || name_c !== capb_c) {
        return this.$message.error('请确保excel文件中B,C,D的列行数相同')
      }
      const result = name_res.reduce((prev, cur, i) => {
        prev.push({
          "task_name": name_res[i],
          "task_module": tecl_res[i],
          "target_capability": capb_res[i],
            create_time: moment().format(`YYYY-MM-DD HH:mm:ss`)
        })
        return prev;
      }, []);
      this.$emit('excelAddData',result)
    },
    getRow(data, str) {
      let keys = Object.keys(data)
      let c = 0, res = [];
      keys.forEach(v => {
        if (v.includes(str)) {
          c++;
          res.push(data[v]?.v?.trim())
        }
      })
      return {
        c, res
      };
    }
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
