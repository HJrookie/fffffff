<template>
  <div class="contest-maintain">
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
      <!--      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="">新增 </el-button>-->
      <el-button type="primary" plain icon="el-icon-plus" @click="addNew()" size="mini">报名 </el-button>
    </el-row>

    <div class="table-wrapper">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="今年" name="今年">
          <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
            <!--            <el-table-column prop="orgName" label="参赛编码" show-overflow-tooltip min-width="80" align="center"> </el-table-column>-->
            <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="80" />
            <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" />
            <el-table-column prop="year" label="举办年份" show-overflow-tooltip width="80"> </el-table-column>
            <el-table-column prop="contestName" label="赛项" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="groupName" label="组别" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="formatName" label="赛制" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="applyOrgUserName" label="所属单位" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="idCard" label="身份证号" show-overflow-tooltip min-width="120" align="center"> </el-table-column>
            <el-table-column prop="phone" label="手机号" show-overflow-tooltip min-width="80" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="报名时间" show-overflow-tooltip min-width="80" align="center"> </el-table-column>
            <el-table-column prop="status" label="状态" width="100px" align="center">
              <template slot-scope="{ row }">
                <el-tag v-if="dicts.cbContestItemTimeInfoMap[row.status] !== undefined" :type="dicts.cbContestItemTimeInfoMap[row.status].type">
                  {{ dicts.cbContestItemTimeInfoMap[row.status].label }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column prop="status" label="参赛身份" width="80px" align="center">
              <template slot-scope="{ row }">
                <el-tag>{{ dicts.allRolesMap[row.identity].label }} </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="{ row }">
                <div class="tbl-col-hover table-col-operations">
                  <!--              todo  查看按钮  修改按钮  提交按钮 导出报名表信息按钮 -->
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="getDetail(row)">查看</el-button>
                  <!--                  只有已通过可以下载-->
                  <template v-if="row.status === 1">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="expData(row)">导出报名表信息</el-button>
                  </template>
                  <!--               todo  审批通过可以导出 -->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="往年" name="往年">
          <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
            <!--            <el-table-column prop="orgName" label="参赛编码" show-overflow-tooltip min-width="80" align="center"> </el-table-column>-->
            <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="80" />
            <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" />
            <el-table-column prop="year" label="举办年份" show-overflow-tooltip width="80"> </el-table-column>
            <el-table-column prop="contestName" label="赛项" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="groupName" label="组别" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="formatName" label="赛制" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="applyOrgUserName" label="所属单位" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="idCard" label="身份证号" show-overflow-tooltip min-width="120" align="center"> </el-table-column>
            <el-table-column prop="phone" label="手机号" show-overflow-tooltip min-width="80" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="报名时间" show-overflow-tooltip min-width="80" align="center"> </el-table-column>

            <el-table-column prop="status" label="状态" width="100px" align="center">
              <template slot-scope="{ row }">
                <el-tag v-if="dicts.cbContestItemTimeInfoMap[row.status] !== undefined" :type="dicts.cbContestItemTimeInfoMap[row.status].type">
                  {{ dicts.cbContestItemTimeInfoMap[row.status].label }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="status" label="参赛身份" width="80px" align="center">
              <template slot-scope="{ row }">
                <el-tag>{{ dicts.allRolesMap[row.identity].label }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="{ row }">
                <div class="tbl-col-hover table-col-operations">
                  <!--              todo  查看按钮  修改按钮  提交按钮 导出报名表信息按钮 -->
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="getDetail(row)">查看</el-button>
                  <template v-if="row.status === 1">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="expData(row)">导出报名表信息</el-button>
                  </template>
                </div>
              </template>
            </el-table-column>
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
    </div>

    <apply-detail-info ref="addOrUpdateRef" v-if="addOrUpdateVisible"></apply-detail-info>
  </div>
</template>

<script>
import { getContestPeriod, deleteContestPeriod, getGrApplys, getPersonContestApplyInfoById } from "@/api/contestManage";
import FormTableMixins from "@/mixins";
import { mapGetters } from "vuex";
import ApplyDetailInfo from "./apply-detail-info.vue";
import { downloadFile } from "@/utils/request";
import { getToken } from "@/utils/auth";

export default {
  name: "ContestPeriod",
  mixins: [FormTableMixins],
  computed: {
    ...mapGetters(["dicts"]),
  },
  components: {
    ApplyDetailInfo,
  },
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name: competitionName, period: annualName, itemName: contestName, status } = formData;
      const yearTypeMap = {
        "今年": 1,
        "往年": 2,
      };

      return {
        yearType: yearTypeMap[this.activeTabName] ?? undefined, // 今年和往年
        competitionName,
        annualName,
        contestName,
        status,
        ...pagination,
      };
    };
    return {
      activeTabName: "今年",
      title: "",
      tableData: [],
      mixinOptions: {
        deleteAjax: deleteContestPeriod,
        getDataListAjax: getGrApplys,
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
            inputType: "input",
          },
          {
            prop: "period",
            value: undefined,
            label: "赛届",
            inputType: "input",
          },
          {
            prop: "itemName",
            value: undefined,
            label: "赛项名称",
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
  methods: {
    addNew(rowInfo) {
      if (this.activeTabName === "今年") {
        const count = this.tableData.reduce((prev, cur) => {
          if ([0, 1].includes(cur.status)) {
            // 统计待审批以及已通过的,如果大于等于 1, 则不能再申请赛项了
            prev++;
          }
          return prev;
        }, 0);
        if (count >= 1) {
          this.$message.error(`您已参加过比赛,请勿重复参加`);
          return;
        }
        this.$router.push("/contest/enrollDetail");
      } else {
        return;
      }
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
    getDetail(info) {
      if (info) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdateRef.init({
            ...info,
            yearType: this.yearTypeMap[this.activeTabName] ?? undefined, // 今年和往年
          });
        });
      }
    },
    expData(info) {
      const url = "/exportWord/person";
      const { annualName, applyUserId, approvalOpinion, competitionName, identity, createTime: time, contestName, contestId } = info;
      const data = {
        annualName,
        applyUserId,
        approvalOpinion: approvalOpinion ?? "",
        competitionName,
        time,
        yearType: this.yearTypeMap[this.activeTabName] ?? undefined, // 今年和往年
        contestName,
        contestId,
      };
      downloadFile({ url, method: "post", data, responseType: "blob", headers: { Authorization: "Bearer " + getToken() } }, `报名信息.doc`).catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
