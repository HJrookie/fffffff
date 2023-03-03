<template>
  <div class="app-container">
    <div class="query-form">
      <my-form :data="form" ref="form">
        <template v-slot:buttons>
          <el-form-item style="margin-left: 0px">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="query()">查 询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetHandle()">重 置</el-button>
          </el-form-item>
        </template>
      </my-form>
    </div>

    <div class="table-wrapper">
      <el-row style="margin-bottom: 8px">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addNew()">新增</el-button>
      </el-row>

      <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="80" align="center"> </el-table-column>
        <el-table-column prop="annualName" label="最近举办" show-overflow-tooltip min-width="80" />
        <el-table-column prop="status" label="状态" show-overflow-tooltip width="80px" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="dicts.contestStatusMap[row.status]" :type="dicts.contestStatusColorMap[row.status]"> {{ dicts.contestStatusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="80"> </el-table-column>
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="{ row }">
            <div class="tbl-col-hover table-col-operations">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="edit(row)">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" class="table-pagination">
        <el-pagination
          background
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="page"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
    <add-or-update @refreshDataList="query" ref="addOrUpdateRef" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import { getContestInfoOne, deleteContestInfo } from "@/api/contestManage";
import FormTableMixins from "@/mixins";
import { mapGetters } from "vuex";

import AddOrUpdate from "./add-or-update.vue";
export default {
  name: "ContestManage-ContestInfo",
  components: {
    AddOrUpdate,
  },
  mixins: [FormTableMixins],
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name: competitionName, status } = formData;
      return {
        status,
        competitionName,
        ...pagination,
      };
    };
    return {
      mixinOptions: {
        deleteAjax: deleteContestInfo,
        getDataListAjax: getContestInfoOne,
        "queryDataFormatter": queryDataFormatter,
      },
      form: {
        // form 的配置
        formConfig: {
          inline: true,
          ref: "test-form-ref", // form的 ref
          labelWidth: "75px",
        },
        // form-item 的配置
        items: [
          {
            prop: "name",
            value: undefined,
            label: "赛事名称",
            inputType: "input",
            blankPlaceholder: false,
          },
          {
            prop: "status",
            value: undefined,
            label: "状态",
            inputType: "select",
            options: "contestStatus",
          },
        ],
      },

      loading: false,
      addOrUpdateVisible: false,
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  computed: {
    ...mapGetters(["dicts"]),
  },
  methods: {
    addNew(rowInfo) {
      console.log("rowInfo", rowInfo);
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(rowInfo);
      });
    },
    edit(rowInfo) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(rowInfo);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query();
    },
  },
};
</script>

<style lang="scss" scoped></style>
