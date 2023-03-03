<template>
  <div class="container">
    <el-steps :active="activeStep">
      <el-step title="步骤 1" description="请完善报名信息"></el-step>
      <el-step title="步骤 2" description="请确认个人信息"></el-step>
      <el-step title="步骤 3" description="请确认所有信息"></el-step>
    </el-steps>

    <div class="step-container">
      <div class="step1" v-if="activeStep === 1">
        <el-form ref="form1" size="small" :model="form1" :rules="form1Rule" label-width="115px" class="el-form-fixed">
          <el-form-item label="身份" prop="role">
            <el-select v-model="form1.role" placeholder="请选择身份" filterable clearable style="width: 100%">
              <el-option v-for="item in allRoles" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛事名称" prop="name">
            <el-select :value="form1.name" @input="handleNameChange" placeholder="请选择赛事名称" filterable clearable style="width: 100%">
              <el-option v-for="item in allContestNames" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛届" prop="period">
            <el-select :value="form1.period" @input="handlePeriodChange" placeholder="请选择赛届" filterable clearable style="width: 100%">
              <el-option v-for="item in allPeriods" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛项" prop="itemName">
            <el-select :value="form1.itemName" @input="handleItemNameChange" placeholder="请选择赛项" filterable clearable style="width: 100%">
              <el-option v-for="item in allContestItems" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div v-if="tipVis" class="tip-warn">{{ tipInfo }}</div>
          </el-form-item>

          <el-form-item label="组别" prop="group">
            <el-select :value="form1.group" @input="handleGroupChange" placeholder="请选择组别" filterable clearable style="width: 100%">
              <el-option v-for="item in allGroups" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
            </el-select>
          </el-form-item>

          <el-form-item label="赛制" prop="rule">
            <el-select :value="form1.rule" @input="handleRuleChange" placeholder="请选择赛制" filterable clearable style="width: 100%">
              <el-option v-for="item in allRules" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
            </el-select>
          </el-form-item>

          <el-form-item label="所属单位" prop="unit">
            <el-select v-model="form1.unit" placeholder="请选择所属单位" filterable clearable style="width: 100%">
              <el-option v-for="item in units" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </el-form>

        <el-row type="flex" justify="center">
          <el-button type="primary" @click="checkForm1" size="mini"> 下一步 </el-button>
        </el-row>
      </div>

      <!--      todo 当用户第一步选择了赛项的时候 ,去调赛项详情的接口 获取赛项的备注, 如果赛项有相关备注  如年龄限制==, 则展示相关信息(在步骤 1 和步骤二中都展示)-->

      <div class="step2" v-if="activeStep === 2">
        <div class="personForm">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="personForm" size="small" v-loading="loading">
            <el-row>
              <el-col :span="18">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="hName" label="姓名" label-width="115px">
                      <el-input v-model="form.hName" placeholder="请输入姓名" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item prop="sex" label="性别" label-width="115px">
                      <el-select v-model="form.sex" placeholder="请选择性别" filterable clearable style="width: 100%">
                        <el-option v-for="item in dicts.sex" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="age" label="年龄" label-width="115px">
                      <el-input-number v-model="form.age" placeholder="请输入年龄" style="width: 100%" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item prop="nation" label="民族" label-width="115px">
                      <el-select v-model="form.nation" placeholder="请选择民族" filterable clearable style="width: 100%">
                        <el-option v-for="item in dicts.nations" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="phone" label="手机号" label-width="115px">
                      <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item prop="email" label="邮箱" label-width="115px">
                      <el-input v-model="form.email" placeholder="请输入邮箱" clearable style="width: 100%" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="22">
                    <el-form-item prop="idNumber" label="身份证号" label-width="115px">
                      <el-input v-model="form.idNumber" placeholder="请输入身份证号" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="zzmm" label="政治面貌" label-width="115px">
                      <el-input v-model="form.zzmm" placeholder="请输入政治面貌" clearable />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item prop="edu" label="文化程度" label-width="115px">
                      <el-input v-model="form.edu" placeholder="请输入文化程度" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <!--          头像框-->
                <el-form-item label-width="8px" prop="pic1" class="userAvatar">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="headers"
                    list-type="picture-card"
                    accept="image/*"
                    :on-success="avatarSuccessHandle"
                    :show-file-list="false"
                  >
                    <img v-if="avatarInfo.imgUrl" class="el-upload-list__item-thumbnail avatar" :src="avatarInfo.imgUrl" alt="111" />
                    <span v-if="avatarInfo.imgUrl" class="el-upload-action">
                      <i class="el-icon-zoom-in" style="margin-right: 5px" @click.stop="handlePictureCardPreview(avatarInfo.imgUrl)"></i>
                      <!--                      <i class="el-icon-delete" @click.stop="handleAvatarRemove()"></i>-->
                    </span>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-form-item label-width="8px" prop="idCardOne">
                  <el-upload :action="uploadUrl" :headers="headers" drag :on-success="idCard1SuccessHandle" :show-file-list="false" accept="image/*">
                    <template v-if="idCardOne.imgUrl">
                      <img class="el-upload-list__item-thumbnail id-card" :src="idCardOne.imgUrl" alt="身份证正面图" />
                      <span class="upload-acton-idcard">
                        <i class="el-icon-zoom-in" style="margin-right: 10px" @click.stop="handlePictureCardPreview(idCardOne.imgUrl)"></i>
                        <!--                        <i class="el-icon-delete" @click.stop="handleIdCard1Remove()"></i>-->
                      </span>
                    </template>
                    <template v-else>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">请上传身份证正面图片</div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="8px" prop="idCardTwo">
                  <el-upload :action="uploadUrl" :headers="headers" drag :on-success="idCard2SuccessHandle" :show-file-list="false" accept="image/*">
                    <template v-if="idCardTwo.imgUrl">
                      <img class="el-upload-list__item-thumbnail id-card" :src="idCardTwo.imgUrl" alt="身份证反面图" />
                      <span class="upload-acton-idcard">
                        <i class="el-icon-zoom-in" style="margin-right: 10px" @click.stop="handlePictureCardPreview(idCardTwo.imgUrl)"></i>
                        <!--                        <i class="el-icon-delete" @click.stop="handleIdCard2Remove()"></i>-->
                      </span>
                    </template>
                    <template v-else>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">请上传身份证反面图片</div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="job" label="现从事职业" label-width="115px">
                  <el-input v-model="form.job" placeholder="请输入现从事职业" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="jobLevel" label="职称" label-width="115px">
                  <el-input v-model="form.jobLevel" placeholder="请输入职称" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="institution" label="所属单位" label-width="115px">
                  <el-input v-model="form.institution" placeholder="请输入所属单位" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="institutionPhone" label="单位手机号" label-width="115px">
                  <el-input v-model="form.institutionPhone" placeholder="请输入单位手机号" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="ldName" label="领队姓名" label-width="115px">
                  <el-input v-model="form.ldName" placeholder="请输入领队姓名" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="ldPhone" label="领队手机号" label-width="115px">
                  <el-input v-model="form.ldPhone" placeholder="请输入领队手机号" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="t1" label="指导教师一" label-width="115px">
                  <el-input v-model="form.t1" placeholder="请输入指导教师一" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="t2" label="指导教师二" label-width="115px">
                  <el-input v-model="form.t2" placeholder="请输入指导教师二" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="separator"></div>

            <el-row>
              <el-form-item prop="jobZige" label="职业资格及等级 " label-width="115px">
                <el-input v-model="form.jobZige" placeholder="请输入现有资格及等级" maxlength="20" clearable />
              </el-form-item>
            </el-row>

            <el-form-item prop="registeredResidence" label="户籍所在地" label-width="115px">
              <el-input v-model="form.registeredResidence" placeholder="请输入户籍所在地" clearable maxlength="100" />
            </el-form-item>
            <el-form-item prop="history" label="个人简历" label-width="115px">
              <el-input v-model="form.history" placeholder="请输入个人简历" :rows="5" type="textarea" maxlength="1000"></el-input>
            </el-form-item>

            <el-row type="flex" justify="center">
              <el-form-item>
                <el-button @click="nextStep(1)" size="mini"> 上一步 </el-button>

                <el-button type="primary" @click="save" style="margin-left: 20px" size="mini">下一步 </el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>

      <div class="step2" v-if="activeStep === 3">
        <person-data :all-data="allData"></person-data>
        <el-row type="flex" justify="center" style="margin-top: 20px">
          <el-button size="mini" @click="nextStep(2)"> 上一步 </el-button>
          <el-button size="mini" type="primary" @click="submit()" style="margin-left: 20px"> 提交 </el-button>
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
import { deleteContestPeriod, getFileInfoById, getTargetContestItemCsUsers } from "@/api/contestManage";
import { getContestInfo, getContestRules, getGroups, getContestItem, getContestPeriod, saveContestItem } from "@/api/contestManage";
import { mapGetters } from "vuex";
import { isMobile } from "@/utils/validate";
import { getCurUserInfo, savePersonalInfo } from "@/api/user";
import PersonData from "./personData.vue";
import { addNewApplyForContest } from "@/api/userManage";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";

export default {
  created() {
    const defaultParams = {
      pageNum: 1,
      status: 2, // 只获取报名中的
      pageSize: 1000,
    };
    this.getAllContestNames(defaultParams);
    this.init();
  },
  components: { PersonData },
  computed: {
    ...mapGetters(["dicts"]),
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };

    const validIdCard = (rule, value, callback) => {
      if (!value || value.length !== 18) {
        callback(new Error("请输入正确的身份证号"));
      } else {
        callback();
      }
    };

    const validIdCard1 = (rule, value, callback) => {
      const v = this.idCardOne.imgId;
      if (!v) {
        callback(new Error("请上传身份证正面图片"));
      } else {
        callback();
      }
    };

    const validPhone2 = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (!isMobile(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };

    const validIdCard2 = (rule, value, callback) => {
      const v = this.idCardTwo.imgId;
      if (!v) {
        callback(new Error("请上传身份证反面图片"));
      } else {
        callback();
      }
    };

    return {
      activeStep: 1,
      allRoles: [
        {
          label: "选手", //identity 和userType 分别传递 1, 3
          value: 1,
        },
        {
          label: "教练", // identity 和userType 分别传递   6,3
          value: 2,
        },
        //todo  确认联络员以及领队
        // {
        //   label: "联络员", //
        //   value: "3",
        // },
        // {
        //   label: "领队",
        //   value: "领队",
        // },
      ],
      allContestNames: [], // 赛事选项
      allPeriods: [], // 赛届选项
      tipVis: false,
      tipInfo: undefined,
      allContestItems: [], // 赛项选项
      allGroups: [], // 组别
      tempGroups: [],
      tempRules: [],
      allRules: [], // 赛制
      units: [], // 参赛单位
      loading: false,
      form1: {
        role: undefined, // s 身份
        name: undefined, // 赛事名称
        period: undefined, // 赛届
        itemName: undefined, // 赛项名称
        group: undefined, // 组别
        rule: undefined, // 赛制
        unit: undefined, // 所属单位
      },
      form1Rule: {
        role: [{ required: true, message: "请选择身份", trigger: "change" }],
        name: [{ required: true, message: "请选择赛事", trigger: "change" }],
        period: [{ required: true, message: "请选择赛届", trigger: "change" }],
        itemName: [{ required: true, message: "请选择赛项", trigger: "change" }],
        group: [{ required: true, message: "请选择组别", trigger: "change" }],
        rule: [{ required: true, message: "请选择赛制", trigger: "change" }],
        unit: [{ required: true, message: "请选择所属单位", trigger: "change" }],
      },
      form: {
        hName: "", //
        sex: undefined,
        pic1: undefined, // 头像照片
        age: undefined, //
        nation: undefined, // 民族
        phone: undefined, //
        idNumber: undefined, // 身份证号
        zzmm: undefined, // 政治面貌
        //todo  图片显示
        idCardOne: undefined, // 身份证正面
        idCardTwo: undefined, // 身份证反面

        email: undefined, //
        edu: undefined, //  教育
        job: undefined, //  // 职业
        jobLevel: undefined, //    职称
        jobZige: undefined, // 资格和等级
        professionInfo: {
          value: undefined,
          files: [],
        },
        institution: undefined, // 所属单位
        institutionPhone: undefined, // 所属单位 手机号

        ldName: undefined, // 领队姓名
        ldPhone: undefined,
        t1: undefined, // 教师 1
        t2: undefined,

        registeredResidence: undefined, // 户籍所在地
        history: undefined, // 个人简历

        // 这俩字段是最终提交的时候用的,
        tempUserId: undefined,
        tempName: undefined,
      },
      rules: {
        hName: [{ required: false, trigger: "blur", message: "请输入姓名" }],
        sex: [{ required: false, trigger: "change", message: "请选择性别" }],
        age: [{ required: true, trigger: "change", message: "请输入年龄" }],
        pic1: [{ required: false, trigger: "change", message: "请上传免冠照片" }],
        nation: [{ required: false, trigger: "change", message: "请选择民族" }],
        idNumber: [{ required: true, trigger: "change", message: "请输入身份证号", validator: validIdCard }],
        email: [{ required: false, trigger: "blur", message: "请输入邮箱" }],
        institutionPhone: [{ required: false, trigger: "change", validator: validPhone2 }],
        ldPhone: [{ required: false, trigger: "change", validator: validPhone2 }],
        phone: [{ required: true, trigger: "change", message: "请输入手机号", validator: validPhone }],
        idCardOne: [{ required: true, trigger: "blur", message: "请上传身份证正面图片", validator: validIdCard1 }],
        idCardTwo: [{ required: true, trigger: "blur", message: "请上传身份证反面图片", validator: validIdCard2 }],
      },
      allData: {},

      previewVisible: false,
      // 上传文件 时需要的header
      headers: {
        // Authorization: "Bearer " + getToken(),
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      // 头像照片信息
      avatarInfo: {
        files: [],
        imgUrl: "",
        imgId: undefined,
      },
      previewUrl: "",
      idCardOne: {
        imgUrl: "",
        imgId: undefined,
      },
      idCardTwo: {
        imgUrl: "",
        imgId: undefined,
      },
    };
  },
  methods: {
    nextStep(v) {
      this.activeStep = v;
    },

    handleNameChange(value) {
      // l("v", value);
      this.form1.name = value;
      this.form1.period = undefined;
      this.form1.itemName = undefined;
      this.form1.group = undefined;
      this.form1.rule = undefined;
      this.form1.unit = undefined;

      this.allPeriods = [];
      this.allContestItems = [];
      this.allRules = [];
      this.allGroups = [];
      this.units = [];
      if (!value) {
        this.tipVis = false;
        this.tipInfo = "";
        return;
      }
      // 获取赛届的选项
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: this.form1.name,
        status: 2, // 只获取报名中的
      };
      getContestPeriod(defaultParams)
        .then((res) => {
          // 这里只获取最近一届, 这个接口返回的数据都是排好序的了
          let result = res?.rows || [];
          // if (result.length === 0) {
          //   this.allPeriods = [];
          // } else if (result.length >= 1) {
          //   this.allPeriods = [
          //     {
          //       ...result[0],
          //       label: result[0].annualName,
          //       value: result[0].id,
          //     },
          //   ];
          // }
          //
          this.allPeriods = (res?.rows || []).reduce((prev, cur) => {
            prev.push({
              label: cur?.["annualName"] || "",
              value: cur?.["id"],
            });
            return prev;
          }, []);
        })
        .catch((err) => {});
    },
    handlePeriodChange(value) {
      l("value", value);
      this.form1.period = value;
      this.form1.itemName = undefined;
      this.form1.group = undefined;
      this.form1.rule = undefined;
      this.form1.unit = undefined;

      this.allContestItems = [];
      this.allRules = [];
      this.allGroups = [];
      this.units = [];
      if (!value) {
        this.tipVis = false;
        this.tipInfo = "";
        return;
      }
      const defaultParams = {
        pageNum: 1,
        pageSize: 1000,
        competitionId: this.form1.name,
        annualId: this.form1.period,
        status: 2, // 只获取报名中的
      };

      getContestItem(defaultParams)
        .then((res) => {
          this.allContestItems = (res?.rows ?? []).map((v) => ({ ...v, label: v.contestName, value: v.id }));
        })
        .catch((err) => {});

      // 初始化组别 和赛制
      getContestRules(defaultParams)
        .then((res) => {
          l(1, res);
          this.tempRules = (res?.rows ?? []).filter((v) => v.isDelete === 0);
        })
        .catch((err) => {});
      //  获取组别
      getGroups(defaultParams)
        .then((res) => {
          this.tempGroups = (res?.rows ?? []).filter((v) => v.isDelete === 0);
        })
        .catch((err) => {});
    },
    handleItemNameChange(value) {
      this.form1.itemName = value;
      this.form1.group = undefined;
      this.form1.rule = undefined;
      this.form1.unit = undefined;
      this.allGroups = [];
      this.allRules = [];
      this.units = [];
      if (!value) {
        this.tipVis = false;
        this.tipInfo = "";
      }

      const targetContestItem = this.allContestItems.find((v) => v.id === value) ?? {};
      if (targetContestItem?.remark) {
        this.tipVis = true;
        this.tipInfo = targetContestItem?.remark;
      } else {
        this.tipVis = false;
        this.tipInfo = "";
      }
      l("targetContestItem,", targetContestItem);
      const { formatId, groupId } = targetContestItem; // 这是个 id 拼成的字符串

      const rules = this.getIdSFromIdStr(formatId);
      const groups = this.getIdSFromIdStr(groupId);

      this.allRules = this.tempRules.reduce((prev, cur) => {
        if (rules.includes(cur.id)) {
          prev.push({ ...cur, label: cur.formatName, value: cur.id });
        }
        return prev;
      }, []);

      this.allGroups = this.tempGroups.reduce((prev, cur) => {
        if (groups.includes(cur.id)) {
          prev.push({ ...cur, label: cur.groupName, value: cur.id });
        }
        return prev;
      }, []);
    },
    handleRuleChange(v) {
      this.form1.rule = v;
      this.form1.unit = undefined;
      this.units = [];
      this.initUnits();
    },
    handleGroupChange(v) {
      this.form1.group = v;
      this.form1.unit = undefined;
      this.units = [];
      this.initUnits();
    },
    initUnits() {
      if (!this.form1.itemName || !this.form1.group || !this.form1.rule) {
        return;
      }
      const data = {
        contestId: this.form1.itemName,
        groupId: this.form1.group,
        formatId: this.form1.rule,
      };
      getTargetContestItemCsUsers(data).then((res) => {
        const data = res?.rows ?? [];
        this.units = data.map((v) => ({
          label: v.applyUserName ?? "",
          value: v.applyUserId,
        }));
      });
    },
    getIdSFromIdStr(str = "") {
      str = str.endsWith(",") ? str.slice(0, str.length - 1) : str;
      return (str.split(",") ?? []).map((v) => +v);
    },
    checkForm1() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.nextStep(2);

          this.init();
        }
      });
    },

    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const contestItemInfo = this.allContestItems.find((v) => v.id === this.form1.itemName) ?? {}; // 获取当前选择的赛项的信息
          if (this.form.age < contestItemInfo?.ageLimit) {
            // 如果当前的人的年龄比 最小年龄 小,就报错, 这个最小年龄是 市局 创建赛项的时候 配置的
            this.$message.error(`您的年龄不符合本赛项要求,本赛项最小年龄为 ${contestItemInfo?.ageLimit} 岁`);
            return;
          }

          this.nextStep(3);

          const cName = this.allContestNames.find((v) => v.value === this.form1.name)?.label ?? ""; // 赛事
          const period = this.allPeriods.find((v) => v.value === this.form1.period)?.label ?? ""; // 赛届
          const item = this.allContestItems.find((v) => v.value === this.form1.itemName)?.label ?? ""; // 赛项
          const role = this.allRoles.find((v) => v.value === this.form1.role)?.label ?? ""; // 身份
          const group = this.allGroups.find((v) => v.value === this.form1.group)?.label ?? ""; // 组别
          const rule = this.allRules.find((v) => v.value === this.form1.rule)?.label ?? ""; // 赛制

          // 初始化要展示的数据
          this.allData = {
            cName,
            period,
            item,
            role,
            group,
            rule,
            ...this.form,
            sex: this.dicts.sexMap[this.form.sex] ?? "",
            leadName: this.form.ldName,
            leadPhone: this.form.ldPhone,
            academicAdvisorOne: this.form.t1,
            academicAdvisorTwo: this.form.t2,
          };
        }
      });
    },
    submit() {
      const role = this.form1.role;
      const formData = { ...this.form };
      // 这里面都是个人的用户信息
      const personInfo = {
        name: formData.name,
        sex: formData.sex, // 男 1, 女 2
        age: formData.age,
        nation: formData.nation,
        phonenumber: formData.phone?.trim(),
        email: formData.email?.trim(),
        idCard: formData.idNumber?.trim(), //身份证号
        politicsStatus: formData.zzmm?.trim(), // 政治面貌

        // todo 身份证正反面  头像
        occupation: formData.job?.trim(), // 职业
        professionalLevel: formData.jobLevel?.trim(), // 职称
        company: formData.institution?.trim(), //所属单位
        education: formData.edu?.trim(), // 文化程度
        occupationalLevel: formData.jobZige?.trim(), // 资格和等级
        registerAddr: formData.registeredResidence?.trim(), // 户籍所在地
        experience: formData.history?.trim(), // 个人简历
        photoAddr: this.avatarInfo.imgId ?? 0, // 个人头像图片 (如果没图片,就传0, 然后获取到的数据也是0 )
        idCardOne: this.idCardOne.imgId ?? 0, //身份证正面
        idCardTwo: this.idCardTwo.imgId ?? 0, //身份证反面
        academicAdvisorOne: this.form.t1, // 指导教师 1
        academicAdvisorTwo: this.form.t2,
        leadName: this.form.ldName, // 领队姓名
        leadPhone: this.form.ldPhone,
        companyPhone: this.form.institutionPhone, // 单位手机号
      };

      const data = {
        contestId: this.form1.itemName, // 赛项
        // 身份信息
        identity: role === 1 ? 1 : role === 2 ? 6 : undefined,
        userType: 3,
        //
        applyOrgUserId: this.form1.unit, // 所属单位
        groupId: this.form1.group, // 组别
        formatId: this.form1.rule, // 赛制
        // 这里面都是个人的用户信息
        maApplyUserVO: {
          ...personInfo,
          tempUserId: undefined,
          tempName: undefined,
          phone: personInfo.phonenumber,
          userId: formData.tempUserId,
          name: formData.tempName,
        },
      };

      // 1. 先保存用户的信息,
      savePersonalInfo(personInfo)
        .then((res) => {})
        .catch((err) => {});

      // 2. 再发起参赛申请
      addNewApplyForContest(data)
        .then((res) => {
          this.$message.success(`提交成功`);
          this.$router.push("/enrollContest/index");
        })
        .catch((err) => {
          // this.$message.error(`提交失败,请重试`);
        });
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
    init() {
      this.loading = true;
      getCurUserInfo()
        .then((res) => {
          this.loading = false;
          const { data = {} } = res ?? {};
          this.form = {
            hName: data?.name ?? undefined,
            phone: data?.phonenumber ?? undefined,
            sex: data?.sex === 0 ? undefined : data?.sex, // 0 代表没维护
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

            tempUserId: data?.userId ?? undefined,
            tempName: data?.name ?? undefined,

            history: data?.experience, // 个人简历
            t1: data?.academicAdvisorOne ?? undefined, // 指导教师
            t2: data?.academicAdvisorTwo ?? undefined,
            ldName: data?.leadName ?? undefined, // 领队姓名
            ldPhone: data?.leadPhone ?? undefined,
            institutionPhone: data?.companyPhone ?? undefined, // 单位手机号
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
        .catch((err) => {
          this.loading = false;
        });
    },
    avatarSuccessHandle(response, file, fileList) {
      // l("success", response, file, fileList);
      this.avatarInfo.imgUrl = getImgUrl(response?.filePath);
      this.avatarInfo.imgId = response?.id;
    },
    idCard1SuccessHandle(response) {
      this.idCardOne.imgUrl = getImgUrl(response?.filePath);
      this.idCardOne.imgId = response?.id;
      this.$refs.form.validateField("idCardOne", (errorMessage) => {
        return "请上传身份证正面图片";
      });
    },
    idCard2SuccessHandle(response) {
      this.idCardTwo.imgUrl = getImgUrl(response?.filePath);
      this.idCardTwo.imgId = response?.id;
      this.$refs.form.validateField("idCardTwo", (errorMessage) => {
        return "请上传身份证反面图片";
      });
    },
    // 暂时不支持下载图标
    handleImgsDownload(f) {
      const url = "/report/single/file/" + f.fileId;
      download({ url, method: "get", responseType: "blob", headers: { JSESSIONID: getToken() } });
    },
    handleIdCard1Remove() {
      this.idCardOne.imgUrl = "";
      this.idCardOne.imgId = undefined;
    },
    handleIdCard2Remove() {
      this.idCardTwo.imgUrl = "";
      this.idCardTwo.imgId = undefined;
    },
    handleAvatarRemove() {
      this.avatarInfo.imgUrl = "";
      this.avatarInfo.imgId = undefined;
    },
    handlePictureCardPreview(url) {
      this.previewUrl = url;
      this.previewVisible = true;
    },
    resetImgData() {
      this.previewVisible = false;
      this.previewUrl = "";
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
}

.avatar {
  max-width: 100%;
  /* height: 100%; */
  max-height: 100%;
}
.id-card {
  max-width: 100%;
  max-height: 100%;
}

.el-upload-action {
  position: absolute;
  top: 0;
  /* bottom: 0; */
  left: 0;
  display: block;
  width: 148px;
  height: 148px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 148px;
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
    font-size: 16px;
    visibility: hidden;
  }
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
    font-size: 16px;
    visibility: hidden;
  }
}
.preview-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.tip-warn {
  -webkit-transition: all ease-in-out 0.3s;
  -moz-transition: all ease-in-out 0.3s;
  -ms-transition: all ease-in-out 0.3s;
  -o-transition: all ease-in-out 0.3s;
  transition: all ease-in-out 0.3s;
  color: #e6a23c;
  background-color: #fdf6ec;
  border-color: #faecd8;
  padding-left: 5px;
  font-size: 13px;
  margin-top: 5px;
  line-height: 25px;
  border-radius: 5px;
}
</style>
