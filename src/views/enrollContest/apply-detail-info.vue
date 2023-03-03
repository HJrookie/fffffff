<template>
  <el-dialog title="查看详情" width="800px" :close-on-click-modal="false" :visible.sync="visible">
    <person-data :all-data="allData">
      <template v-slot:extra>
        <el-descriptions-item v-if="avatarInfo.imgUrl" :span="2">
          <template slot="label"> 免冠照 </template>
          <img class="avatar" :src="avatarInfo.imgUrl" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 身份证正面 </template>
          <img class="idCard" :src="idCardOne.imgUrl" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 身份证反面 </template>
          <img class="idCard" :src="idCardTwo.imgUrl" />
        </el-descriptions-item>
      </template>
    </person-data>

    <el-form ref="form" :model="form" label-width="80px" disabled="" size="small" style="margin-top: 10px">
      <el-form-item prop="result" label="审批意见">
        <el-input v-model="form.result" placeholder="" :rows="3" type="textarea" style="width: 100%"></el-input>
      </el-form-item>
    </el-form>

    <template slot="footer" class="dialog-footer">
      <el-button @click="resetData()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getFileInfoById, getPersonContestApplyInfoById } from "@/api/contestManage";
import { getImgUrl } from "@/utils";
import PersonData from "./personData.vue";
import { mapGetters } from "vuex";

export default {
  created() {},
  components: {
    PersonData,
  },
  computed: {
    ...mapGetters(["dicts"]),
  },
  data() {
    return {
      visible: false,
      allData: {},
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
      form: {
        result: undefined,
      },
    };
  },
  methods: {
    init(info) {
      this.visible = true;
      // 报名信息
      const applyInfo = {
        cName: info?.competitionName ?? undefined, // 赛事
        period: info?.annualName ?? undefined, // 赛届
        item: info?.contestName ?? undefined, // 赛项
        role: this.dicts.allRolesMap[info?.identity]?.label ?? "", // 身份
        group: info?.groupName ?? undefined, // 组别
        rule: info?.formatName ?? undefined, // 赛制
      };
      this.form.result = info?.approvalOpinion;
      this.$nextTick(() => {
        if (info?.applyUserId) {
          const data = {
            applyUserId: info.applyUserId,
            contestId: info?.contestId,
            yearType: info?.yearType,
          };
          getPersonContestApplyInfoById(data)
            .then((res) => {
              l("rrrr", res);
              const { data = {} } = res ?? {};
              this.allData = {
                ...data,
                ...applyInfo,
                institutionPhone: data?.companyPhone,
                hName: data?.name ?? undefined, // 姓名
                phone: data?.phone ?? undefined,
                sex: data?.sex === 0 ? undefined : this.dicts.sexMap[data?.sex], // 0 代表没维护
                email: data?.email,
                age: data?.age ?? undefined,

                idNumber: data?.idCard, // 身份证号
                nation: data?.nation, // 民族
                job: data?.occupation, // 职业
                jobLevel: data?.professionalLevel, // 职称
                jobZige: data?.occupationalLevel, // 资格和等级
                institution: data?.company, // 所属单位
                edu: data?.education, // 文化程度
                zzmm: data?.politicsStatus, // 政治面貌
                registeredResidence: data?.registerAddr, // 户籍所在地
                history: data?.experience, // 个人经历
              };

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
                    this.idCardTwo.imgUrl = getImgUrl(res?.data?.filePath ?? "");
                    this.idCardTwo.imgId = res?.data?.id ?? undefined;
                  })
                  .catch((err) => {});
              }
            })
            .catch((err) => {});
        }
      });
    },
    resetData() {
      this.visible = false;
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
