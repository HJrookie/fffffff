<template>
  <div class="student">
    <div class="tabs">
      <div :class="{ active: activeTab === '1' }" @click="setA('1')">首页</div>
      <div :class="{ active: activeTab === '2' }" @click="setA('2')">任务</div>
      <div :class="{ active: activeTab === '3' }" @click="setA('3')">我</div>
    </div>


    <template v-if="activeTab === '1'">
      <stu-shouye></stu-shouye>
    </template>
    <template v-if="activeTab === '2'">
      <stu-tasks></stu-tasks>
    </template>
    <template v-if="activeTab === '3'">
      <stu-info></stu-info>
    </template>
  </div>
</template>

<script>
import {getCurUserInfo, getPersionalInfo, getUserDetail, savePersonalInfo, savePersonInfo} from "@/api/user";
import {mapGetters} from "vuex";
import {isMobile} from "@/utils/validate";
import {getToken} from "@/utils/auth";
import {getImgUrl} from "@/utils";
import {getFileInfoById} from "@/api/contestManage";
import StuShouye from "./shouye/index.vue";
import StuTasks from "./stuTasks/index.vue";
import StuInfo from "./my/index";
// import Right from "./right.vue";
// import Right from "./right.vue";
import _ from "lodash";

export default {
  name: "StudentIndex",
  components: {
    // Left,
    // Right,
    StuShouye,
    StuTasks,
    StuInfo,
  },
  data() {
    return {
      activeTab: "1", //
      loading: false,
    };
  },
  mounted() {
    getUserDetail({
      userid: localStorage.getItem("userid"),
    }).then((res) => {
      l(9999, res);
      let data = res?.result?.result?.[0] ?? {};
      this.$store.dispatch("app/initStuInfo", data);
    });
  },
  computed: {},
  methods: {
    setA(v) {
      this.activeTab = v;
    },
  },
};
</script>

<style lang="scss" scoped>
.student {
  display: flex;
  max-width: 600px;
  height: 100%;
  margin: 0 auto;

  .tabs {
    z-index: 20;
    width: 600px;
    height: 48px;
    position: absolute;
    background: whitesmoke;
    bottom: 0;
    left: 50%;
    display: flex;
    line-height: 48px;
    text-align: center;
    border: 1px solid black;
    transform: translateX(-50%);
    border-bottom: none;
    transition: all ease-in-out 0.5s;

    div {
      width: 33%;
      cursor: pointer;

      &.active {
        font-weight: bold;
      }
    }
  }


}

@media screen and (max-width: 766px) {
  .student {
    max-width: 100%;
    .tabs{
      width: 100%;
      max-width: unset;
    }
  }


}

</style>
