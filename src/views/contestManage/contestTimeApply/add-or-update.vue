<template>
  <el-dialog title="添加赛项时间修改申请" width="600px" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetData">
    <el-form ref="form" size="small" :model="form" :rules="dataRule" label-width="120px" class="el-form-fixed">
      <el-form-item label="赛事" prop="name">
        <el-select :value="form.name" @input="handleNameChange" placeholder="请选择赛事" filterable clearable style="width: 100%">
          <el-option v-for="item in allContestNames" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="赛届" prop="period">
        <el-select :value="form.period" @input="handlePeriodChange" placeholder="请选择赛届" filterable clearable style="width: 100%">
          <el-option v-for="item in allPeriods" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="赛项" prop="contestItem">
        <el-select :value="form.contestItem" @input="handleItemNameChange" placeholder="请选择赛项" filterable clearable style="width: 100%">
          <el-option v-for="item in allContestItems" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="原开赛时间" prop="oldBeginTime">
        <el-date-picker v-model="form.oldBeginTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择原开赛时间" style="width: 100%" disabled />
      </el-form-item>

      <el-form-item label="修改后开赛时间" prop="newBeginTime">
        <el-date-picker v-model="form.newBeginTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择修改后开赛时间" style="width: 100%" />
      </el-form-item>

      <el-form-item label="原结赛时间" prop="oldEndTime">
        <el-date-picker v-model="form.oldEndTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择原结赛时间" style="width: 100%" disabled />
      </el-form-item>

      <el-form-item label="修改后结赛时间" prop="newEndTime">
        <el-date-picker v-model="form.newEndTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择修改后结赛时间" style="width: 100%" />
      </el-form-item>
    </el-form>

    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetData()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import {
    checkContestItem,
    AddChangeContestTime,
    getCbContestPeriod,
    getCbContestItems,
    getCbContestInfo,
    getCbContestItem
  } from '@/api/contestManage'
import { getGroups, getContestItem, getContestPeriod, saveContestItem } from "@/api/contestManage";
// 大概逻辑, 先选赛事 , 然后选相关的赛届,再选相关的赛项,然后填充 原开赛时间,以及原结赛时间(用选择的那个赛项的时间来填充)

export default {
  created() {
    // 获取选项 只获取赛事的选项
    const defaultParams = {
      pageNum: 1,
      pageSize: 1000,
    };
    this.getAllContestNames(defaultParams);
  },
  computed: {},
  data() {
    return {
      visible: false,
      updateId: undefined,
      timer: null,
      form: {
        name: undefined, // 赛事名称
        period: undefined, // 赛届
        contestItem: undefined, // 赛项名称
        oldBeginTime: undefined,
        newBeginTime: undefined,
        oldEndTime: undefined,
        newEndTime: undefined,
      },
      oldData: {},
      allContestNames: [],
      allPeriods: [],
      allContestItems: [],
      dataRule: {
        name: [{ required: true, message: "请选择赛事名称", trigger: "change" }],
        period: [{ required: true, message: "请选择赛届", trigger: "change" }],
        contestItem: [{ required: true, message: "请选择赛项", trigger: "change" }],
        oldBeginTime: [{ required: true, message: "请选择原开赛时间", trigger: "blur" }],
        newBeginTime: [{ required: true, message: "请选择修改后开赛时间", trigger: "blur" }],
        oldEndTime: [{ required: true, message: "请选择原结赛时间", trigger: "blur" }],
        newEndTime: [{ required: true, message: "请选择修改后结赛时间", trigger: "blur" }],
      },
    };
  },
  methods: {
    init(info) {
      this.visible = true;
      this.updateId = info?.id ?? undefined;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        if (info) {
          const defaultParams = {
            pageNum: 1,
            pageSize: 1000,
            competitionId: info?.competitionId,
            annualId: info?.annualId,
          };

          // 获取赛事名称的选项
          this.getAllContestNames(defaultParams);
          // 获取赛届的选项
          getCbContestPeriod(defaultParams)
            .then((res) => {
              this.allPeriods = (res?.data || []).reduce((prev, cur) => {
                if (cur.competitionId === info?.competitionId)
                  prev.push({
                    label: cur?.["annualName"] || "",
                    value: cur?.["id"],
                  });
                return prev;
              }, []);
            })
            .catch((err) => {});

          const formatData = (str) => {
            if (!str) {
              return [];
            }
            if (str.endsWith(",")) {
              str = str.slice(0, str.length - 1);
            }
            return str.split(",").map((v) => +v);
          };

          this.form = {
            name: info?.competitionId, // 赛事名称
            period: info?.annualId, // 赛届
            code: info?.contestCode, // 编号
            contestItem: info?.contestName, // 赛项名称
            groups: formatData(info?.groupId),
            rules: formatData(info?.formatId),

            enrollBeginTime: info?.registrationTimeStart,
            enrollEndTime: info?.registrationTimeEnd,
            contestBeginTime: info?.competitionTimeStart,
            contestEndTime: info?.competitionTimeEnd,
          };
        }
      });
    },
    handleNameChange(value) {
      l("vvv", value);
      this.form.name = value;
      this.form.period = undefined;
      this.form.contestItem = undefined;
      this.allPeriods = [];
      this.allContestItems = [];

      if (!value) {
        return;
      }
      // 获取赛届的选项
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: value,
      };
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
    },
    handlePeriodChange(value) {
      this.form.period = value;
      this.form.contestItem = undefined;
      this.allContestItems = [];
      if (!value) {
        return;
      }
      // 获取赛项
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: this.form.name,
        annualId: this.form.period,
      };
      getCbContestItem(defaultParams)
        .then((res) => {
          this.allContestItems = (res?.rows ?? []).map((v) => ({
            ...v,
            value: v.id,
            label: v.contestName,
          }));
        })
        .catch((err) => {});
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 新增申请
          const formData = { ...this.form };
          l(4444444444, formData);
          const data = {
            oldBeginTime: undefined,
            newBeginTime: undefined,
            oldEndTime: undefined,
            newEndTime: undefined,

            competitionId: formData.name, // 赛事
            annualId: formData.period, // 赛届
            contestId: formData.contestItem, // 赛项
            "oldCompetitionTimeEnd": formData.oldEndTime, // 旧的结赛时间
            "newCompetitionTimeEnd": formData.newEndTime, // 新结赛时间
            "oldCompetitionTimeStart": formData.oldBeginTime, // 旧的 开赛时间
            "newCompetitionTimeStart": formData.newBeginTime, // 新开赛时间
          };

          AddChangeContestTime(data)
            .then((res) => {
              this.visible = false;
              this.$message.success(`新增成功`);
              this.$emit("refreshDataList");
            })
            .catch((err) => {
              this.visible = false;
              // this.$message.error(`新增失败`);
              this.$emit("refreshDataList");
            });
        }
      });
    },
    handleItemNameChange(v) {
      this.form.contestItem = v;
      // 获取赛项详情
      const itemInfo = this.allContestItems.find((item) => item.value === v) ?? {};
      l(3222, v, itemInfo, this.allContestItems);
      // 初始化表单数据
      this.form.oldBeginTime = itemInfo.competitionTimeStart;
      this.form.oldEndTime = itemInfo.competitionTimeEnd;
    },
    resetData() {
      this.visible = false;
    },
    getAllContestNames(params) {
      getCbContestInfo(params)
        .then((res) => {
          this.allContestNames = (res?.rows || []).reduce((prev, cur) => {
            prev.push({
              label: cur?.["competitionName"] || "",
              value: cur?.["competitionId"],
            });
            return prev;
          }, []);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  font-size: 24px;
  margin-right: 10px;
}
</style>
