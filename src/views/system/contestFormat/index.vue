<template>
  <div class="container">
    <my-form :data="form" ref="form">
      <template v-slot:buttons>
        <el-form-item style="margin-left: 0px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="query()">查 询 </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetHandle()">重 置 </el-button>
        </el-form-item>
      </template>
    </my-form>

    <el-row style="margin-bottom: 8px">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addNew()">新增</el-button>
    </el-row>
    <my-table :loading="loading" :data="tableData" :cols="cols"></my-table>

    <el-row type="flex" justify="end" class="table-pagination">
      <el-pagination
        background
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
import { getAllOthersHumans } from "@/api/contestManage";
import FormTableMixins from "@/mixins";

export default {
  name: "AllContestFormats", //  赛制
  mixins: [FormTableMixins],

  data() {
    const queryDataFormatter = (formData, pagination) => {
      return {
        a: 1,
        b: 2,
        c: 3,
        ...formData,
        ...pagination,
      };
    };
    return {
      activeTabName: "今年",
      detailVis: false,
      mixinOptions: {
        getDataListAjax: getAllOthersHumans,
        "queryDataFormatter": queryDataFormatter,
      },

      form: {
        // form 的配置
        formConfig: {
          inline: true,
          labelWidth: "75px",
        },
        // form-item 的配置
        items: [
          {
            prop: "name",
            value: undefined,
            label: "赛事名称",
            inputType: "select",
            blankPlaceholder: false,
            options: "sys_contest_names",
          },
          {
            prop: "contestPeriod",
            value: undefined,
            label: "赛届",
            inputType: "select",
            blankPlaceholder: false,
            options: "sys_contest_periods",
          },
          {
            prop: "contestItem",
            value: undefined,
            label: "赛项",
            inputType: "select",
            blankPlaceholder: false,
            options: "sys_contest_items",
          },
        ],
      },
      cols: [
        { prop: "companyCode", label: "单位名称", minWidth: 80 },
        { prop: "test", label: "赛事名称", minWidth: 80 },
        { prop: "te1s22t", label: "赛届", minWidth: 80 },
        { prop: "ttt", label: "举办年份", minWidth: 80 },
        { prop: "fsdf ", label: "赛项", minWidth: 80 },
        { prop: "fsdfsdf", label: "组别", minWidth: 80 },
        { prop: "aunit", label: "用户名", minWidth: 80 },
        { prop: "sfsfsdfds", label: "身份证号", minWidth: 80 },
        { prop: "f", label: "手机号", minWidth: 80 },
        { prop: "f2", label: "状态", minWidth: 80 },
        {
          prop: "operation",
          label: "操作",
          align: "center",
          minWidth: 200,
          class: "table-col-operations",
          render: (rowInfo) => {
            let btns = [
              {
                text: "查看",
                onClick: (rowInfo) => {
                  this.getDetail(rowInfo);
                },
              },
              {
                text: "导出报名表信息",
                onClick: (rowInfo) => {
                  l("导出报名表信息");
                },
              },
            ];
            return btns;
          },
        },
      ],
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query();
    },
    addNew() {
      console.log("rowInfo");
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(rowInfo);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  margin-top: 10px;

  .form-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
