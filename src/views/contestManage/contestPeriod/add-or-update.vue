<template>
  <el-dialog :title="updateId ? '修改赛届' : '添加赛届'" width="600px" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetData">
    <el-form ref="form" size="small" :model="form" :rules="dataRule" label-width="120px" class="el-form-fixed">
      <el-form-item label="赛事名称" prop="name">
        <el-select v-model="form.name" placeholder="请选择赛事名称" filterable clearable style="width: 100%">
          <el-option v-for="item in allContestNames" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="赛届" prop="period">
        <el-input :value="form.period" @input="handlePeriodChange" placeholder="请输入赛届名称" maxlength="90" clearable style="width: 100%" />
      </el-form-item>

      <el-form-item label="举办年份" prop="year">
        <el-input-number v-model="form.year" placeholder="请输入举办年份" style="width: 100%" :min="curYear" :max="9999"></el-input-number>
      </el-form-item>

      <el-form-item label="举办地点" prop="location">
        <el-input v-model="form.location" placeholder="请输入举办地点" clearable maxlength="90" style="width: 100%" />
      </el-form-item>

      <el-form-item label="可选组别" prop="groups">
        <el-select v-model="form.groups" placeholder="请选择可选组别" filterable multiple clearable style="width: 100%">
          <el-option v-for="item in allGroups" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="可选赛制" prop="rules">
        <el-select v-model="form.rules" placeholder="请选择可选赛制" filterable multiple clearable style="width: 100%">
          <el-option v-for="item in allRules" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="报名开始时间" prop="enrollBeginTime">
        <el-date-picker v-model="form.enrollBeginTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择报名开始时间" style="width: 100%" />
      </el-form-item>

      <el-form-item label="报名结束时间" prop="enrollEndTime">
        <el-date-picker v-model="form.enrollEndTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择报名结束时间" style="width: 100%" />
      </el-form-item>

      <el-form-item label="开赛时间" prop="contestBeginTime">
        <el-date-picker v-model="form.contestBeginTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择开赛时间" style="width: 100%" />
      </el-form-item>

      <el-form-item label="结赛时间" prop="contestEndTime">
        <el-date-picker v-model="form.contestEndTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择结赛时间" style="width: 100%" />
      </el-form-item>
    </el-form>

    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetData()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addContestPeriod, editContestPeriod, checkContestPeriod, checkContestInfo } from "@/api/contestManage";
import { getContestInfo, getContestPeriod, saveContestItem } from "@/api/contestManage";
import { getCurYear } from "@/utils";
import { getRuoDictData } from "@/api/dict";
import moment from "moment";

export default {
  created() {
    // 获取选项 只获取赛事的选项
    const defaultParams = {
      pageNum: 1,
      pageSize: 1000,
    };
    this.getAllContestNames(defaultParams);
  },
  data() {
    const checkIsSameOrBefore = (time1, time2) => {
      return moment(time1).isSameOrBefore(time2);
    };
    // 四个时间判断的逻辑是          报名开始时间 <= 报名结束时间 < 开赛时间 <= 结赛时间
    const validEnrollBeginTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择报名开始时间"));
      }
      // 如果 此时没有报名结束时间,
      if (!this.form.enrollEndTime) {
        callback();
      } else {
        if (checkIsSameOrBefore(value, this.form.enrollEndTime)) {
          callback();
        } else {
          callback(new Error("报名开始时间不能晚于报名结束时间"));
        }
      }
    };

    const validEnrollEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择报名结束时间"));
      }
      // 如果 此时有报名开始时间,
      if (this.form.enrollBeginTime && moment(value).isBefore(this.form.enrollBeginTime)) {
        callback(new Error("报名结束时间必须等于或晚于报名开始时间"));
        // 如果有开赛时间
      } else if (this.form.contestBeginTime && !moment(value).isBefore(this.form.contestBeginTime)) {
        callback(new Error("报名结束时间必须早于开赛时间"));
      } else {
        callback();
      }
    };

    const validBeginTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择开赛时间"));
      }
      // 如果有报名结束时间
      if (this.form.enrollEndTime && !moment(this.form.enrollEndTime).isBefore(value)) {
        callback(new Error("开赛时间必须晚于报名结束时间"));
        // 如果有 结赛时间
      } else if (this.form.contestEndTime && moment(this.form.contestEndTime).isBefore(value)) {
        callback(new Error("开赛时间不能晚于结赛时间"));
      } else {
        callback();
      }
    };

    const validEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择结赛时间"));
      }
      // 如果 此时有开赛时间
      if (this.form.contestBeginTime && moment(this.form.contestBeginTime).isAfter(value)) {
        callback(new Error("结赛时间必须等于或晚于开赛时间"));
      } else {
        callback();
      }
    };

    const validName = (rule, value, callback) => {
      if (!value || !value.trim().length) {
        callback(new Error("请输入赛届"));
      } else {
        this.$refs.form.validateField("name", (errorMessage) => {
          return "请选择赛事名称";
        });

        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () => {
          if (this.form.name) {
            const data = {
              competitionId: this.form.name,
              annualName: this.form.period,
              id: this.updateId,
            };
            const result = await checkContestPeriod(data);
            if (result === true) {
              callback();
            } else {
              callback(new Error(`赛届 ${value} 已存在 `));
            }
          }
        }, 500);
      }
    };

    return {
      visible: false,
      updateId: undefined,
      timer: null,
      info: undefined,
      curYear: getCurYear(),
      form: {
        name: undefined, // 赛事名称
        period: undefined, // 赛届
        year: getCurYear(), // 年份
        location: undefined, // 地点

        groups: [],
        rules: [],

        enrollBeginTime: undefined,
        enrollEndTime: undefined,
        contestBeginTime: undefined,
        contestEndTime: undefined,
      },
      allContestNames: [],
      allPeriods: [],
      allGroups: [],
      allGroupMap: {},
      allRuleMap: {},
      allRules: [],
      dataRule: {
        name: [{ required: true, message: "请选择赛事名称", trigger: "blur" }],
        period: [{ required: true, trigger: "change", validator: validName }],
        year: [{ required: true, message: "请输入举办年份", trigger: "blur" }],
        location: [{ required: true, message: "请输入举办地点", trigger: "blur" }],
        groups: [{ required: true, message: "请选择可选组别", trigger: "blur" }],
        rules: [{ required: true, message: "请选择可选赛制", trigger: "blur" }],
        enrollBeginTime: [{ required: true, trigger: "change", validator: validEnrollBeginTime }],
        enrollEndTime: [{ required: true, trigger: "change", validator: validEnrollEndTime }],
        contestBeginTime: [{ required: true, trigger: "change", validator: validBeginTime }],
        contestEndTime: [{ required: true, trigger: "change", validator: validEndTime }],
      },
    };
  },
  methods: {
    init(info) {
      this.visible = true;
      this.updateId = info?.id ?? undefined;
      this.info = info;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        const defaultParams = {
          pageNum: 1,
          pageSize: 1000,
        };
        // 获取赛事名称的选项
        this.getAllContestNames(defaultParams);
        // 获取组别
        this.getAllGroups();

        // 获取赛制
        this.getAllRules();

        if (info) {
          //todo 初始化表单数据
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
            period: info?.annualName, // 赛届
            year: info?.year,
            location: info?.venue,

            groups: (info?.groupNameList ?? []).map((item) => item.groupCode),
            rules: (info?.formatNameList ?? []).map((item) => item.formatCode),
            //   {
            //   value: item.groupName,
            //   id: item.id,
            //   annualId: item.annualId,
            //   competitionId: item.competitionId,
            // })),

            enrollBeginTime: info?.registrationTimeStart,
            enrollEndTime: info?.registrationTimeEnd,
            contestBeginTime: info?.competitionTimeStart,
            contestEndTime: info?.competitionTimeEnd,
          };
        }
      });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const result = await checkContestPeriod({
            id: this.updateId,
            competitionId: this.form.name,
            annualName: this.form.period,
          });
          if (!result) {
            this.$message.error(`赛届名称已存在`);
            return;
          }

          const formData = { ...this.form };

          // 赛制
          const ruleValueIdMap = (this.info?.formatNameList ?? []).reduce((prev, cur) => {
            return {
              ...prev,
              [cur.formatName]: cur,
            };
          }, {});

          // 组别
          const groupValueIdMap = (this.info?.groupNameList ?? []).reduce((prev, cur) => {
            return {
              ...prev,
              [cur.groupName]: cur,
            };
          }, {});

         //   l("ffffffff", formData, groupValueIdMap, this.info?.groupNameList);

          const data = {
            id: this.updateId,
            competitionId: formData.name, // 赛事名称
            annualName: formData.period, // 赛届
            year: formData.year, //  举办年份
            venue: formData.location, //  举办地点

            // 组别参数
            groupNameList: formData.groups.map((v) => ({
              groupName: this.allGroupMap[v].dictLabel ?? undefined,
              id: this.info ? groupValueIdMap[v]?.id : undefined,
              annualId: this.info ? groupValueIdMap[v]?.annualId : undefined,
              competitionId: this.info ? groupValueIdMap[v]?.competitionId : undefined,
              groupCode: this.allGroupMap[v].dictValue ?? undefined,
            })),
            // 赛制
            formatNameList: [...formData.rules].map((v) => ({
              formatName: this.allRuleMap[v].dictLabel ?? undefined,
              id: this.info ? ruleValueIdMap[v]?.id : undefined,
              annualId: this.info ? ruleValueIdMap[v]?.annualId : undefined,
              competitionId: this.info ? ruleValueIdMap[v]?.competitionId : undefined,
              formatCode: this.allRuleMap[v].dictValue ?? undefined,
            })),
            registrationTimeStart: formData.enrollBeginTime, // 报名开始时间
            registrationTimeEnd: formData.enrollEndTime, // 报名结束时间
            competitionTimeStart: formData.contestBeginTime, // 开赛时间
            competitionTimeEnd: formData.contestEndTime, // 结赛时间
          };
          const ajaxFunc = this.info ? editContestPeriod : addContestPeriod;
          l("data", data);
          //
          ajaxFunc(data)
            .then((res) => {
              this.visible = false;
              this.$message.success(`${this.updateId ? "修改" : "新增"}成功`);
              this.$emit("refreshDataList");
            })
            .catch((err) => {
              this.visible = false;
              // this.$message.error(`${this.updateId ? "修改" : "新增"}失败`);
              this.$emit("refreshDataList");
            });
          this.resetData();
        }
      });
    },
    resetData() {
      this.visible = false;

      // this.updateId = info?.id ?? undefined;
      // this.info = info;
    },
    handlePeriodChange(v) {
      this.form.period = v;
    },
    getAllContestNames(params) {
      getContestInfo(params)
        .then((res) => {
          this.allContestNames = (res?.rows || []).reduce((prev, cur) => {
            prev.push({
              label: cur?.["competitionName"] || "",
              value: cur?.["id"],
            });
            return prev;
          }, []);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    getAllGroups() {
      // 获取字典中的数据
      getRuoDictData("sys_contest_groups")
        .then((res) => {
          l("11", res);
          this.allGroups = (res?.data ?? []).map((v) => ({ label: v.dictLabel, value: v.dictValue }));
          this.allGroupMap = (res?.data ?? []).reduce((prev, cur) => {
            return { ...prev, [cur.dictLabel]: cur, [cur.dictValue]: cur };
          }, {});
          l("22", this.allGroups, this.allGroupMap);
        })
        .catch((err) => {
          this.allGroups = [];
        });
    },
    getAllRules() {
      // 获取字典中的数据
      getRuoDictData("sys_contest_rule")
        .then((res) => {
          l("33", res);
          this.allRules = (res?.data ?? []).map((v) => ({ label: v.dictLabel, value: v.dictValue }));
          this.allRuleMap = (res?.data ?? []).reduce((prev, cur) => {
            return { ...prev, [cur.dictLabel]: cur, [cur.dictValue]: cur };
          }, {});
        })
        .catch((err) => {
          this.allRules = [];
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
