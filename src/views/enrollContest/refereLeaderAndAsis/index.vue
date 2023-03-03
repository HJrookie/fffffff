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
      <el-button type="primary" plain icon="el-icon-plus" @click="addNew()" size="mini">发起申请 </el-button>
    </el-row>

    <div class="table-wrapper">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="今年" name="今年">
          <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column prop="userName" label="姓名" show-overflow-tooltip min-width="80" />
            <el-table-column prop="idCard" label="身份证号" show-overflow-tooltip min-width="80" />
            <el-table-column prop="phone" label="手机号" show-overflow-tooltip min-width="80" />
            <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip min-width="80" align="center" />

            <el-table-column prop="status" label="状态" min-width="100" align="center">
              <template slot-scope="{ row }">
                <el-tag v-if="dicts.cbContestItemTimeInfoMap[row.status] !== undefined" :type="dicts.cbContestItemTimeInfoMap[row.status].type">
                  {{ dicts.cbContestItemTimeInfoMap[row.status].label }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column label="申请类型" min-width="100" align="center">
              <template slot-scope="{ row }">
                <div>
                  <el-tag v-if="dicts.identityMap[row.applyIdentity] !== undefined" :type="dicts.identityMap[row.applyIdentity].type">
                    {{ dicts.identityMap[row.applyIdentity].label }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="{ row }">
                <div class="tbl-col-hover table-col-operations">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="getDetail(row)">查看</el-button>
                  <!--                <el-button size="mini" type="text" icon="el-icon-edit" @click="">导出报名表信息</el-button>-->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="往年" name="往年">
          <!--          <my-table :loading="loading" :data="tableData" :cols="cols"></my-table>-->

          <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column prop="userName" label="姓名" show-overflow-tooltip min-width="80" />
            <el-table-column prop="idCard" label="身份证号" show-overflow-tooltip min-width="80" />
            <el-table-column prop="phone" label="手机号" show-overflow-tooltip min-width="80" />
            <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip min-width="80" align="center" />

            <el-table-column prop="status" label="状态" min-width="100" align="center">
              <template slot-scope="{ row }">
                <el-tag v-if="dicts.cbContestItemTimeInfoMap[row.status] !== undefined" :type="dicts.cbContestItemTimeInfoMap[row.status].type">
                  {{ dicts.cbContestItemTimeInfoMap[row.status].label }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column label="申请类型" min-width="100" align="center">
              <template slot-scope="{ row }">
                <div>
                  <el-tag v-if="dicts.identityMap[row.applyIdentity] !== undefined" :type="dicts.identityMap[row.applyIdentity].type">
                    {{ dicts.identityMap[row.applyIdentity].label }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="{ row }">
                <div class="tbl-col-hover table-col-operations">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="getDetail(row)">查看</el-button>
                  <!--                <el-button size="mini" type="text" icon="el-icon-edit" @click="">导出报名表信息</el-button>-->
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
    <!--    <add-or-update @refreshDataList="query" ref="addOrUpdateRef" v-if="addOrUpdateVisible"></add-or-update>-->
    <apply-detail-info @refreshDataList="query" ref="detailRef" v-if="detailVis"></apply-detail-info>
    <new-apply @refreshDataList="query" ref="addOrUpdateRef" v-if="addOrUpdateVisible"></new-apply>
  </div>
</template>

<script>
import { getRefereeLeaderApproveDetail, getRefereeLeaderApproveList } from "@/api/contestManage";
import axios from "axios";
import { mapGetters } from "vuex";
import FormTableMixins from "@/mixins";
import ApplyDetailInfo from "./apply-detail-info.vue";
import NewApply from "./new-apply.vue";

import { getAllCoachApplys, getAllunitAppls, getCbAppls, getUsers } from "@/api/userManage";
export default {
  name: "ChangeRefereeToLeaderOrAsis", // 这个页面是 承办单位单位发起申请, 将裁判变成 裁判长助理或者裁判长
  components: {
    // AddOrUpdate,
    ApplyDetailInfo,
    NewApply,
  },
  mixins: [FormTableMixins],
  data() {
    const queryDataFormatter = (formData, pagination) => {
      const { name: userName, phone, idCard } = formData;

      const yearTypeMap = {
        "今年": 1,
        "往年": 2,
      };

      return {
        yearType: yearTypeMap[this.activeTabName] ?? undefined,
        userName,
        phone,
        idCard,
        // status: map[this.activeTabName],
        type: 2, // 发起申请时 type 也是 1
        ...pagination,
      };
    };
    return {
      detailVis: false,
      activeTabName: "今年",
      tableData: [],
      mixinOptions: {
        getDataListAjax: getCbAppls,
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
            label: "人员姓名",
            inputType: "input",
          },
          {
            prop: "phone",
            value: undefined,
            label: "手机号",
            inputType: "input",
          },
          {
            prop: "idCard",
            value: undefined,
            label: "身份证号",
            inputType: "input",
          },
          // {
          //   prop: "status",
          //   value: undefined,
          //   label: "状态",
          //   inputType: "select",
          //   options: "cbContestItemTimeInfoStatus",
          // },
        ],
        rules: {
          name: [{ required: false, trigger: "blur" }],
          year: [{ required: false, trigger: "blur" }],
          status: [{ required: false, trigger: "blur" }],
        },
      },
      rules: {},
      loading: false,
      addOrUpdateVisible: false,
      page: 1,
      pageSize: 10,
      total: 0,
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
    getDetail(info) {
      if (info) {
        this.detailVis = true;
        this.$nextTick(() => {
          this.$refs.detailRef.init({
            ...info,
            yearType: this.yearTypeMap[this.activeTabName] ?? undefined, // 今年和往年
          });
        });
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
  },
};
</script>

<style lang="scss" scoped></style>
