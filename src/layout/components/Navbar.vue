<template>
  <div class="navbar">
<!--    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->

    <!--    <breadcrumb-->
    <!--      id="breadcrumb-container"-->
    <!--      class="breadcrumb-container"-->
    <!--      v-if="!topNav"-->
    <!--    />-->
<!--    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />-->

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper" @click="">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
<!--            <el-dropdown-item>个人中心</el-dropdown-item>-->
          </router-link>
          <!--          <el-dropdown-item @click.native="setting = true">-->
          <!--            <span>布局设置</span>-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--    <el-popover placement="bottom" title="通知信息" width="300" trigger="click">-->
    <!--      <template>-->
    <!--        <el-collapse v-model="activeNames" class="nav-notice" @click.native="handleDownload">-->
    <!--          <el-collapse-item v-for="(item, i) in tableData" :title="item.noticeTitle" :name="i">-->
    <!--            <div>{{ item.noticeText }}</div>-->
    <!--            <div v-if="item.fileName" class="file" :data-path="item.filePath" :data-name="item.fileName">附件: {{ item.fileName }}</div>-->
    <!--          </el-collapse-item>-->
    <!--        </el-collapse>-->
    <!--      </template>-->
    <!--      <div class="info-msg" slot="reference">-->
    <!--        <el-badge :value="value" class="item">-->
    <!--          &lt;!&ndash;        <el-button class="share-button" icon="el-icon-share" type="primary"></el-button>&ndash;&gt;-->
    <!--          <i class="el-icon-bell" />-->
    <!--        </el-badge>-->
    <!--      </div>-->
    <!--    </el-popover>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb";
// import TopNav from "@/components/TopNav";
// import Hamburger from "@/components/Hamburger";
// import Screenfull from "@/components/Screenfull";
// import SizeSelect from "@/components/SizeSelect";
// import Search from "@/components/HeaderSearch";
// import RuoYiGit from "@/components/RuoYi/Git";
// import RuoYiDoc from "@/components/RuoYi/Doc";
import { getNotices } from "@/api/institutionManage";
import { downloadFile } from "@/utils/request";
import { getToken } from "@/utils/auth";

export default {
  components: {
    // Breadcrumb,
    // TopNav,
    // Hamburger,
    // Screenfull,
    // SizeSelect,
    // Search,
    // RuoYiGit,
    // RuoYiDoc,
  },
  data() {
    return {
      value: undefined,
      activeNames: ["0"],
      avatar: require('@/assets/images/avator.svg')
    };
  },
  created() {},
  computed: {
    // ...mapGetters(["sidebar", "avatar", "device"]),
    ...mapGetters(["sidebar", "device"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    handleDownload(e) {
      let { path: url = "", name } = e?.target?.dataset ?? {};
      if (!url) {
        return;
      }
      url = window.location.origin + url.slice(url.indexOf("/file"));
      downloadFile({ url, method: "get", responseType: "blob", headers: { Authorization: "Bearer " + getToken() } }, name).catch((err) => {});
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.removeItem("tempUsername");
          this.$store.dispatch("LogOut").then(() => {
            // location.href = "/index";
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`).catch(() => {});
            this.$router.push(`/login`).catch(() => {});
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .info-msg {
    line-height: 46px;
    height: 100%;
    font-size: 24px;
    float: right;
    margin-right: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s;
    padding: 9px 6px 0;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    ::v-deep {
      .el-badge__content.is-fixed {
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        -webkit-transform: translateY(0%) translateX(100%);
        -moz-transform: translateY(0%) translateX(100%);
        -ms-transform: translateY(0%) translateX(100%);
        -o-transform: translateY(0%) translateX(100%);
        transform: translateY(0%) translateX(100%);
      }
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        /*margin-top: 5px;*/
        padding-top: 9px;
        position: relative;
        height: 100%;

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -18px;
          top: 30px;
          font-size: 12px;
        }
      }
    }
  }
}
.el-collapse.nav-notice {
  .file {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
