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
      <el-button type="primary" plain icon="el-icon-plus" @click="applyForContest()" size="mini">申请参赛 </el-button>
    </el-row>

    <div class="table-wrapper">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="今年" name="今年">
          <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="120"> </el-table-column>
            <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="contestName" label="赛项" show-overflow-tooltip min-width="120" />
            <el-table-column prop="groupName" label="组别" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <el-table-column prop="formatName" label="赛制" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />

            <el-table-column prop="createUserName" label="状态" width="140px" align="center">
              <template slot-scope="{ row }">
                <div>
                  <el-tag v-if="dicts.csContestItemStatusMap[row.status]" :type="dicts.csContestItemStatusMap[row.status].type">
                    {{ dicts.csContestItemStatusMap[row.status].label }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="applyQuota" label="申请名额" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <el-table-column prop="allotQuota" label="最终名额" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <!--            <el-table-column prop="number" label="总报名人数" show-overflow-tooltip min-width="120" align="center" />-->
            <!--            <el-table-column prop="numberPass" label="报名通过人数" show-overflow-tooltip min-width="120" align="center" />-->
            <el-table-column label="操作" width="240px" fixed="right" align="center">
              <template slot-scope="{ row }">
                <div class="tbl-col-hover table-col-operations">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="manageContestPersons(row)">赛项人员管理</el-button>
                  <!--                  todo 暂时隐藏-->
                  <!--                  <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">提交</el-button>-->
                  <!--               预报名状态下 可以撤销申请    -->
                  <el-button v-if="row.status === 1" size="mini" type="text" icon="el-icon-delete" @click="deleteInfo(row.id)">撤销</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="往年" name="往年">
          <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="120"> </el-table-column>
            <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80"> </el-table-column>
            <el-table-column prop="contestName" label="赛项" show-overflow-tooltip min-width="120" />
            <el-table-column prop="groupName" label="组别" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <el-table-column prop="formatName" label="赛制" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />
            <el-table-column prop="createUserName" label="状态" width="140px" align="center">
              <template slot-scope="{ row }">
                <div>
                  <el-tag v-if="dicts.csContestItemStatusMap[row.status]" :type="dicts.csContestItemStatusMap[row.status].type">
                    {{ dicts.csContestItemStatusMap[row.status].label }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="applyQuota" label="申请名额" show-overflow-tooltip min-width="100" align="center"> </el-table-column>
            <el-table-column prop="allotQuota" label="最终名额" show-overflow-tooltip min-width="100" align="center"> </el-table-column>

            <el-table-column label="操作" width="240px" fixed="right" align="center">
              <template slot-scope="{ row }">
                <div class="tbl-col-hover table-col-operations">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="manageContestPersons(row)">赛项人员管理</el-button>
                  <!--                  todo 暂时隐藏-->
                  <!--                  <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">提交</el-button>-->
                  <!--               预报名状态下 可以撤销申请    -->
                  <!--                  <el-button v-if="row.status === 1" size="mini" type="text" icon="el-icon-delete" @click="deleteInfo(row.id)">撤销</el-button>-->
                </div>
              </template>
            </el-table-column>

            <!--            <el-table-column prop="number" label="总报名人数" show-overflow-tooltip min-width="120" align="center" />-->
            <!--            <el-table-column prop="numberPass" label="报名通过人数" show-overflow-tooltip min-width="120" align="center" />-->
            <!--            <el-table-column label="操作" width="240px" fixed="right" align="center">-->
            <!--              <template slot-scope="{ row }">-->
            <!--                <div class="tbl-col-hover table-col-operations">-->
            <!--                  <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">赛项人员管理</el-button>-->
            <!--                  &lt;!&ndash;                  <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">提交</el-button>&ndash;&gt;-->
            <!--                  &lt;!&ndash;               预报名状态下 可以撤销申请    &ndash;&gt;-->
            <!--                  <el-button v-if="row.status === 1" size="mini" type="text" icon="el-icon-delete" @click="deleteInfo(row.id)">撤销</el-button>-->
            <!--                </div>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
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
    <item-humans-info v-if="infoVis" ref="infoRef"></item-humans-info>
  </div>
</template>

<script>
import { deleteCsOneApply, getCsAllApplys } from "@/api/contestManage";
import FormTableMixins from "@/mixins";
import { mapGetters } from "vuex";
import ItemHumansInfo from "./itemHumansInfo.vue";

export default {
  mixins: [FormTableMixins],
  name: "ContestManage-itemApply",
  components: { ItemHumansInfo },
  computed: {
    ...mapGetters(["dicts"]),
  },
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name, period, itemName, status } = formData;

      const yearTypeMap = {
        "今年": 1,
        "往年": 2,
      };

      return {
        yearType: yearTypeMap[this.activeTabName] ?? undefined,
        competitionName: name, // 赛事名称
        annualName: period, // 赛届名称
        contestName: itemName, // 赛项名称
        status, // 状态
        ...pagination,
      };
    };
    return {
      title: "",
      infoVis: false,
      activeTabName: "今年",
      tableData: [],
      mixinOptions: {
        deleteAjax: deleteCsOneApply,
        getDataListAjax: getCsAllApplys,
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
            options: "csContestItemStatus",
          },
        ],
      },
    };
  },
  methods: {
    applyForContest() {
      this.$router.push("/contestManage/applyInfo");
    },
    eidtContestPeriod(rowInfo) {
      this.title = "修改赛届信息";
      l("rowInfo;", rowInfo);
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
    deleteInfo(id) {
      let type = Object.prototype.toString.call(id).match(/\[object (\w+)\]/)[1];
      let isOnly = ["String", "Number"].includes(type);

      this.$confirm(`是否确认撤销该赛项申请`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.mixinOptions.deleteAjax) {
            let ids = isOnly ? [id] : this.dataListSelections.map((item) => item[this.mixinOptions.deleteKey]);
            return this.mixinOptions.deleteAjax(ids);
          }
        })
        .then(() => {
          this.page = 1;
          this.pageSize = 10;
          this.total = 0;
          this.query();
          this.$message({ message: "撤销成功", type: "success" });
        })
        .catch(() => {});
    },
    manageContestPersons(info) {
      this.infoVis = true;
      this.$nextTick(() => {
        this.$refs.infoRef.init(info, this.activeTabName === "今年" ? 1 : 2);
      });
      // infoVis
    },
  },
};
</script>

<style lang="scss" scoped></style>
