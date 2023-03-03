<template>
  <el-dialog :title="updateId ? '修改赛项' : '添加赛项'" width="600px" :close-on-click-modal="false" :visible.sync="visible" :before-close="resetData">
    <el-form ref="form" size="small" :model="form" :rules="dataRule" label-width="120px" class="el-form-fixed">
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

      <el-form-item label="赛项编号" prop="code">
        <el-input v-model="form.code" placeholder="请输入赛项编号" maxlength="20" clearable />
      </el-form-item>

      <el-form-item label="赛项名称" prop="itemName">
        <el-input :value="form.itemName" @input="handleItemNameChange" maxlength="90" placeholder="请输入赛项名称" clearable />
      </el-form-item>

      <el-form-item label="组别" prop="groups">
        <el-select v-model="form.groups" placeholder="请选择组别" filterable multiple clearable style="width: 100%">
          <el-option v-for="item in allGroups" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
        </el-select>
      </el-form-item>

      <el-form-item label="赛制" prop="rules">
        <el-select v-model="form.rules" placeholder="请选择赛制" filterable multiple clearable style="width: 100%">
          <el-option v-for="item in allRules" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
        </el-select>
      </el-form-item>

      <!--只有新增的时候有, 修改的时候没有-->
      <template v-if="!updateId">
        <el-form-item label="区局名额" prop="count">
          <span slot="label">
            <el-tooltip content="可设置分配给区局的赛项名额" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            区局名额
          </span>
          <el-input-number v-model="form.count" :min="0" :max="1000" controls-position="right" label="请输入赛区局名额" style="width: 100%"></el-input-number>
        </el-form-item>
      </template>

      <!--      代表参赛人员最大年龄-->
      <template>
        <el-form-item label="人员最小年龄" prop="age">
          <span slot="label">
            <el-tooltip content="可设置报名该赛项的人员的最小年龄(包含该年龄)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            人员最小年龄
          </span>
          <el-input-number v-model="form.age" :min="0" :max="100" controls-position="right" label="请输入人员最小年龄" style="width: 100%"></el-input-number>
        </el-form-item>
      </template>

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

      <el-form-item label="备注信息" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注信息" clearable :rows="3" type="textarea" />
      </el-form-item>
    </el-form>

    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetData()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { checkContestItem } from "@/api/contestManage";
import {
  deleteContestItem,
  editContestItem,
  getContestInfo,
  getContestRules,
  getGroups,
  getContestItem,
  getContestPeriod,
  saveContestItem,
} from "@/api/contestManage";
import moment from "moment";

export default {
  dicts: ["sys_contest_groups", "sys_contest_rule"],
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
    const checkIsSameOrBefore = (time1, time2) => {
      return moment(time1).isSameOrBefore(time2);
    };

    const validEnrollBeginTime = (rule, value, callback) => {
      // 如果 此时没有报名结束时间,
      if (!value) {
        callback(new Error("请选择报名开始时间"));
      }
      if (!this.form.enrollEndTime) {
        callback();
      }
      if (checkIsSameOrBefore(value, this.form.enrollEndTime)) {
        callback();
      } else {
        callback(new Error("报名开始时间不能晚于报名结束时间"));
      }
    };

    const validEnrollEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择报名结束时间"));
      }
      // 如果 此时没有报名开始时间,
      if (!this.form.enrollBeginTime) {
        callback();
      }
      if (checkIsSameOrBefore(this.form.enrollBeginTime, value)) {
        callback();
      } else {
        callback(new Error("报名结束时间必须等于或晚于报名开始时间"));
      }
    };

    const validBeginTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择开赛时间"));
      }
      // 如果 此时没有结赛时间
      if (!this.form.contestEndTime) {
        callback();
      }
      if (checkIsSameOrBefore(value, this.form.contestEndTime)) {
        callback();
      } else {
        callback(new Error("开赛时间不能晚于结赛时间"));
      }
    };

    const validEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择结赛时间"));
      }
      // 如果 此时没有开赛时间
      if (!this.form.contestBeginTime) {
        callback();
      }
      if (checkIsSameOrBefore(this.form.contestBeginTime, value)) {
        callback();
      } else {
        callback(new Error("结赛时间必须等于或晚于开赛时间"));
      }
    };

    const validItemName = (rule, value, callback) => {
      if (!value || !value.trim().length) {
        callback(new Error("请输入赛项名称"));
      } else {
        this.$refs.form.validateField("name", (errorMessage) => {
          return "请选择赛事名称";
        });

        this.$refs.form.validateField("period", (errorMessage) => {
          return "请选择赛届";
        });

        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () => {
          if (this.form.name && this.form.period) {
            const data = {
              id: this.updateId,
              competitionId: this.form.name,
              annualId: this.form.period,
              contestName: this.form.itemName,
            };
            const result = await checkContestItem(data);
            if (result === true) {
              callback();
            } else {
              callback(new Error(`赛项名称 ${this.form.itemName} 已存在`));
            }
          }
        }, 500);
      }
    };

    return {
      visible: false,
      updateId: undefined,
      timer: null,
      form: {
        name: undefined, // 赛事名称
        period: undefined, // 赛届
        code: undefined, // 编号
        itemName: undefined, // 赛项名称
        groups: [],
        rules: [],
        count: undefined, // 名额
        age: undefined,
        enrollBeginTime: undefined,
        enrollEndTime: undefined,
        contestBeginTime: undefined,
        contestEndTime: undefined,
        remark: undefined,
      },
      allContestNames: [],
      allPeriods: [],
      allGroups: [],
      allRules: [],
      dataRule: {
        name: [{ required: true, message: "请选择赛事名称", trigger: "change" }],
        period: [{ required: true, message: "请选择赛届", trigger: "change" }],
        code: [{ required: true, message: "请输入赛项编号", trigger: "change" }],
        itemName: [{ required: true, trigger: "change", validator: validItemName }],
        groups: [{ required: true, message: "请选择组别", trigger: "blur" }],
        rules: [{ required: true, message: "请选择赛制", trigger: "blur" }],
        // count: [{ required: false, message: "请输入区局名额", trigger: "change" }],
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
          getContestPeriod(defaultParams)
            .then((res) => {
              this.allPeriods = (res?.rows || []).reduce((prev, cur) => {
                if (cur.competitionId === info?.competitionId)
                  prev.push({
                    label: cur?.["annualName"] || "",
                    value: cur?.["id"],
                  });
                return prev;
              }, []);
            })
            .catch((err) => {});

          // 获取赛制
          getContestRules(defaultParams)
            .then((res) => {
              this.allRules = (res?.rows ?? []).map((v) => ({ label: v.formatName, value: v.id, disabled: v.isDelete === 1 }));
            })
            .catch((err) => {
              this.allRules = [];
            });
          //  获取组别
          getGroups(defaultParams)
            .then((res) => {
              this.allGroups = (res?.rows ?? []).map((v) => ({ label: v.groupName, value: v.id, disabled: v.isDelete === 1 }));
            })
            .catch((err) => {
              this.allGroups = [];
            });

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
            itemName: info?.contestName, // 赛项名称
            groups: formatData(info?.groupId),
            rules: formatData(info?.formatId),
            age: info?.ageLimit ?? undefined,

            enrollBeginTime: info?.registrationTimeStart,
            enrollEndTime: info?.registrationTimeEnd,
            contestBeginTime: info?.competitionTimeStart,
            contestEndTime: info?.competitionTimeEnd,
            remark: info?.remark,
          };
        }
      });
    },
    handleNameChange(value) {
      // l("v", value);
      this.form.name = value;
      this.form.period = undefined;
      this.form.rules = [];
      this.form.groups = [];
      this.allRules = [];
      this.allGroups = [];
      if (!value) {
        this.allPeriods = [];
        return;
      }
      // 获取赛届的选项
      const defaultParams = {
        pageNum: 1,
        competitionId: this.form.name,
        pageSize: 1000,
      };
      getContestPeriod(defaultParams)
        .then((res) => {
          this.allPeriods = (res?.rows || []).reduce((prev, cur) => {
            prev.push({
              ...cur,
              label: cur?.["annualName"] || "",
              value: cur?.["id"],
            });
            return prev;
          }, []);
        })
        .catch((err) => {
          console.log("err", err);
          this.allPeriods = [];
        });
    },
    handlePeriodChange(value) {
      // l("value-赛届", value);
      this.form.period = value;
      this.form.rules = [];
      this.form.groups = [];
      this.allRules = [];
      this.allGroups = [];
      if (!value) {
        this.form.enrollBeginTime = undefined;
        this.form.enrollEndTime = undefined;
        this.form.contestBeginTime = undefined;
        this.form.contestEndTime = undefined;
        return;
      }
      // 初始化时间, 将赛项的各个时间初始化为 赛届的时间
      const periodInfo = this.allPeriods.find((v) => v.id === value) ?? {};
      l("pp", periodInfo);
      // 初始化时间
      this.form.enrollBeginTime = periodInfo?.registrationTimeStart;
      this.form.enrollEndTime = periodInfo?.registrationTimeEnd;
      this.form.contestBeginTime = periodInfo?.competitionTimeStart;
      this.form.contestEndTime = periodInfo?.competitionTimeEnd;

      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: this.form.name,
        annualId: this.form.period,
      };

      // 获取赛制
      getContestRules(defaultParams)
        .then((res) => {
          this.allRules = (res?.rows ?? []).map((v) => ({ label: v.formatName, value: v.id, disabled: v.isDelete === 1 }));
        })
        .catch((err) => {
          this.allRules = [];
        });
      //  获取组别
      getGroups(defaultParams)
        .then((res) => {
          this.allGroups = (res?.rows ?? []).map((v) => ({ label: v.groupName, value: v.id, disabled: v.isDelete === 1 }));
        })
        .catch((err) => {
          this.allGroups = [];
        });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const result = await checkContestItem({
            id: this.updateId,
            competitionId: this.form.name,
            annualId: this.form.period,
            contestName: this.form.itemName,
          });
          if (!result) {
            this.$message.error(`赛项名称 ${this.form.itemName} 已存在`);
            return;
          }

          const formData = { ...this.form };
          const data = {
            id: this.updateId,
            competitionId: formData.name, // 赛事名称
            annualId: formData.period, // 赛届
            contestCode: formData.code, //  赛项编号
            contestName: formData.itemName, //  赛项名称
            // todo  传 id
            // 组别: formData.group, //  组别
            groupIdList: [...formData.groups],
            formatIdList: [...formData.rules],
            quota: this.form.count, // 区局名额
            ageLimit: this.form.age,
            // 赛制: formData.rule, //  赛制
            registrationTimeStart: formData.enrollBeginTime, // 报名开始时间
            registrationTimeEnd: formData.enrollEndTime, // 报名结束时间
            competitionTimeStart: formData.contestBeginTime, // 开赛时间
            competitionTimeEnd: formData.contestEndTime, // 结赛时间
            remark: formData?.remark,
          };
          const ajaxFunc = this.updateId ? editContestItem : saveContestItem;

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
        }
      });
    },
    handleItemNameChange(v) {
      this.form.itemName = v;
    },
    resetData() {
      this.visible = false;
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
