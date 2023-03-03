<template>
  <div class="personInfo">
    <el-form ref="form" :model="form" :rules="rules" label-width="115px" label-position="right" class="personForm" size="small" v-loading="loading">
      <!--      {{ activeStus }}-->

      <el-tag v-for="tag in activeStus" :key="tag.id" :class="{ active: activeTag.id === tag.id }" closable type="info" @close="handleClose(...arguments, tag)">
        {{ tag.label }}
        {{ tag.id }}
      </el-tag>

      <el-form-item prop="registeredResidence" label="户籍所在地">
        <el-input v-model="form.registeredResidence" placeholder="请输入户籍所在地" maxlength="100" clearable />
      </el-form-item>
      <el-form-item prop="history" label="个人简历">
        <el-input v-model="form.history" placeholder="请输入个人简历" :rows="5" type="textarea" maxlength="1000"></el-input>
      </el-form-item>

      <el-row type="flex" justify="end">
        <el-form-item>
          <el-button type="primary" @click="save">保存 </el-button>
        </el-form-item>
      </el-row>
    </el-form>

    {{ activeStus }}

    <!--  图片预览  -->
    <el-dialog title="图片预览" width="800px" :visible.sync="previewVisible" append-to-body :before-close="resetImgData">
      <img :src="previewUrl" class="preview-img" alt="图片预览" />
    </el-dialog>
  </div>
</template>

<script>
import { getCurUserInfo, getPersionalInfo, savePersonalInfo, savePersonInfo } from "@/api/user";
import { mapGetters } from "vuex";
import { isMobile } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import { getFileInfoById } from "@/api/contestManage";

export default {
  name: "PersonEdit",
  components: {
    // AddOrUpdate,
  },

  created() {
    this.init();
  },
  data() {
    return {
      activeTag: {
        id: "7",
      },
      previewVisible: false,
      // 上传文件 时需要的header
      headers: {
        // Authorization: "Bearer " + getToken(),
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      // 头像照片信息
      avatarInfo: {
        imgUrl: "",
        imgId: undefined,
      },
      previewUrl: "",
      form: {
        name: "", //
        sex: undefined,
        pic1: undefined, // 头像照片
        age: undefined, //
        nation: undefined, // 民族
        phone: undefined, //
        idNumber: undefined, // 身份证号
        zzmm: undefined, // 政治面貌
        //todo  图片显示

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
        institutionPhone: undefined,
        ldName: undefined, // 领队姓名
        ldPhone: undefined,
        t1: undefined, // 教师 1
        t2: undefined,
        registeredResidence: undefined, // 户籍所在地
        history: undefined, // 个人简历
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
        name: [{ required: false, trigger: "blur", message: "请输入姓名" }],
        sex: [{ required: false, trigger: "change", message: "请选择性别" }],
        age: [{ required: true, trigger: "change", message: "请输入年龄" }],
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["dicts"]),
    ...mapGetters(["sidebarRouters", "activeMenu", "activeStus", "sidebar"]),
  },
  methods: {
    handleClose(a, item) {
      if (this.sidebarRouters.length <= 1) {
        return;
      }
      item.checked = false;
      // console.log(25345, a, b, c);
      this.$store.dispatch("ChangeActiveStus", {
        item: item,
      });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const formData = { ...this.form };
          const data = {
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
          savePersonalInfo(data)
            .then((res) => {
              this.$message.success("保存成功");
              this.init();
            })
            .catch((err) => {
              // this.$message.error("保存失败,请重试");
              this.init();
            });
        }
      });
    },
    init() {
      this.loading = true;
      getCurUserInfo()
        .then((res) => {
          l(4444, res);
          this.loading = false;
          const { data = {} } = res ?? {};
          this.form = {
            name: data?.name ?? undefined,
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
.personInfo {
  max-width: 80%;
  width: 800px;
  margin: 0 auto;
  .personForm {
    width: 100%;
    padding: 20px;
  }
}
.preview-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}
.separator {
  width: 100%;
  height: 1px;
  background-color: #80808047;
  margin: 20px 0;
}
.userAvatar {
  ::v-deep {
    .el-upload--picture-card {
      height: 120px;
      width: 120px;
      line-height: 128px;
      .el-upload__text {
        line-height: 1.2;
        font-size: 12px;
        color: #646262e3;
        text-align: left;
        position: absolute;
        top: 130px;
        width: 120px;
      }
    }
  }
}

.avatar {
  max-width: 118px;
  /* height: 100%; */
  max-height: 118px;
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
  width: 120px;
  height: 120px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 120px;
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

.card-uploader {
}

.el-tag + .el-tag {
  margin-left: 8px;
}
</style>
