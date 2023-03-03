<template>
  <div class="app-container">
    <div class="query-form">
      <my-form :data="form" ref="form">
        <template v-slot:buttons>
          <el-form-item style="margin-left: 0px">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="query()">查 询 </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetHandle()">重 置 </el-button>
          </el-form-item>
        </template>
      </my-form>
    </div>

    <div class="table-wrapper">
      <el-row style="margin-bottom: 8px">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addNew()">新增</el-button>
      </el-row>

      <!--      <my-table :loading="loading" :data="tableData" :cols="cols"></my-table>-->

      <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="140" align="center" fixed="left"> </el-table-column>
        <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" fixed="left" />
        <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />
        <el-table-column prop="venue" label="举办地" show-overflow-tooltip min-width="80" />
        <el-table-column prop="registrationTimeStart" label="报名开始时间" show-overflow-tooltip min-width="100" />
        <el-table-column prop="registrationTimeEnd" label="报名结束时间" show-overflow-tooltip min-width="100" />
        <el-table-column prop="competitionTimeStart" label="开赛时间" show-overflow-tooltip min-width="100" />
        <el-table-column prop="competitionTimeEnd" label="结赛时间" show-overflow-tooltip min-width="100" />
        <el-table-column prop="status" label="状态" width="80px" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-tag v-if="dicts.contestStatusMap[row.status]" :type="dicts.contestStatusColorMap[row.status]"> {{ dicts.contestStatusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column prop="acount" label="报名人数" show-overflow-tooltip min-width="80" />-->
<!--        <el-table-column prop="humans" label="参赛人数" show-overflow-tooltip min-width="80" />-->

        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="100"> </el-table-column>
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="{ row }">
            <div class="table-col-operations">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

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

    <!--    <el-dialog-->
    <!--      ref="addOrUpdateRef"-->
    <!--      :title="title"-->
    <!--      width="600px"-->
    <!--      :close-on-click-modal="false"-->
    <!--      destroy-on-close-->
    <!--      :visible.sync="addOrUpdateVisible"-->
    <!--      :before-close="resetData"-->
    <!--    >-->
    <!--      <my-form :data="dialog.form" ref="form-dialog">-->
    <!--        <template v-slot:buttons>-->
    <!--          <el-row type="flex" justify="center">-->
    <!--            <el-button type="primary" @click="addOrUpdate()"> 确定 </el-button>-->
    <!--            <el-button @click.prevent="resetData()">取消</el-button>-->
    <!--          </el-row>-->
    <!--        </template>-->
    <!--      </my-form>-->
    <!--    </el-dialog>-->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="query" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import { getContestPeriod, deleteContestPeriod, addContestPeriod, getContestInfo, editContestPeriod } from "@/api/contestManage";
import FormTableMixins from "@/mixins";
import { mapGetters } from "vuex";
import AddOrUpdate from "./add-or-update.vue";

export default {
  name: "ContestManage-ContestPeriod",
  mixins: [FormTableMixins],
  components: {
    AddOrUpdate,
  },
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name, year, period, status } = formData;

      return {
        ...pagination,
        competitionId: name,
        annualName: period,
        year,
        status,
      };
    };
    return {
      title: "",
      addOrUpdateId: undefined,
      tableData: [],
      mixinOptions: {
        deleteAjax: deleteContestPeriod,
        getDataListAjax: getContestPeriod,
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
            options: {
              ajax: getContestInfo,
              dictName: "allContestNames",
              labelKey: "competitionName", // 代表取哪一个 key 作为 label
              valueKey: "id", // 代表取哪一个 key 作为 value
            },
          },
          {
            prop: "period",
            value: undefined,
            label: "赛届名称",
            inputType: "input",
          },
          {
            prop: "year",
            value: undefined,
            label: "举办年份",
            inputType: "inputNumber",
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
    };
  },
  computed: {
    ...mapGetters(["dicts"]),
  },
  methods: {
    addNew() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs["addOrUpdateRef"].init();
      });
    },
    eidtContestPeriod(rowInfo) {
      l("rowInfo;", rowInfo);
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs["addOrUpdateRef"].init(rowInfo);
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
