<template>
  <div class="shouye">
    <transition>
      <div v-if="msgShow" class="top">
        {{ msg.name }}提交了任务,完成度{{ msg.wancehgnduA }}/{{ msg.wanchengdub }}
        <span class="errorIcon" @click="msgShow = false"><i class="el-icon-error"></i> </span>
      </div>
    </transition>

    <div class="btns">
      <el-button size="mini" v-for="(v, i) of btns" @click="goto(v.value)">{{ v.lable }}</el-button>

<!--      <el-button size="mini" @click="goto('1')">打字</el-button>-->
<!--      <el-button size="mini" @click="goto('2')">单词</el-button>-->
<!--      <el-button size="mini" @click="goto('3')">日报</el-button>-->

<!--      <el-button size="mini" @click="goto('4')">项目</el-button>-->
<!--      <el-button size="mini" @click="goto('5')">考试</el-button>-->
<!--      <el-button size="mini" @click="goto('6')">课堂任务</el-button>-->
    </div>

    <div class="userinfos">
      <div class="info" v-for="(item, i) of data">
        <div class="namec">
          <div class="yuan">
            <img :src="item.acator" />
          </div>
          <div class="name">{{ item.user_name }}</div>
        </div>
        <div class="renwu">任务完成: {{ item.percentage_complete }}</div>
        <div class="imgs">
          <div class="taskImg" v-for="(t, iii) of item.task_content">
            <img v-if="t.task_type === 'image'" :src="t.content" @click="getDetail(t)" />
            <div v-else class="txt">{{ t.content }}</div>
          </div>
        </div>
        <div class="zongjie">今日总结: {{ item.summary }}</div>
        <div class="humans">
          <div class="abcd">
            <div class="yuan" v-for="(h, ii) of item.like_avatars">{{ h }}</div>
          </div>
          <div class="count">
            <div class="pinglun">评论:{{ item.comments }}</div>
            <div class="zan">点赞:{{ item.like }}</div>
          </div>
        </div>
      </div>
    </div>
    <detail ref="detailref"> </detail>
  </div>
</template>

<script>
import { getCurUserInfo, getMobTaskList, getPersionalInfo, savePersonalInfo, savePersonInfo } from "@/api/user";
import { mapGetters } from "vuex";
import { isMob } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import { getFileInfoById } from "@/api/contestManage";
// import Left from "./left.vue";
// import Right from "./right.vue";
import _ from "lodash";
import Detail from "./taskDetail";

export default {
  name: "StuShouye",
  components: {
    // Left,
    Detail,
  },
  data() {
    let btns = [];
    if (isMob()) {
      btns = [
        { lable: "单词", value: "2" },
        { lable: "考试", value: "5" },
      ];
    } else {
      btns = [
        { lable: "打字", value: "1" },
        { lable: "单词", value: "2" },
        { lable: "日报", value: "3" },
        { lable: "项目", value: "4" },
        { lable: "考试", value: "5" },
        { lable: "课堂任务", value: "6" },
      ];
    }
    return {
      msgShow: true,
      msg: {
        name: "张三",
        wancehgnduA: 13,
        wanchengdub: 30,
      },
      data: [],
      btns: btns,
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    goto(v) {
      if (v === "1") {
        if (isMob()) {
        }
      } else if (v === "2") {
        if (isMob()) {
        }
      } else if (v === "3") {
        if (isMob()) {
        }
      } else if (v === "4") {
        if (isMob()) {
        }
      } else if (v === "5") {
        if (isMob()) {
        }
      } else if (v === "6") {
        if (isMob()) {
        }
      }
    },
    init(data) {
      let stuInfo = JSON.parse(localStorage.getItem("stuInfo") ?? "{}");
      let _data = {
        dept_id: stuInfo?.dept_id ?? "",
      };
      getMobTaskList(_data).then((res) => {
        this.data = res?.result ?? [];
        // let data = res?.result ?? [];
        // this.data = [
        //   {
        //     ...data[0],
        //     task_content: [...data[0].task_content, ...data[0].task_content, ...data[0].task_content, ...data[0].task_content, ...data[0].task_content],
        //   },
        // ];
        l("777,", res);
      });
    },
    getDetail(row) {
      this.$nextTick(() => {
        this.$refs.detailref.init(row);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.shouye {
  //max-width: 600px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid darkblue;
  position: relative;
  overflow: auto;

  .top {
    width: 100%;
    height: 30px;
    //position: absolute;
    padding: 3px 10px;
    top: 0;
    border-bottom: 1px solid darkblue;

    .errorIcon {
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .userinfos {
    padding: 10px;
    padding-top: 15px;
    width: 100%;
    padding-bottom: 64px;

    .yuan {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid darkblue;
    }

    .info {
      border: 1px solid darkblue;
      border-radius: 5px;
      padding: 5px;

      &:last-child {
        //margin-bottom: 100px;
      }

      &:not(:first-child) {
        margin-top: 20px;
      }

      .namec {
        display: flex;
        line-height: 30px;

        .name {
          margin-left: 5px;
        }
      }

      .imgs {
        height: 115px;
        display: flex;
        overflow: auto;
        cursor: pointer;
        .taskImg {
          width: 98px;
          border: 1px solid #ccc;
          height: 98px;

          &:not(:first-child) {
            margin-left: 4px;
          }
        }
        img {
          height: 93px;
          width: 94px;
          cursor: pointer;
        }
        .txt {
          width: 98px;
          font-size: 12px;
          //text-align: left;
          //overflow: hidden;
          //text-overflow: ellipsis;
          //white-space: nowrap;
          overflow: hidden;
          //border: 1px solid #ccc;
          text-overflow: ellipsis;
          //padding:0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          //line-height:30px;
          height: 98px;
          box-shadow: inset 0px -1px 1px -1px #c8c7cc;
        }
      }

      .humans {
        display: flex;
        justify-content: space-between;
      }

      .abcd {
        margin-top: 4px;
        line-height: 28px;
        text-align: center;
        display: flex;

        div:not(:first-child) {
          margin-left: 5px;
        }
      }

      .count {
        display: flex;

        .pinglun,
        .zan {
          border: 1px solid darkblue;
          line-height: 30px;
          border-radius: 2px;
          margin-left: 5px;
          padding: 0 4px;
        }
      }
    }
  }

  .btns {
    margin-top: 20px;
    width: 100%;
    display: flex;
    overflow: auto;
  }

  @media screen and (max-width: 766px) {
  }
}
</style>
