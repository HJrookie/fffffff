<template>
  <div class="left">
    <div class="userInfo">
      <div class="info">admin</div>
      <!--      <div class="out">out</div>-->
    </div>

    <div class="search">
      <el-form ref="form" :model="form" size="small">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入学生姓名" clearable>
            <el-button slot="append" icon="el-icon-search" @click="ssearch()"></el-button>
          </el-input>
        </el-form-item>

        <!--        <el-form-item>-->
        <!--          <el-button class="add" @click="addNew">Click</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>

    <!--    default-active="1-1"-->

    <!--    <el-menu class="el-menu-vertical-demo" @select="hsele" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">-->
    <!--      <el-submenu index="0">-->
    <!--        <template slot="title">-->
    <!--          <i class="el-icon-location"></i>-->
    <!--          <span>学员管理</span>-->
    <!--        </template>-->
    <!--        <el-menu-item-group>-->
    <!--          <el-menu-item index="0-1">学员管理</el-menu-item>-->
    <!--        </el-menu-item-group>-->
    <!--      </el-submenu>-->
    <!--      <el-submenu index="1">-->
    <!--        <template slot="title">-->
    <!--          <i class="el-icon-location"></i>-->
    <!--          <span>任务管理</span>-->
    <!--        </template>-->
    <!--        <el-menu-item-group>-->
    <!--          <el-menu-item index="1-1">发布管理</el-menu-item>-->
    <!--          <el-menu-item index="1-2">任务库</el-menu-item>-->
    <!--        </el-menu-item-group>-->
    <!--      </el-submenu>-->
    <!--    </el-menu>-->

    <div class="title-container">
      <div :class="{ title: true, 't1': true, 'act': act === 0 }" @click="setact(0)">学员管理</div>

      <template v-if="!menuData.length">
        <div class="empty">暂无数据</div>
      </template>

      <div class="wrapp" v-else>
        <el-collapse :value="activeMenu.id" @change="handleChange" class="_col" accordion>
          <el-collapse-item v-for="(menu, i) in menuData" :title="menu.label" :name="menu.id" :key="menu.id">
            <div class="sub">{{ menu.label }}</div>
            <div v-for="(item, i) in menu.children" :key="item.id">
              <el-checkbox :value="item.checked" @change="handlecccc(...arguments, menu, item)">{{ item.label }} </el-checkbox>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="title">任务管理</div>
      <div :class="{ 'sub-title': true, 'act': act === 1 }" @click="setact(1)">发布管理</div>
      <div :class="{ 'sub-title': true, 'act': act === 2 }" @click="setact(2)">任务库</div>
    </div>

    <add-or-update @refreshDataList="query" ref="ddddddd"></add-or-update>
  </div>
</template>

<script>
import { getCurUserInfo, getPersionalInfo, savePersonalInfo, savePersonInfo, searchStus } from "@/api/user";
import { mapGetters } from "vuex";
import { isMobile } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import { getFileInfoById } from "@/api/contestManage";
import AddOrUpdate from "./add-or-update.vue";

export default {
  name: "Left",
  components: {
    AddOrUpdate,
  },
  props: {
    // menuData: {
    //   type: Array,
    //   default: [],
    // },
  },
  created() {
    // this.init();
  },
  data() {
    l(this.$route);
    let fullpath = this.$route.path;
    let o = {
      "/home": 0,
      "/fabus": 1,
      "/taskLib": 2,
    };
    let act = o[fullpath] ?? "";
    return {
      act: act,
      loading: false,
      info: null,
      // activeMenu: '',
      form: {
        name: "",
      },
    };
  },
  computed: {
    ...mapGetters(["menuData", "activeMenu"]),
    // ...mapGetters(["sidebarRouters", "activeMenu", "activeStus", "sidebar"]),
  },
  methods: {
    hsele(index, indexpath) {
      l(4343, index, indexpath);
      if (index === "1-1") {
        this.$router.push("/fabus");
      } else if (index === "1-2") {
        this.$router.push("/taskLib");
      } else if (index === "0-1") {
        this.$router.push("/home");
      }
    },
    ssearch() {
      const data = {
        user_name: this.form.name.trim(),
      };
      this.$store.dispatch("app/initMenus", data);
    },
    handleChange(val) {
      l(val);
      if (!val) {
        return;
      }
    },
    handlecccc(v, a, menu, item) {
      console.log("handlecccc", v, menu, item);
      // item.checked = v;
      // this.$store.dispatch("ChangeActiveStus", {
      //   item: item,
      // });
      // this.$emit('setStus', {menu, item, targetStatus: v})
      this.$store.dispatch("app/updateMenuData", { menu, item, targetStatus: v });
    },
    handleClose(a, item) {
      if (this.sidebarRouters.length <= 1) {
        return;
      }
      item.checked = false;
      this.$store.dispatch("ChangeActiveStus", {
        item: item,
      });
    },
    addNew(rowInfo) {
      this.$nextTick(() => {
        this.$refs.ddddddd.init();
      });
    },
    query() {},
    setact(v) {
      this.act = v;
      if (v === 0) {
        this.$router.push("/home");
      } else if (v === 1) {
        this.$router.push("/fabus");
      } else if (v === 2) {
        this.$router.push("/taskLib");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  background: gray;
  position: fixed;
  height: 100%;
  width: 300px;

  .userInfo {
    color: white;
    padding: 20px;
    background: gray;
    //   width: 300px;
    height: 120px;
    text-align: center;
    font-size: 12px;

    .info {
      line-height: 80px;
    }

    .out {
      text-align: right;
      cursor: pointer;
    }
  }

  .search {
    padding: 10px;

    .add {
      width: 100%;
    }
  }

  .wrapp {
    padding: 0 15px;
  }

  .el-collapse {
    &._col ::v-deep {
      .el-collapse-item__wrap {
        padding-left: 20px;
      }

      .el-collapse-item__header {
        padding-left: 20px;
      }
    }
  }

  .sub {
    font-weight: bold;
    font-size: 14px;
  }

  .empty {
    height: 80px;
    text-align: center;
    line-height: 80px;
  }
}

.title-container {
  color: white;
  width: 100%;

  .title {
    margin-left: 20px;
    font-size: 21px;
    width: 100%;
    margin-top: 12px;
    transition: all ease-in-out 0.5s;
    margin-bottom: 12px;

    &.t1 {
      cursor: pointer;

      &:hover {
        color: #c7c7c7;
      }
    }

    &.act {
      color: #2196f3;
    }
  }

  .sub-title {
    padding-left: 40px;
    font-size: 16px;
    width: 100%;
    margin-top: 14px;
    cursor: pointer;
    transition: all ease-in-out 0.5s;

    &:hover {
      color: #c7c7c7;
    }

    &.act {
      color: #2196f3;
    }
  }
}
</style>
