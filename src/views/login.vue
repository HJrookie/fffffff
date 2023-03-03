<template>
  <div class="login-page">
    <div class="container">
      <div class="left-img">
        <div class="titles">
          <div class="title">Welcome!</div>
          <div class="subTitle"></div>
        </div>
      </div>
      <div class="right-form">
        <div class="logo">
          <!--          <img src="../assets/images/logo.png" width="300" />-->
        </div>

        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="form" hide-required-asterisk>
          <el-form-item prop="username">
            <!--            <span slot="label"><i class="el-icon-user"></i></span>-->
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" tabindex="1" autocomplete="off">
              <i class="el-icon-user" slot="prefix"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!--            <span slot="label">-->
            <!--              <svg-icon icon-class="password" />-->
            <!--            </span>-->

            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" show-password autocomplete="off" @keyup.enter.native="handleLogin">
              <svg-icon icon-class="password" slot="prefix" />
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="btn-login" type="primary" @click="handleLogin" :disabled="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import md5 from "js-md5";
import { setToken } from "@/utils/auth";
import moment from "moment";
import { isMob } from "@/utils";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      title: "报名系统",
      codeUrl: "",
      loginForm: {
        username: "",
        password: "", //
        uuid: "",
        code: "",
      },
      passwordType: "password",
      loading: false,
      redirect: undefined,
      otherQuery: {},
      ruleForm: {
        name: "",
        password: "",
        code: "",
      },
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "change" }],
      },
    };
  },
  watch: {},
  created() {
    const name = sessionStorage.getItem("tempUsername");
    if (name) {
      this.loginForm.username = name;
    }
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      if (this.loading) {
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            // ...this.loginForm,
            // password: md5(this.loginForm.password.trim()),
            user_name: this.loginForm.username,
            password: this.loginForm.password,
          };

          // todo
          console.log("ddddddddddd", data);
          // this.$store
          //   .dispatch("Login", data)
          //   .then((res) => {
          //     this.loading = false;
          //     console.log("info", res);
          //     if (res.status === 501) {
          //       return this.$message.error("账号或密码错误");
          //     }
          //     let result = res.result;
          //     if (!result.role) {
          //       return this.$message.error("账号或密码错误");
          //     }
          //     if (result.role === "admin") {
          //       localStorage.setItem("role", "admin");
          //       let { dept_id = [], dept_name = [] } = result;
          //       localStorage.setItem("dep", JSON.stringify({ dept_id, dept_name }));
          //
          //       // 和今天不一样 就更新
          //       let date = JSON.parse(localStorage.getItem("task_no") ?? "{}")?.date ?? "";
          //       l("ddddddddd", date === moment().format(`YYYY-MM-DD`));
          //       if (date !== moment().format(`YYYY-MM-DD`)) {
          //         localStorage.setItem(
          //           "task_no",
          //           JSON.stringify({
          //             date: moment().format(`YYYY-MM-DD`),
          //             v: 1,
          //           })
          //         );
          //       }
          //       if (isMob()) {
          //         this.$router.push({ path: "/teacher" }).catch(() => {});
          //       } else {
          //         this.$router.push({ path: "/teacher" }).catch(() => {});
          //       }
          //     } else {
          //       localStorage.setItem("role", "stu");
          //       localStorage.setItem("stuInfo", JSON.stringify({ ...result }));
          //
          //       this.$store
          //         .dispatch("app/initStuInfo", {
          //           userid: result.userid,
          //         })
          //         .then((res) => {
          //           this.$router.push({ path: "/student" }).catch(() => {});
          //         });
          //     }
          //   })
          //   .catch((err) => {
          //     this.loading = false;
          //   });
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  overflow: auto;
  position: relative;
}

.container {
  width: 900px;
  height: 555px;
  display: flex;
  background-color: white;
  border-radius: 25px;

  align-self: center;

  .left-img {
    width: 53%;
    height: 100%;
    background-image: url("../assets/images/login-left.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    .titles {
      position: relative;
      top: 55px;
      left: 50px;
      color: white;

      .title {
        font-size: 36px;
        font-weight: 500;
        letter-spacing: 1.1px;
      }

      .subTitle {
        margin-top: 15px;
        font-size: 17px;
        letter-spacing: 1px;
      }
    }
  }

  .svg-container {
    padding: 2px 5px 2px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .right-form {
    width: 47%;
    height: 100%;
    background-color: white;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
      margin-bottom: 25px;
    }

    .form {
      width: 300px;

      .mb15 {
        margin-bottom: 13px;
      }

      .forgetPwd {
        color: #c1c1c1;
        -webkit-transition: all 0.3s ease-in-out;
        -moz-transition: all 0.3s ease-in-out;
        -ms-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;

        &:hover {
          color: #a4a4a4;
        }
      }

      .rightBtns button {
        color: #0575e6;

        &:hover {
          color: #2c95ffd9;
        }
      }

      ::v-deep .el-input .el-input__prefix {
        left: 8px;
      }

      .login-code-img {
        cursor: pointer;
        height: 36px;
      }
    }
  }
}

.btn-login {
  width: 100%;
  border-radius: 20px;
  padding: 12px 20px;
  background-color: #0475e6;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  /*color: white;*/
  &.is-disabled {
    background-color: #8cc8ff;
  }

  &:hover {
    background: #46a6ff;
    border-color: #46a6ff;
  }
}

.notify-card {
  position: absolute;
  top: 7%;
  right: 7%;
  cursor: pointer;
  -webkit-transition: all ease-in-out 0.3s;
  -moz-transition: all ease-in-out 0.3s;
  -ms-transition: all ease-in-out 0.3s;
  -o-transition: all ease-in-out 0.3s;
  transition: all ease-in-out 0.3s;
  border-radius: 10px;

  &:hover {
    opacity: 0.8;
    background-color: #ffffffed;
  }

  ::v-deep .el-card__body {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .container {
    background: none;
    .left-img {
      display: none;
    }
    .right-form {
      background: none;
      width: 100%;
    }
  }
}
</style>
