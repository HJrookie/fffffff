<template>
  <div class="container">
    <el-steps :active="activeStep">
      <el-step title="步骤 1" description=""></el-step>
      <el-step title="步骤 2" description=""></el-step>
      <el-step title="步骤 3" description=""></el-step>
    </el-steps>

    <div class="step-container">
      <div class="step1" v-if="activeStep === 1">
        <el-form ref="form1" size="small" :model="step1Form" :rules="stem1FormRule" label-width="120px" class="el-form-fixed">
          <el-form-item label="赛事名称" prop="name">
            <el-select :value="step1Form.name" @input="handleNameChange" placeholder="请选择赛事名称" filterable clearable style="width: 100%">
              <el-option v-for="item in allContestNames" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛届" prop="period">
            <el-select :value="step1Form.period" @input="handlePeriodChange" placeholder="请选择赛届" filterable clearable style="width: 100%">
              <el-option v-for="item in allPeriods" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛项" prop="contestItem">
            <el-select :value="step1Form.contestItem" @input="handleContestItemChange" placeholder="请选择赛项" filterable clearable style="width: 100%">
              <el-option v-for="item in allContestItems" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="组别" prop="group">
            <el-select v-model="step1Form.group" placeholder="请选择组别" filterable clearable style="width: 100%">
              <el-option v-for="item in allGroups" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛制" prop="rule">
            <el-select v-model="step1Form.rule" placeholder="请选择组别" filterable clearable style="width: 100%">
              <el-option v-for="item in allRules" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
            </el-select>
          </el-form-item>

          <el-form-item label="申请名额" prop="count">
            <el-input-number v-model="step1Form.count" :min="0" placeholder="请输入申请名额" clearable style="width: 100%"></el-input-number>
          </el-form-item>

          <el-row type="flex" justify="center">
            <el-form-item>
              <el-button type="primary" @click="submitForm1"> 下一步 </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>

      <div class="step2" v-if="activeStep === 2">
        <el-form ref="form2" size="small" :model="form2" :rules="form2Rules" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="fullName" label="单位全称">
                <el-input v-model="form2.fullName" placeholder="请输入单位全称" clearable />
              </el-form-item>
              <el-form-item prop="certType" label="证件类型">
                <el-select v-model="form2.certType" placeholder="请选择证件类型" filterable clearable style="width: 100%">
                  <el-option v-for="item in dicts.institutionCertTypes" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item prop="certNum" label="证件号码">
                <el-input v-model="form2.certNum" placeholder="请输入证件号码" clearable />
              </el-form-item>
              <!--              <el-form-item prop="yingyezhizhao" label="单位联系人">-->
              <!--                <el-input v-model="form2.yingyezhizhao" placeholder="请输入单位联系人" clearable />-->
              <!--              </el-form-item>-->

              <el-form-item prop="phone" label="手机号">
                <el-input v-model="form2.phone" placeholder="请输入手机号" clearable />
              </el-form-item>

              <el-form-item prop="email" label="邮箱">
                <el-input v-model="form2.email" placeholder="请输入邮箱" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="imgInfo">
                <el-upload :action="uploadUrl" :headers="headers" drag :on-success="avatarSuccessHandle" :show-file-list="false" accept="image/*">
                  <template v-if="imgInfo.imgUrl">
                    <img class="el-upload-list__item-thumbnail avatar" :src="imgInfo.imgUrl" alt="对应的证件图片" />
                    <span class="upload-acton-idcard">
                      <i class="el-icon-zoom-in" style="margin-right: 10px" @click.stop="handlePictureCardPreview(imgInfo.imgUrl)"></i>
                      <!--                      <i class="el-icon-delete" @click.stop="handleAvatarRemove()"></i>-->
                    </span>
                  </template>
                  <template v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">请上传对应的证件图片</div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!--          <el-row>-->
          <!--            <el-form-item label="单位简介" prop="detail">-->
          <!--              <el-input v-model="form2.detail" placeholder="请输入单位简介" :rows="5" type="textarea"></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-row>-->

          <el-row type="flex" justify="center">
            <el-form-item>
              <el-button @click="nextStep(1)"> 上一步 </el-button>
              <el-button type="primary" @click="submitForm2"> 下一步 </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>

      <div class="step3" v-if="activeStep === 3">
        <div>
          <el-descriptions class="margin-top" title="赛项信息" :column="3" border>
            <el-descriptions-item>
              <template slot="label"> 赛事 </template>
              {{ allData.contestName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <!--                <i class="el-icon-mobile-phone"></i>-->
                赛届
              </template>
              {{ allData.contestPeriod }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <!--                <i class="el-icon-location-outline"></i>-->
                赛项
              </template>
              {{ allData.contestItem }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <!--                <i class="el-icon-tickets"></i>-->
                组别
              </template>
              <el-tag size="small">{{ allData.group }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <!--                <i class="el-icon-office-building"></i>-->
                赛制
              </template>
              <el-tag size="small">{{ allData.rule }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <!--                <svg-icon icon-class="number" />-->
                申请名额
              </template>
              {{ allData.count }}
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions class="margin-top" title="单位信息" :column="2" border>
            <el-descriptions-item>
              <template slot="label"> 单位全称 </template>
              {{ allData.fullName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 证件号码 </template>
              {{ allData.certNum }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 手机号 </template>
              {{ allData.phone }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 邮箱 </template>
              <el-tag size="small">{{ allData.email }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-row type="flex" justify="center" style="margin-top: 20px">
          <el-button @click="nextStep(2)"> 上一步 </el-button>
          <el-button type="primary" @click="saveAllData"> 提交 </el-button>
        </el-row>
      </div>
    </div>

    <!--  图片预览  -->
    <el-dialog title="图片预览" width="800px" :visible.sync="previewVisible" append-to-body :before-close="resetImgData">
      <img :src="previewUrl" class="preview-img" alt="图片预览" />
    </el-dialog>
  </div>
</template>

<script>
import { getContestPeriod, deleteContestPeriod, applyNewContest } from "@/api/contestManage";
import { deleteContestItem, editContestItem, getContestInfo, getContestRules, getGroups, getContestItem, saveContestItem } from "@/api/contestManage";
import { getCurUserInfo } from "@/api/user";
import { isEmail, isMobile } from "@/utils/validate";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import { getFileInfoById } from "@/api/contestManage";
export default {
  computed: {
    ...mapGetters(["dicts"]),
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value || !value.trim().length || !isMobile(value)) {
        callback(new Error("请输入有效的手机号"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!value || !value.trim().length || !isEmail(value)) {
        callback(new Error("请输入有效的邮箱"));
      } else {
        callback();
      }
    };

    const validIdCard = (rule, value, callback) => {
      const v = this.imgInfo.imgId;
      if (!v) {
        callback(new Error("请上传对应的证件图片"));
      } else {
        callback();
      }
    };

    return {
      activeStep: 1,
      allContestNames: [], // 赛事
      allPeriods: [], // 赛届
      allContestItems: [], // 赛项
      allGroups: [], // 组别选项
      allRules: [], // 赛制选项

      step1Form: {
        name: undefined,
        period: undefined,
        contestItem: undefined,
        group: undefined,
        rule: undefined,
        count: 1,
      },
      stem1FormRule: {
        name: [{ required: true, message: "请选择赛事名称", trigger: "change" }],
        period: [{ required: true, message: "请选择赛届", trigger: "change" }],
        contestItem: [{ required: true, message: "请选择赛项", trigger: "change" }],
        itemName: [{ required: true, message: "请输入赛项名称", trigger: "change" }],
        group: [{ required: true, message: "请选择组别", trigger: "blur" }],
        rule: [{ required: true, message: "请选择赛制", trigger: "blur" }],
        count: [{ required: true, message: "请输入申请名额", trigger: "change" }],
      },
      form2: {
        fullName: undefined, //
        certNum: undefined,
        certType: undefined,
        // yingyezhizhao: undefined, // 营业执照
        // contactMan: undefined,
        phone: undefined,
        email: undefined, //
        detail: undefined,
      },
      form2Rules: {
        fullName: [{ required: true, message: "请输入单位全称", trigger: "blur" }],
        certNum: [{ required: true, message: "请输入证件号码", trigger: "blur" }],
        imgInfo: [{ required: true, message: "请上传对应的证件图片", trigger: "blur", validator: validIdCard }],
        contactMan: [{ required: true, message: "请输入单位联系人", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "change", validator: validatePhone }],
        email: [{ required: true, message: "请输入邮箱", trigger: "change", validator: validateEmail }],
        detail: [{ required: true, message: "请输入单位简介", trigger: "blur" }],
      },
      allData: {},

      previewVisible: false,
      previewUrl: "",
      // 上传文件 时需要的header
      headers: {
        // Authorization: "Bearer " + getToken(),
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      imgInfo: {
        imgUrl: "",
        imgId: undefined,
      },
    };
  },
  created() {
    // 获取选项 只获取赛事的选项
    const defaultParams = {
      pageNum: 1,
      pageSize: 1000,
      status: 2, // 报名中
    };
    this.getAllContestNames(defaultParams);

    // 获取用户数据 初始化 form2
    getCurUserInfo().then((res) => {
      const { data = {} } = res || {};
      this.form2 = {
        fullName: data?.name ?? undefined,
        certType: data?.cardType ?? undefined,
        certNum: data?.idCard ?? undefined,
        // contactMan: data?.yingyezhizhao ?? undefined,
        phone: data?.phonenumber ?? undefined,
        email: data?.email ?? undefined,
      };

      if (data?.idCardOne) {
        getFileInfoById(data?.idCardOne)
          .then((res) => {
            this.imgInfo.imgUrl = getImgUrl(res?.data?.filePath ?? "");
            this.imgInfo.imgId = res?.data?.id ?? undefined;
          })
          .catch((err) => {});
      }
    });
  },
  methods: {
    nextStep(v) {
      this.activeStep = v;
    },
    handleNameChange(value) {
      // l("v", value);
      this.step1Form.name = value;
      this.step1Form.period = undefined;
      this.step1Form.contestItem = undefined;
      this.step1Form.group = [];
      this.step1Form.rule = [];
      if (!value) {
        this.allPeriods = [];
        this.allContestItems = [];
        this.allGroups = [];
        this.allRules = [];
        return;
      }
      // 获取赛届的选项
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        status: 2, // 报名中

        competitionId: this.step1Form.name,
      };
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
        .catch((err) => {
          console.log("err", err);
          this.allPeriods = [];
        });
    },
    handlePeriodChange(value) {
      this.step1Form.period = value;
      this.step1Form.contestItem = undefined;
      this.step1Form.group = [];
      this.step1Form.rule = [];
      if (!value) {
        this.allContestItems = [];
        this.allGroups = [];
        this.allRules = [];

        return;
      }
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: this.step1Form.name,
        annualId: this.step1Form.period,
      };

      // 获取赛项的选项
      getContestItem(defaultParams)
        .then((res) => {
          this.allContestItems = (res?.rows ?? []).map((v) => ({
            ...v,
            value: v.id,
            label: v.contestName,
          }));
        })
        .catch((err) => {
          this.allContestItems = [];
        });
    },
    // 处理赛项的变化
    handleContestItemChange(value) {
      this.step1Form.contestItem = value;
      this.step1Form.group = [];
      this.step1Form.rule = [];
      if (!value) {
        this.allGroups = [];
        this.allRules = [];
        return;
      }
      const contestItemInfo = this.allContestItems.find((v) => v.id === value);
      if (!contestItemInfo) {
        this.allGroups = [];
        this.allRules = [];
        return;
      }
      const { formatId, groupId } = contestItemInfo;
      const getIdsFromIdStr = (str) => {
        if (!str || !str?.trim().length) {
          return [];
        }
        str = str.slice(0, str.length - 1);
        return str.split(",").reduce((prev, cur) => ({ ...prev, [cur]: true }), {});
      };

      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        status: 2, // 报名中

        competitionId: this.step1Form.name,
        annualId: this.step1Form.period,
      };
      // 获取赛制
      getContestRules(defaultParams)
        .then((res) => {
          const idMap = getIdsFromIdStr(formatId);
          this.allRules = (res?.rows ?? [])
            .filter((item) => idMap[item.id])
            .map((v) => ({
              label: v.formatName,
              value: v.id,
            }));
        })
        .catch((err) => {
          this.allRules = [];
        });
      //  获取组别
      getGroups(defaultParams)
        .then((res) => {
          const idMap = getIdsFromIdStr(groupId);
          this.allGroups = (res?.rows ?? [])
            .filter((item) => idMap[item.id])
            .map((v) => ({
              label: v.groupName,
              value: v.id,
            }));
        })
        .catch((err) => {
          this.allGroups = [];
        });
    },
    submitForm1() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.nextStep(2);
        }
      });
    },
    submitForm2() {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          this.nextStep(3);
          // 表单 1 的数据
          const contestName = this.allContestNames.find((v) => v.value === this.step1Form.name)?.label ?? ""; // 赛事
          const contestPeriod = this.allPeriods.find((v) => v.value === this.step1Form.period)?.label ?? ""; // 赛届
          const contestItem = this.allContestItems.find((v) => v.value === this.step1Form.contestItem)?.label ?? ""; // 赛项
          const { group: groupId, rule: ruleId, count } = this.step1Form;
          const rule = this.allRules.find((v) => v.value === ruleId)?.label ?? "";
          const group = this.allGroups.find((v) => v.value === groupId)?.label ?? "";

          // 表单 2
          const {
            fullName,
            certNum,
            phone,
            email,
            // detail,
          } = this.form2;

          this.allData = {
            contestName,
            contestPeriod,
            contestItem,
            group,
            rule,
            count,
            //
            fullName,
            certNum,
            phone,
            email,
          };
        }
      });
    },
    getAllContestNames(params) {
      getContestInfo(params)
        .then((res) => {
          this.allContestNames = (res?.rows || []).reduce(
            (prev, cur) =>
              (prev = prev.concat({
                label: cur?.["competitionName"] || "",
                value: cur?.["id"],
              })),
            []
          );
        })
        .catch((err) => {});
    },
    saveAllData() {
      const { name, period, contestItem, group, rule, count } = this.step1Form;
      const { fullName, certNum, yingyezhizhao, contactMan, phone, email, detail } = this.form2;

      const data = {
        contestId: contestItem, // 赛项 id,  不用传赛事和赛届的 id,因为有了赛项 id,
        groupId: group, // 组别
        formatId: rule, // 赛制
        applyQuota: count, // 申请名额
        maApplyUserVO: {
          name: fullName, // 单位全称
          idCard: certNum, // 证件号码
          phone, // 手机号
          email, // 邮箱
        },
      };
      applyNewContest(data)
        .then((res) => {
          this.$message.success("申请成功");
          this.$router.push("/enrollContest/itemApply");
        })
        // Promise.reject(2)
        .catch((err) => {
          // this.$message.error("申请失败,请重试");
          this.nextStep(1);
        });
    },
    handlePictureCardPreview(url) {
      this.previewUrl = url;
      this.previewVisible = true;
    },
    handleAvatarRemove() {
      this.imgInfo.imgUrl = "";
      this.imgInfo.imgId = undefined;
    },
    resetImgData() {
      this.previewVisible = false;
      this.previewUrl = "";
    },
    avatarSuccessHandle(response, file, fileList) {
      this.imgInfo.imgUrl = getImgUrl(response?.filePath);
      this.imgInfo.imgId = response?.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.step-container {
  height: 100%;
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .step1 {
    width: 600px;
    height: 100%;
  }
  .step2 {
    width: 1000px;
    height: 100%;
  }
  .step3 {
    width: 800px;
    height: 100%;
  }
  .margin-top {
    margin-top: 10px;
  }
}
.preview-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}
.avatar {
  max-width: 100%;
  max-height: 100%;
}

.upload-acton-idcard {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 178px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #00000029;

    i {
      visibility: visible;
      color: #ffffffd4;
    }
  }

  i {
    font-size: 18px;
    visibility: hidden;
  }
}
</style>
