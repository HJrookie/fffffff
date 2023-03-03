<template>
  <el-dialog title="查看赛项人员信息" width="800px" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetData">
    <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="参赛人员表" name="参赛人员表">
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column align="center" prop="applyUserName" label="姓名" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column align="center" prop="idCard" label="身份证号" show-overflow-tooltip min-width="80" />
          <el-table-column align="center" prop="phone" label="手机号" show-overflow-tooltip min-width="80" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="教练" name="教练">
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column align="center" prop="applyUserName" label="姓名" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column align="center" prop="idCard" label="身份证号" show-overflow-tooltip min-width="80" />
          <el-table-column align="center" prop="phone" label="手机号" show-overflow-tooltip min-width="80" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="裁判" name="裁判">
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column align="center" prop="applyUserName" label="姓名" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column align="center" prop="idCard" label="身份证号" show-overflow-tooltip min-width="80" />
          <el-table-column align="center" prop="phone" label="手机号" show-overflow-tooltip min-width="80" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="其他人员" name="其他人员">
        <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column align="center" prop="applyUserName" label="姓名" show-overflow-tooltip min-width="80"> </el-table-column>
          <el-table-column align="center" prop="idCard" label="身份证号" show-overflow-tooltip min-width="80" />
          <el-table-column align="center" prop="phone" label="手机号" show-overflow-tooltip min-width="80" />
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

    <template slot="footer">
      <el-button @click="resetData">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { rejectOrganizerApprove } from "@/api/contestManage";
import { download } from "@/utils/request";
import { getToken } from "@/utils/auth";
import { getUsersForCs } from "@/api/userManage";

export default {
  data() {
    return {
      visible: false,
      activeTabName: "参赛人员表",
      tableData: [],
      loading: false,
      info: {},
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    init(info, yearType) {
      this.info = info
        ? { ...info, yearType }
        : {
            yearType,
          };
      this.visible = true;
      this.$nextTick(() => {
        this.query();
      });
    },
    handleTabClick() {
      this.pageSize = 10;
      this.page = 1;
      this.query();
    },
    query() {
      switch (this.activeTabName) {
        case "参赛人员表": {
          this.getCsyr();
          break;
        }
        case "教练": {
          this.getJls();
          break;
        }
        case "裁判": {
          this.getCps();
          break;
        }
        case "其他人员": {
          this.getOthers();
          break;
        }
      }
    },
    // 获取参赛人员数据
    getCsyr() {
      this.loading = true;
      const data = {
        pageNum: this.page,
        pageSize: this.pageSize,
        yearType: this.info.yearType, // 今年和往年
        contestId: this.info.contestId,
        groupId: this.info.groupId,
        formatId: this.info.formatId,
        status: 1, // 代表审批通过的

        identity: 1, // 参赛人员,  详见  src/api/userManage.js 中 getUsers 请求
        userType: 3, // 个人用户
      };

      getUsersForCs(data)
        .then((res) => {
          this.tableData = res?.rows || [];
          this.total = res?.total ?? 0;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取教练
    getJls() {
      this.loading = true;
      const data = {
        pageNum: this.page,
        pageSize: this.pageSize,
        contestId: this.info.contestId,
        groupId: this.info.groupId,
        formatId: this.info.formatId,
        yearType: this.info.yearType, // 今年和往年
        identity: 6, // 教练
        userType: 3, // 其他人员
      };

      getUsersForCs(data)
        .then((res) => {
          this.tableData = res?.rows || [];
          this.total = res?.total ?? 0;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取裁判
    getCps() {
      this.loading = true;
      const data = {
        pageNum: this.page,
        pageSize: this.pageSize,
        contestId: this.info.contestId,
        groupId: this.info.groupId,
        formatId: this.info.formatId,
        yearType: this.info.yearType, // 今年和往年
        identity: 3, // 裁判,  详见  src/api/userManage.js 中 getUsers 请求
        userType: 3, // 个人用户
      };
      getUsersForCs(data)
        .then((res) => {
          this.tableData = res?.rows || [];
          this.total = res?.total ?? 0;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 获取其他人
    getOthers() {
      this.loading = true;
      const data = {
        pageNum: this.page,
        pageSize: this.pageSize,
        contestId: this.info.contestId,
        groupId: this.info.groupId,
        formatId: this.info.formatId,
        yearType: this.info.yearType, // 今年和往年
        userType: 4, // 其他人员
      };
      getUsersForCs(data)
        .then((res) => {
          this.tableData = res?.rows || [];
          this.total = res?.total ?? 0;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
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
    resetData() {
      this.page = 1;
      this.pageSize = 10;
      this.total = 0;
      this.activeTabName = "参赛人员表";
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
