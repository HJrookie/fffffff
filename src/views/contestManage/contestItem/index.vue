<template>
  <div class="app-container">
    <div class="query-form">
      <el-form ref="form" size="small" :model="form" label-width="75px" class="el-form-fixed" inline>
        <el-form-item label="赛事名称" prop="name">
          <el-select :value="form.name" @input="handleNameChange" placeholder="请选择赛事名称" filterable clearable style="width: 100%">
            <el-option v-for="item in allContestNames" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="赛届" prop="period">
          <el-select :value="form.period" @input="handlePeriodChange" placeholder="请选择赛届" filterable clearable style="width: 100%">
            <el-option v-for="item in allPeriods" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="赛项名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入赛项名称" clearable />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" filterable clearable style="width: 100%">
            <el-option v-for="item in dicts.contestStatus" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left: 0px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="query()">查 询 </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetHandle()">重 置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row style="margin-bottom: 8px" v-if="roleContains('sj', 'admin')">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addNew()">新增</el-button>
<!--      <el-button type="info" plain icon="el-icon-upload" size="mini" @click="importFile()">批量导入</el-button>-->
    </el-row>

    <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="今年" name="今年">
        <!--        <my-table :loading="loading" :data="tableData" :cols="cols"></my-table>-->
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="contestName" label="赛项名称" show-overflow-tooltip min-width="120" fixed="left"> </el-table-column>

          <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="120"> </el-table-column>
          <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" />
          <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />
          <el-table-column prop="contestCode" label="赛项编码" show-overflow-tooltip min-width="80"> </el-table-column>
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
          <el-table-column prop="undertakerName" label="承办单位" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column prop="createUserName" label="状态" width="0px" align="center">
            <template slot-scope="{ row }">
              <div>
                <!--                <el-tag> {{ dicts.contestStatusMap[row.status] }}</el-tag>-->
                <el-tag v-if="dicts.contestStatusMap[row.status]" :type="dicts.contestStatusColorMap[row.status]">
                  {{ dicts.contestStatusMap[row.status] }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="registrationTimeStart" label="报名开始时间" show-overflow-tooltip min-width="120"> </el-table-column>
          <el-table-column prop="registrationTimeEnd" label="报名结束时间" show-overflow-tooltip min-width="120"> </el-table-column>
          <el-table-column prop="competitionTimeStart" label="开赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <el-table-column prop="competitionTimeEnd" label="结赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <!--          <el-table-column prop="acount" label="报名人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column prop="humans" label="参赛人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="120"> </el-table-column>-->
          <!--          <el-table-column prop="advisorsdfsdfName" label="备注" show-overflow-tooltip min-width="80"> </el-table-column>-->

          <el-table-column label="操作" width="160px" fixed="right" v-if="roleContains('sj', 'admin')">
            <template slot-scope="{ row }">
              <div class="tbl-col-hover table-col-operations">
                <!--                只有未开始的赛项可以删除  -->
                <template v-if="row.status === 1">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">修改</el-button>
                  <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(row.id)">删除</el-button>
                </template>

                <template v-else>
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">修改</el-button>
                  <el-tooltip content="只有未开始状态的赛项可以删除" placement="top">
                    <span>
                      <el-button size="mini" disabled type="text" icon="el-icon-delete" @click="deleteHandle(row.id)">删除</el-button>
                    </span>
                  </el-tooltip>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="往年" name="往年">
        <!--        <my-table :loading="loading" :data="tableData" :cols="cols"></my-table>-->
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="contestName" label="赛项名称" show-overflow-tooltip min-width="80" fixed="left"> </el-table-column>
          <el-table-column prop="contestCode" label="赛项编码" show-overflow-tooltip min-width="80"> </el-table-column>

          <el-table-column prop="competitionName" label="赛事名称" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column prop="annualName" label="赛届" show-overflow-tooltip min-width="80" />
          <el-table-column prop="year" label="举办年份" show-overflow-tooltip min-width="80" />
          <!--          <el-table-column prop="contestCode" label="赛项编号" show-overflow-tooltip min-width="80"> </el-table-column>-->
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
          <el-table-column prop="advisorName" label="承办单位" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column prop="status" label="状态" width="80px" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="dicts.contestStatusMap[row.status]" :type="dicts.contestStatusColorMap[row.status]">
                {{ dicts.contestStatusMap[row.status] }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="registrationTimeStart" label="报名开始时间" show-overflow-tooltip min-width="120"> </el-table-column>
          <el-table-column prop="registrationTimeEnd" label="报名结束时间" show-overflow-tooltip min-width="120"> </el-table-column>
          <el-table-column prop="competitionTimeStart" label="开赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <el-table-column prop="competitionTimeEnd" label="结赛时间" show-overflow-tooltip min-width="100"> </el-table-column>
          <!--          <el-table-column prop="acount" label="报名人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column prop="humans" label="参赛人数" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="120"> </el-table-column>-->
          <!--          <el-table-column prop="advisorsdfsdfName" label="备注" show-overflow-tooltip min-width="80"> </el-table-column>-->
          <!--          <el-table-column label="操作" width="160px" fixed="right" v-if="roleContains('sj', 'admin')">-->
          <!--            <template slot-scope="{ row }">-->
          <!--              <div class="tbl-col-hover table-col-operations">-->
          <!--&lt;!&ndash;                <el-button size="mini" type="text" icon="el-icon-edit" @click="eidtContestPeriod(row)">修改</el-button>&ndash;&gt;-->
          <!--                &lt;!&ndash;                <el-button v-if="row.status === 1" size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(row.id)">删除</el-button>&ndash;&gt;-->
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
    <import-file ref="importFileRef" v-if="importFileVis"></import-file>
  </div>
</template>

<script>
import {
  deleteContestItem,
  editContestItem,
  getCbContestInfo,
  getCbContestItem,
  getCbContestPeriod,
  getContestInfo,
  getContestItem,
  getContestPeriod,
  getContestRules,
  getGroups,
  saveContestItem,
} from "@/api/contestManage";
import AddOrUpdate from "./add-or-update.vue";
import ImportFile from "./import-file.vue";
import FormTableMixins from "@/mixins";
import { getCurYear, getFormItemDefaultValue } from "@/utils";
import { mapGetters } from "vuex";

export default {
  name: "ContestManage-ContestItem",
  components: {
    AddOrUpdate,
    ImportFile,
  },
  mixins: [FormTableMixins],
  dicts: ["sys_contest_status"],
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name, period, itemName, status } = formData;

      const yearTypeMap = {
        "今年": 1,
        "往年": 2,
      };

      return {
        yearType: yearTypeMap[this.activeTabName] ?? undefined,
        ...pagination,
        competitionId: name,
        annualId: period,
        contestName: itemName,
        status,
      };
    };
    // getCbContestItem

    // l(this.$store.getters.roles);
    let ajax = getContestItem;
    const roles = this.$store.getters.roles;
    // 这两个角色权限都比承办单位要高  可以看到所有赛项数据
    if (roles.includes("admin") || roles.includes("sj")) {
      ajax = getContestItem;
    } else {
      // 如果是 cb  会走这个逻辑,只能看到和他相关的
      ajax = getCbContestItem;
    }

    return {
      importFileVis: false,
      updateId: undefined,
      allGroups: [], // 所有的组别
      allRules: [], // 所有的赛制
      allContestNames: [], //
      allPeriods: [], //
      mixinOptions: {
        deleteAjax: deleteContestItem,
        getDataListAjax: ajax,
        "queryDataFormatter": queryDataFormatter,
      },
      activeTabName: "今年",
      form: {
        name: undefined, // 赛事名称
        period: undefined, // 赛届
        itemName: undefined, // 赛项名称
        status: undefined, // 状态
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

    // 获取赛事选项
    const data = { pageNum: 1, pageSize: 1000 };
    const roles = this.$store.getters.roles;
    // 这两个角色权限都比承办单位要高  可以看到所有赛事
    if (roles.includes("admin") || roles.includes("sj")) {
      getContestInfo(data)
        .then((res) => {
          this.allContestNames = (res?.rows || []).reduce((prev, cur) => {
            prev.push({
              label: cur?.["competitionName"] || "",
              value: cur?.["id"],
            });
            return prev;
          }, []);
        })
        .catch((err) => {});
    } else if (roles.includes("cb")) {
      // 如果是 cb  会走这个逻辑,只能看到和他相关的
      getCbContestInfo(data)
        .then((res) => {
          this.allContestNames = (res?.rows || []).reduce((prev, cur) => {
            prev.push({
              label: cur?.["competitionName"] || "",
              value: cur?.["competitionId"],
            });
            return prev;
          }, []);
        })
        .catch((err) => {});
    }
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
    importFile() {
      this.importFileVis = true;
      this.$nextTick(() => {
        this.$refs.importFileRef.init();
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
    handlePeriodChange(value) {
      this.form.period = value;
    },
    handleNameChange(value) {
      this.form.name = value;
      this.form.period = undefined;
      this.allPeriods = [];
      if (!value) {
        return;
      }
      // 获取赛届的选项
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: value,
      };

      const roles = this.$store.getters.roles;
      // 这两个角色权限都比承办单位要高  可以看到所有赛事
      if (roles.includes("admin") || roles.includes("sj")) {
        getContestPeriod(defaultParams)
          .then((res) => {
            this.allPeriods = (res?.rows || []).reduce((prev, cur) => {
              prev.push({
                label: cur?.["annualName"] || "",
                value: cur?.["id"],
              });
              return prev;
            }, []);
          })
          .catch((err) => {});
      } else if (roles.includes("cb")) {
        getCbContestPeriod(defaultParams)
          .then((res) => {
            this.allPeriods = (res?.data || []).reduce((prev, cur) => {
              prev.push({
                label: cur?.["annualName"] || "",
                value: cur?.["annualId"],
              });
              return prev;
            }, []);
          })
          .catch((err) => {});
      }
    },
    query() {
      if (this.mixinOptions.hasLoading) {
        this.loading = true;
      }
      // 初始化查询接口所需数据
      const formData = { ...this.form };
      const pagination = {
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      const data = this.mixinOptions.queryDataFormatter(formData, pagination);
      this.mixinOptions
        .getDataListAjax(data)
        .then((res) => {
          this.loading = false;
          this.tableData = res?.rows || [];
          this.total = res?.total ?? 0;
          resolve(res);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetHandle() {
      this.$refs.form.resetFields();
      this.query();
    },
  },
};
</script>

<style lang="scss" scoped></style>
