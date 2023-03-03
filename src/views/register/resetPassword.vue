<template>
  <div class="register-page">
    <div class="reg-container">
      <div class="form-container">
        <div class="title">重置密码</div>
        <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="right" label-width="120px" size="small">
          <!--          </el-form-item>-->
          <el-form-item prop="email" label="邮箱">
            <el-input :value="form.email" @input="handleEmailChange" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <el-form-item prop="password" label="新密码">
            <el-input v-model="form.password" placeholder="请输入新密码密码" show-password></el-input>
          </el-form-item>

          <el-form-item prop="passwordCheck" label="确认密码">
            <el-input v-model="form.passwordCheck" placeholder="请确认密码" show-password></el-input>
          </el-form-item>

          <el-form-item prop="code" label="验证码">
            <el-row>
              <el-col :span="17">
                <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
              </el-col>
              <el-col :span="4" :offset="1">
                <el-button type="primary" class="sendCode" :disabled="disabled" @click="getCode">{{ btnText }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label-width="0">
            <el-button class="login-btn" @click.prevent="goBac" size="mini">返 回 </el-button>
            <el-button class="login-btn" :loading="loading" @click.prevent="handleRegister" size="mini" type="primary">确 定 </el-button>
            <!--            <el-button type="primary"  @click.prevent="handleRegister" size="mini">注 册</el-button>-->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmail, validUsername } from "@/utils/validate";
import { getImgUrl, uuid } from "@/utils";
import { setToken } from "@/utils/auth";
import { checkRegisterCode, getRegisterCode, registerInstitution, resetPaswd } from "@/api/system/user";
import { mapGetters } from "vuex";
import { isMobile } from "@/utils/validate";
import md5 from "js-md5";

export default {
  name: "InstitutionRegister",
  components: {},
  computed: {
    ...mapGetters(["dicts"]),
  },
  // dicts: ["institution_reg_cert_type"],
  data() {
    const validatePwd = (rule, value, callback) => {
      if (!value || !value?.trim()) {
        callback(new Error("请输入密码"));
      }
      if (value.trim().length < 6) {
        callback(new Error("密码不能少于 6 位"));
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!value || !value?.trim()) {
        callback(new Error("请再次输入密码"));
      }
      if (value.trim().length < 6) {
        callback(new Error("密码不能少于 6 位"));
      }
      if (value?.trim() !== this.form.password?.trim()) {
        callback(new Error("两次输入密码的密码必须相同"));
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

    const validIdCard1 = (rule, value, callback) => {
      const v = this.idCardOne.imgId;
      if (!v) {
        callback(new Error("请上传对应的证件照片"));
      } else {
        callback();
      }
    };

    return {
      title: "报名系统",
      previewVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      headers: {
        // Authorization: "Bearer " + getToken(),
      },
      previewUrl: "",
      idCardOne: {
        imgUrl: "",
        imgId: undefined,
      },
      btnText: "获取验证码",
      disabled: false,
      uuid: "",
      timer: null,
      form: {
        certType: undefined, // 证件类型
        certNumber: undefined, // 证件号
        name: undefined, // 单位名称
        phone: undefined,
        email: undefined,
        password: undefined,
        passwordCheck: undefined,
        code: undefined,
      },
      certTypes: [],
      rules: {
        certType: [{ required: true, trigger: "blur", message: "请选择证件类型" }],
        certNumber: [{ required: true, trigger: "blur", message: "请输入证件号" }],
        name: [{ required: true, trigger: "blur", message: "请输入单位名称" }],
        phone: [{ required: true, trigger: "blur", message: "请输入手机号" }],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],

        email: [{ required: true, trigger: "change", validator: validateEmail }],
        password: [{ required: true, trigger: "blur", message: "请输入密码", validator: validatePwd }],
        passwordCheck: [{ required: true, trigger: "change", validator: validatePassword }],
        idCardOne: [{ required: true, trigger: "blur", validator: validIdCard1 }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.push("/login");
    },
    handleEmailChange(v) {
      this.form.email = v;
      this.form.code = undefined;
    },
    getCode() {
      this.$refs.form.validateField("email", (errorMessage) => {
        return "请输入正确的邮箱";
      });
      if (!isEmail(this.form.email)) {
        return;
      }
      const data = {
        "email": this.form.email,
        type: 2, // 找回密码传 1
      };
      getRegisterCode(data)
        .then((res) => {
          l(res);
          this.disabled = true;
          this.uuid = res?.uuid;
          this.btnText = 60;
          this.timer = setInterval(() => {
            if (this.btnText > 1) {
              this.btnText -= 1;
            } else {
              this.btnText = "获取验证码";
              this.disabled = false;
              clearInterval(this.timer);
            }
          }, 1000);
          this.$message.success(`验证码已发送到邮箱`);
        })
        .catch((err) => {
          // this.$message.error(`验证码发送失败,请重试`);
        });
    },
    goBac() {
      this.$router.push("/login");
    },
    handleRegister() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { email, password } = this.form;

          const data = {
            email,
            newPassword: md5(password.trim()),
            uuid: this.uuid,
            code: this.form.code,
          };
          l("data", data);
          resetPaswd(data)
            .then((res) => {
              l(23, res);
              this.$message.success(`重置密码成功`);
              sessionStorage.setItem("tempUsername", this.form.email);
              this.$router.push("/login");
            })
            .catch((err) => {
              // this.$message.error(`注册失败,请重试`);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$cursor: #fff;
$dark_gray: #889aa4;

//color: $cursor;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .reg-container .el-input input {
  }
}

.register-page {
  text-align: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("../../assets/images/login-background.png");
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: center;

  .reg-container {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    /*min-height: 100%;*/
    /*background-color: #efefef69;*/
    width: 100%;
    overflow: auto;
    background-size: cover;
    background-repeat: no-repeat;
    background-position-y: center;

    .form-container {
      width: 545px;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      align-self: center;
      background-color: white;
      padding: 30px 40px 10px 20px;
      .title {
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: bold;
      }
    }

    .el-form-item {
      .el-upload {
        width: 100%;
        height: 150px;
        .el-upload-dragger {
          width: 300px;
          height: 150px;
          .el-upload__text {
            font-size: 13px;
          }
          .el-icon-upload {
            margin-top: 25px;
            margin-bottom: 0px;
            font-size: 40px;
          }
        }
      }
    }
  }

  .bottom-info {
    height: 7%;
    max-height: 70px;
    min-height: 40px;
    width: 100%;
    display: flex;
    justify-content: center;

    .info {
      align-self: flex-start;
      color: #bbbbbc;
      font-size: 12px;
      line-height: 19px;
      margin-top: 10px;
    }
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
  line-height: 150px;
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
.id-card {
  max-width: 100%;
  max-height: 100%;
}
.preview-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}
.sendCode {
  width: 90px;
}
.form-item-card {
  .el-form-item__content > div {
    height: 150px;
  }
}
</style>
