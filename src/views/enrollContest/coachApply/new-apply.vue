<template>
  <el-dialog title="将教练申请为裁判" width="600px" :close-on-click-modal="false" :visible.sync="visible">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small" style="margin-top: 10px">
      <el-form-item prop="jl" label="教练">
        <el-select :value="form.jl" @input="handleJlChange" placeholder="请选择教练" filterable clearable style="width: 100%">
          <el-option v-for="item in jls" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <div class="detail">
        <el-descriptions class="margin-top" :column="2" border title="教练信息">
          <el-descriptions-item>
            <template slot="label"> 赛事名称 </template>
            {{ allData.contestName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 赛届名称 </template>
            {{ allData.period }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 赛项 </template>
            {{ allData.item }}
          </el-descriptions-item>

          <el-descriptions-item v-if="allData.group">
            <template slot="label"> 组别 </template>
            <el-tag size="small">{{ allData.group }}</el-tag>
          </el-descriptions-item>

          <el-descriptions-item v-if="allData.rule">
            <template slot="label"> 赛制 </template>
            <el-tag size="small">{{ allData.rule }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-form>

    <template slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>

      <el-button @click="resetData()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getImgUrl } from "@/utils";
import { mapGetters } from "vuex";
import { changeCoachToReferee, getUsersForCs } from "@/api/userManage";

export default {
  created() {
  },
  components: {},
  computed: {},
  data() {
    return {
      visible: false,
      loading: false,
      allData: {},
      form: {
        jl: undefined, // 教练
      },
      rules: {
        jl: [{ required: true, trigger: "change", message: "请选择教练" }],
      },
      jls: [],
    };
  },
  methods: {
    init(info) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.allData = {};
        const data = {
          identity: 6, // 教练
          pageNum: 1,
          pageSize: 1000,
          userType: 3, // 个人用户
          yearType: 1, // 代表今年的
        };
        getUsersForCs(data)
          .then((res) => {
            l(3333333, res);
            this.jls = (res?.rows || []).map((v) => {
              return {
                ...v,
                value: v.id,
                label: `${v.competitionName}-${v.annualName}-${v.contestName}-${v.formatName}-${v.groupName}-${v.applyUserName ?? ""}`,
                // label: `${v.applyUserName ?? ""}`,
              };
            });
          })
          .catch((err) => {});
      });
    },
    resetData() {
      this.visible = false;
    },
    handleJlChange(value) {
      this.allData = {};
      this.loading = true;
      this.form.jl = value;
      this.loading = true;
      const info = this.jls.find((v) => v.value === value);
      this.allData = {
        contestName: info?.competitionName ?? "",
        period: info?.annualName ?? "",
        item: info?.contestName ?? "",
        group: info?.groupName ?? "",
        rule: info?.formatName ?? "",
      };
      this.loading = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            applyIdentity: 3, // 教练的身份是 3
            applyPersonalId: this.form.jl,
            isPartTime: 1, // 是否是兼职,  这里是 教练变成了裁判, 传 1
            type: 1,
          };
          changeCoachToReferee(data)
            .then((res) => {
              this.visible = false;
              this.$emit("refreshDataList");

              this.$message.success(`申请成功`);
            })
            .catch((err) => {
              this.visible = false;
              this.$emit("refreshDataList");

              // this.$message.error(`申请失败,请重试`);
            });
        }
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
.detail {
  height: 175px;
}
</style>
