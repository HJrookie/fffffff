<template>
  <div class="register-page">
    <div class="login-container">
      <div class="form-container">
        <div class="title">个人注册</div>
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px" size="small">
          <el-form-item label="身份证正反面" required style="line-height: 197px; margin-bottom: 0px">
            <el-row :gutter="10" type="flex">
              <el-col :span="12">
                <el-form-item prop="idCardOne" label="" class="form-item-certs">
                  <el-upload :action="uploadUrl" :headers="headers" drag :on-success="idCard1SuccessHandle" :show-file-list="false" accept="image/*">
                    <template v-if="idCardOne.imgUrl">
                      <img class="el-upload-list__item-thumbnail id-card" :src="idCardOne.imgUrl" alt="身份证正面图" />
                      <span class="upload-acton-idcard">
                        <i class="el-icon-zoom-in" style="margin-right: 10px" @click.stop="handlePictureCardPreview(idCardOne.imgUrl)"></i>
                        <i class="el-icon-delete" @click.stop="handleIdCard1Remove()"></i>
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
                <el-form-item prop="idCardTwo" label="" class="form-item-certs" style="">
                  <el-upload :action="uploadUrl" :headers="headers" drag :on-success="idCard2SuccessHandle" :show-file-list="false" accept="image/*">
                    <template v-if="idCardTwo.imgUrl">
                      <img class="id-card" :src="idCardTwo.imgUrl" alt="身份证反面图" />
                      <span class="upload-acton-idcard">
                        <i class="el-icon-zoom-in" style="margin-right: 10px" @click.stop="handlePictureCardPreview(idCardTwo.imgUrl)"></i>
                        <i class="el-icon-delete" @click.stop="handleIdCard2Remove()"></i>
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
          </el-form-item>

          <el-form-item prop="certNumber" label="身份证号">
            <el-input v-model="form.certNumber" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="姓名">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <!--          <el-form-item prop="phone" label="手机号">-->
          <!--            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item prop="email" label="邮箱">
            <span slot="label">
              <el-tooltip content="邮箱会用来接收验证码,并作为登录时的账号" placement="top">
                <i class="el-icon-question"></i>
                <!--                question-yellow.svg-->
                <!--                <svg-icon icon-class="question"></svg-icon>-->
              </el-tooltip>
              邮箱
            </span>
            <el-input :value="form.email" @input="handleEmailChange" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>

          <el-form-item prop="passwordCheck" label="确认密码">
            <el-input v-model="form.passwordCheck" placeholder="请确认密码" show-password></el-input>
          </el-form-item>

          <el-form-item prop="code" label="验证码">
            <el-row>
              <el-col :span="18">
                <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-button type="primary" class="sendCode" :disabled="disabled" @click="getCode">{{ btnText }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label-width="0">
            <el-button class="login-btn" @click.prevent="goBack" size="mini">返 回 </el-button>
            <el-button type="primary" :loading="loading" @click.prevent="handleRegister" size="mini">注 册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--  图片预览  -->
    <el-dialog title="图片预览" width="800px" :visible.sync="previewVisible" append-to-body :before-close="resetImgData">
      <img :src="previewUrl" class="preview-img" alt="图片预览" />
    </el-dialog>
  </div>
</template>

<script>
import { isEmail, validUsername } from "@/utils/validate";
import { uuid } from "@/utils";
import { setToken } from "@/utils/auth";
import { isMobile } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import md5 from "js-md5";
import { checkRegisterCode, getRegisterCode, registerPerson } from "@/api/system/user";
export default {
  name: "InstitutionRegister",
  components: {},
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

    const validPhone = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };

    const validIdCard = (rule, value, callback) => {
      l(value);
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

    const validIdCard2 = (rule, value, callback) => {
      const v = this.idCardTwo.imgId;
      if (!v) {
        callback(new Error("请上传身份证反面图片"));
      } else {
        callback();
      }
    };

    return {
      title: "报名系统",
      previewVisible: false,
      // 上传文件 时需要的header
      headers: {
        // Authorization: "Bearer " + getToken(),
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/file/pool",
      previewUrl: "",
      idCardOne: {
        imgUrl: "",
        imgId: undefined,
      },
      idCardTwo: {
        imgUrl: "",
        imgId: undefined,
      },
      form: {
        certNumber: undefined, // 身份证号
        name: undefined, // 姓名
        phone: undefined,
        email: undefined,
        password: undefined,
        passwordCheck: undefined,
        code: undefined,
      },
      btnText: "获取验证码",
      disabled: false,
      uuid: "",
      timer: null,
      rules: {
        certNumber: [{ required: true, trigger: "change", validator: validIdCard }],
        name: [{ required: true, trigger: "change", message: "请输入姓名" }],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
        phone: [{ required: true, trigger: "change", validator: validPhone }],
        email: [{ required: true, trigger: "change", validator: validateEmail }],
        password: [{ required: true, trigger: "change", message: "请输入密码", validator: validatePwd }],
        passwordCheck: [{ required: true, trigger: "change", validator: validatePassword }],
        idCardOne: [{ required: true, trigger: "blur", message: "请上传身份证正面", validator: validIdCard1 }],
        idCardTwo: [{ required: true, trigger: "blur", message: "请上传身份证反面", validator: validIdCard2 }],
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
  computed: {},
  mounted() {},
  methods: {
    // 个人注册
    goBack() {
      this.$router.push("/login");
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
        type: 1, // 注册传 1
      };

      getRegisterCode(data)
        .then((res) => {
          l(res);
          this.uuid = res?.uuid;
          this.btnText = 60;
          this.disabled = true;
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
    handleRegister() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // //  先校验验证码
          // const codedata = {
          //   uuid: this.uuid,
          //   code: this.form.code,
          // };
          // checkRegisterCode(codedata)
          //   .then((res) => {
          //     // 验证码校验成功
          //     const formData = { ...this.form };
          //     const { name, phone: phonenumber, email, password, certNumber: idCard } = formData;
          //
          //   })
          //   .catch((err) => {
          //     // this.$message.error(`验证码校验失败,请重试`);
          //   });
          const formData = { ...this.form };
          const { name, phone: phonenumber, email, password, certNumber: idCard } = formData;

          const data = {
            name,
            // phonenumber,
            email,
            password: md5(password.trim()),
            cardType: 1, // 个人只能上传身份证,因此是 1.后端要求添加的
            idCard,
            idCardOne: this.idCardOne.imgId,
            idCardTwo: this.idCardTwo.imgId,

            uuid: this.uuid,
            code: this.form.code,
          };
          // l("data", data);
          registerPerson(data)
            .then((res) => {
              l(23, res);
              this.$message.success(`注册成功`);
              // 存储用户名密码
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
    handleEmailChange(v) {
      this.form.email = v;
      this.form.code = undefined;
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
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
    handlePictureCardPreview(url) {
      this.previewUrl = url;
      this.previewVisible = true;
    },
    handleIdCard1Remove() {
      this.idCardOne.imgUrl = "";
      this.idCardOne.imgId = undefined;
    },
    handleIdCard2Remove() {
      this.idCardTwo.imgUrl = "";
      this.idCardTwo.imgId = undefined;
    },
    resetImgData() {
      this.previewVisible = false;
      this.previewUrl = "";
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$cursor: #fff;
$dark_gray: #889aa4;

// color: $cursor;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
  }
}

.register-page {
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-image: url("../../assets/images/login-background.png");
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: center;
  display: flex;
  flex-direction: column;
  text-align: center;

  .login-container {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    /*min-height: 100%;*/
    /*background-color: #efefef69;*/
    width: 100%;
    overflow: auto;

    .form-container {
      width: 650px;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      align-self: center;
      background-color: white;
      padding: 20px 20px 5px;
      .title {
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: bold;
      }

      .el-form {
        .el-form-item {
          .el-upload {
            width: 100%;
            .el-upload-dragger {
              width: 240px;
              height: 120px;
              .el-upload__text {
                font-size: 13px;
              }
              .el-icon-upload {
                margin-top: 13px;
                margin-bottom: 0px;
                font-size: 40px;
              }
            }
          }
        }
      }
    }
  }
}

.form-item-certs {
  width: 240px;
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
.sendCode {
  width: 100px;
}
</style>
