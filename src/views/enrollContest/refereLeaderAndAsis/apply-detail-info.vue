<template>
  <el-dialog title="查看详情" width="800px" :close-on-click-modal="false" :visible.sync="visible" v-loading="loading">
    <div class="all-data">
      <!--        -->
      <el-descriptions class="margin-top" :column="2" border title="个人信息" style="margin-top: 20px">
        <el-descriptions-item>
          <template slot="label"> 姓名 </template>
          {{ allData.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 性别 </template>
          {{ allData.sex }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 出生日期 </template>
          {{ allData.birthday }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 民族 </template>
          {{ allData.nation }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 手机号 </template>
          {{ allData.phone }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 邮箱 </template>
          {{ allData.email }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 政治面貌 </template>
          {{ allData.politicsStatus }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 学历 </template>
          {{ allData.education }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 职业(工种)名称 </template>
          {{ allData.occupation }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 职业资格等级 </template>
          {{ allData.occupationalLevel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 从业时间 </template>
          {{ allData.workStart }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 从业年限 </template>
          {{ allData.years }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 专业技术职务 </template>
          {{ allData.duty }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 专业技术等级 </template>
          {{ allData.professionalLevel }}
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label"> 身份证号 </template>
          {{ allData.idCard }}
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label"> 工作单位 </template>
          {{ allData.company }}
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label"> 通讯地址 </template>
          {{ allData.contactAddr }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 邮政编码 </template>
          {{ allData.postalAddr }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"> 是否取得裁判员证 </template>
          {{ allData.refereeLicence }}
        </el-descriptions-item>

        <slot name="extra"></slot>

        <el-descriptions-item>
          <template slot="label"> 身份证正面 </template>
          <img class="idCard" :src="idCardOne.imgUrl" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 身份证反面 </template>
          <img class="idCard" :src="idCardTwo.imgUrl" />
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="small" style="margin-top: 10px">
      <el-form-item prop="result" label="审批意见">
        <el-input v-model="form.result" placeholder="" disabled :rows="3" type="textarea" style="width: 100%"></el-input>
      </el-form-item>
    </el-form>

    <template slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center"></el-row>
      <!--      <el-button @click="pass()" type="primary">通 过</el-button>-->
      <!--      <el-button @click="reject()" type="primary">驳 回</el-button>-->
      <el-button @click="resetData()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getFileInfoById, getPersonContestApplyInfoById, rejectOrganizerApprove, changeGrApproveStatus } from "@/api/contestManage";
import { getImgUrl } from "@/utils";
import AllData from "../../enrollContest/AllData.vue";
import { mapGetters } from "vuex";

export default {
  created() {},
  components: {
    AllData,
  },
  computed: {
    ...mapGetters(["dicts"]),
  },
  data() {
    return {
      visible: false,
      loading: false,
      allData: {},
      info: {},
      form: {
        result: undefined,
      },
      avatarInfo: {
        imgUrl: "",
        imgId: undefined,
      },
      idCardOne: {
        imgUrl: "",
        imgId: undefined,
      },
      idCardTwo: {
        imgUrl: "",
        imgId: undefined,
      },
      rules: {
        result: [{ required: false, message: "请输入审批意见", trigger: "change" }],
      },
    };
  },
  methods: {
    init(info) {
      this.visible = true;
      // 报名信息
      this.info = info;

      const applyInfo = {
        // contestName: info?.competitionName ?? undefined, // 赛事
        period: info?.annualName ?? undefined, // 赛届
        item: info?.contestName ?? undefined, // 赛项
        role: this.dicts.allRolesMap[info?.identity]?.label ?? "", // 身份
        group: info?.groupName ?? undefined, // 组别
        rule: info?.formatName ?? undefined, // 赛制
      };
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        // 初始化数据
        // this.$refs.form.resetFields();
        this.avatarInfo = {
          imgUrl: "",
          imgId: undefined,
        };
        this.idCardOne = {
          imgUrl: "",
          imgId: undefined,
        };
        this.idCardTwo = {
          imgUrl: "",
          imgId: undefined,
        };
        if (info?.approvalOpinion) {
          this.form.result = info?.approvalOpinion ?? undefined;
        }
        if (info?.applyUserId) {
          this.loading = true;
          const data = {
            applyUserId: info.applyUserId ?? undefined,
            contestId: info?.contestId ?? undefined,
            yearType: info?.yearType ?? undefined,
          };

          getPersonContestApplyInfoById(data)
            .then((res) => {
              l("rrrr", res);
              const { data = {} } = res ?? {};
              this.allData = {
                ...applyInfo,
                ...data,
                refereeLicence: data?.refereeLicence === 1 ? "国家级裁判员证" : "行业裁判员证",
                workStart: data?.workStart ? data?.workStart + "年" : undefined,
                years: data?.years ? data?.years + "年" : undefined,
                sex: data?.sex === 0 ? undefined : this.dicts.sexMap[data?.sex], // 0 代表没维护
              };
              this.loading = false;

              // 初始化 用户头像
              if (data?.photoAddr) {
                getFileInfoById(data?.photoAddr)
                  .then((res) => {
                    this.avatarInfo.imgUrl = getImgUrl(res?.data?.filePath ?? "");
                    this.avatarInfo.imgId = res?.data?.id ?? undefined;
                  })
                  .catch((err) => {});
              }
              // 初始化身份证
              if (data?.idCardOne) {
                getFileInfoById(data?.idCardOne)
                  .then((res) => {
                    this.idCardOne.imgUrl = getImgUrl(res?.data?.filePath ?? "");
                    this.idCardOne.imgId = res?.data?.id ?? undefined;
                  })
                  .catch((err) => {});
              }

              if (data?.idCardTwo) {
                getFileInfoById(data?.idCardTwo)
                  .then((res) => {
                    this.loading = false;
                    this.idCardTwo.imgUrl = getImgUrl(res?.data?.filePath ?? "");
                    this.idCardTwo.imgId = res?.data?.id ?? undefined;
                  })
                  .catch((err) => {});
              }
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
    resetData() {
      this.visible = false;
    },
    pass() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            approvalOpinion: this.form.result,
            id: this.info.id,
            status: 1, // 代表通过
          };
          changeGrApproveStatus(data)
            .then((res) => {
              this.$message.success(`审批成功`);
              this.visible = false;
              this.$emit("refreshDataList");
            })
            .catch(() => {
              this.visible = false;
              //this.$message.error(`审批失败`);
            });
        }
      });
    },
    reject() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            approvalOpinion: this.form.result,
            id: this.info.id,

            status: 2, // 代表驳回
          };

          changeGrApproveStatus(data)
            .then((res) => {
              this.$message.success(`审批成功`);
              this.visible = false;
              this.$emit("refreshDataList");
            })
            .catch(() => {
              this.visible = false;
              //this.$message.error(`审批失败`);
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

.all-data {
  ::v-deep {
    img.avatar {
      max-height: 100px;
      max-width: 100px;
    }
    img.idCard {
      max-height: 100px;
      max-width: 100px;
    }
  }
}
</style>
