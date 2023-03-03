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

    <el-row style="margin-bottom: 8px">
<!--      新增赛项时间修改申请-->
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addNew()">新增</el-button>
    </el-row>

    <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="今年" name="今年">
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="contestName" label="赛项名称" show-overflow-tooltip min-width="80" fixed="left"> </el-table-column>

          <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="120"> </el-table-column>
          <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" />
          <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />
          <el-table-column prop="groupName" label="组别" show-overflow-tooltip min-width="100" align="center">
            <template slot-scope="{ row }">
              <span>{{ formatGroup(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="formatName" label="赛制" show-overflow-tooltip min-width="100">
            <template slot-scope="{ row }">
              <span>{{ formatRule(row) }}</span>
            </template>
          </el-table-column>

          <!--          <el-table-column prop="registrationTimeStart" label="报名开始时间" show-overflow-tooltip min-width="120"> </el-table-column>-->
          <!--          <el-table-column prop="registrationTimeEnd" label="报名结束时间" show-overflow-tooltip min-width="120"> </el-table-column>-->
          <el-table-column prop="oldCompetitionTimeStart" label="原开赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <el-table-column prop="newCompetitionTimeStart" label="修改后开赛时间" show-overflow-tooltip min-width="130"> </el-table-column>
          <el-table-column prop="oldCompetitionTimeEnd" label="原结赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <el-table-column prop="newCompetitionTimeEnd" label="修改后结赛时间" show-overflow-tooltip min-width="130"> </el-table-column>
          <el-table-column prop="createUserName" label="状态" minwidth="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="dicts.cbContestItemTimeInfoMap[row.status] !== undefined" :type="dicts.cbContestItemTimeInfoMap[row.status].type">
                {{ dicts.cbContestItemTimeInfoMap[row.status].label }}</el-tag
              >
            </template>
          </el-table-column>
          <!--          <el-table-column prop="acount" label="报名人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column prop="humans" label="参赛人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="往年" name="往年">
        <!--        <my-table :loading="loading" :data="tableData" :cols="cols"></my-table>-->
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="contestName" label="赛项名称" show-overflow-tooltip min-width="80" fixed="left"> </el-table-column>
          <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" />
          <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />
          <el-table-column prop="groupName" label="组别" show-overflow-tooltip min-width="100" align="center">
            <template slot-scope="{ row }">
              <span>{{ formatGroup(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="formatName" label="赛制" show-overflow-tooltip min-width="100">
            <template slot-scope="{ row }">
              <span>{{ formatRule(row) }}</span>
            </template>
          </el-table-column>

          <!--          <el-table-column prop="registrationTimeStart" label="报名开始时间" show-overflow-tooltip min-width="120"> </el-table-column>-->
          <!--          <el-table-column prop="registrationTimeEnd" label="报名结束时间" show-overflow-tooltip min-width="120"> </el-table-column>-->
          <el-table-column prop="oldCompetitionTimeStart" label="原开赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <el-table-column prop="newCompetitionTimeStart" label="修改后开赛时间" show-overflow-tooltip min-width="130"> </el-table-column>
          <el-table-column prop="oldCompetitionTimeEnd" label="原结赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <el-table-column prop="newCompetitionTimeEnd" label="修改后结赛时间" show-overflow-tooltip min-width="130"> </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="dicts.cbContestItemTimeInfoMap[row.status] !== undefined" :type="dicts.cbContestItemTimeInfoMap[row.status].type">
                {{ dicts.cbContestItemTimeInfoMap[row.status].label }}</el-tag
              >
            </template>
          </el-table-column>
          <!--          <el-table-column prop="acount" label="报名人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column prop="humans" label="参赛人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column label="操作" width="160px" fixed="right">-->
          <!--            <template slot-scope="{ row }">-->
          <!--              <div class="tbl-col-hover table-col-operations">-->
          <!--                <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">修改</el-button>-->
          <!--                <el-button v-if="row.status === 1" size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(row.id)">删除</el-button>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </el-tab-pane>
    </el-tabs>

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

    <add-or-update ref="addOrUpdateRef" @refreshDataList="query" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
import { deleteContestItem, getCbContestTimeApplys, getContestRules, getGroups } from "@/api/contestManage";
import AddOrUpdate from "./add-or-update.vue";
import FormTableMixins from "@/mixins";
import { mapGetters } from "vuex";
// 这个页面是承办单位的, 可以发起赛项时间修改的申请给 市局,
export default {
  name: "ContestManage-ContestTimeApply",
  components: {
    AddOrUpdate,
  },
  mixins: [FormTableMixins],
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name, contestPeriod, contestItem, status } = formData;

      const yearTypeMap = {
        "今年": 1,
        "往年": 2,
      };

      return {
        yearType: yearTypeMap[this.activeTabName] ?? undefined,
        ...pagination,
        competitionName: name,
        annualName: contestPeriod,
        contestName: contestItem,
        status,
      };
    };
    return {
      updateId: undefined,
      allGroups: [], // 所有的组别
      allRules: [], // 所有的赛制
      mixinOptions: {
        deleteAjax: deleteContestItem,
        getDataListAjax: getCbContestTimeApplys,
        "queryDataFormatter": queryDataFormatter,
      },
      activeTabName: "今年",
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
            inputType: "input",
          },
          {
            prop: "contestPeriod",
            value: undefined,
            label: "赛届",
            inputType: "input",
          },
          {
            prop: "contestItem",
            value: undefined,
            label: "赛项",
            inputType: "input",
          },
          {
            prop: "status",
            value: undefined,
            label: "状态",
            inputType: "select",
            options: "cbContestItemTimeInfoStatus",
          },
        ],
      },
    };
  },
  created() {
    const defaultParams = {
      pageNum: 1,
      pageSize: 1000,
    };

    // 获取赛制
    getContestRules(defaultParams)
      .then((res) => {
        this.allRules = res?.rows ?? [];
      })
      .catch((err) => {
        this.allRules = [];
      });
    //  获取组别
    getGroups(defaultParams)
      .then((res) => {
        this.allGroups = res?.rows ?? [];
      })
      .catch((err) => {
        this.allGroups = [];
      });
  },
  computed: {
    ...mapGetters(["dicts", "roleContains"]),
  },
  methods: {
    addNew(rowInfo) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init();
      });
    },
    formatGroup(info) {
      let value = info?.groupId ?? "";
      value = value.endsWith(",") ? value.slice(0, value.length - 1) : value;
      let ids = value.split(",");
      const idValueMap = this.allGroups.reduce((prev, cur) => {
        return {
          ...prev,
          [cur.id]: cur.groupName,
        };
      }, {});

      return ids.reduce((prev, cur, i) => {
        if (idValueMap[cur]) {
          prev += `${!i ? "" : ","}${idValueMap[cur]}`;
        }
        return prev;
      }, "");
    },
    formatRule(info) {
      let value = info?.formatId ?? "";
      value = value.endsWith(",") ? value.slice(0, value.length - 1) : value;
      let ids = value.split(",");
      const idValueMap = this.allRules.reduce((prev, cur) => {
        return {
          ...prev,
          [cur.id]: cur.formatName,
        };
      }, {});

      return ids.reduce((prev, cur, i) => {
        if (idValueMap[cur]) {
          prev += `${!i ? "" : ","}${idValueMap[cur]}`;
        }
        return prev;
      }, "");
    },
    eidtContestPeriod(info) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(info);
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
    handleTabClick() {
      this.pageSize = 10;
      this.page = 1;

      this.query();
    },
  },
};
</script>

<style lang="scss" scoped></style>
