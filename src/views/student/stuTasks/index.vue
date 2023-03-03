<template>
  <div class="stuTasks">
    <transition>
      <div v-if="msgShow" class="top">
        {{ msg.name }}提交了任务,完成度{{ msg.wancehgnduA }}/{{ msg.wanchengdub }}
        <span class="errorIcon" @click="msgShow = false"><i class="el-icon-error"></i> </span>
      </div>
    </transition>

    <div class="userinfos">
      <div class="info" v-for="(item, i) of data">
        <template v-if="item.task_type === 'image'">
          <div class="name">任务:{{ item.task_name }}</div>
          <div class="daojishi">倒计时:{{ item.countdown }}</div>
          <div class="img">
            <el-upload :ref="'upload' + item.id" :action="uploadUrl" :data="uploadData" :show-file-list="false" drag accept="image/*" :on-success="(...v) => handleSuccess(...v, item)" :on-remove="handleRemove(...arguments, item)">
              <template v-if="item.value">
                <img class="el-upload-list__item-thumbnail" :src="item.value" alt="" />
                <!--                <span class="upload-action">-->
                <!--                  <i class="el-icon-delete"></i>-->
                <!--                </span>-->
              </template>
              <template v-else>
                <i class="el-icon-upload"></i>
              </template>
              <!--              <i v-if="item.imgSrc" slot="default" class="el-icon-plus"></i>-->
              <!--              <div slot="file" slot-scope="{ file }">-->
              <!--                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />-->
              <!--                <span class="el-upload-list__item-actions">-->
              <!--                  <span class="el-upload-list__item-delete" @click="handleRemove(item, file)">-->
              <!--                    <i class="el-icon-delete"></i>-->
              <!--                    &lt;!&ndash;                  &ndash;&gt;-->
              <!--                  </span>-->
              <!--                </span>-->
              <!--              </div>-->
            </el-upload>
          </div>
        </template>
        <template v-else>
          <div class="name">任务:{{ item.task_name }}</div>
          <div class="daojishi">倒计时:{{ item.countdown }}</div>
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="item.value"> </el-input>
        </template>
      </div>
    </div>

    <el-row type="flex" justify="center">
      <el-button @click="sssss">提交</el-button>
    </el-row>
  </div>
</template>

<script>
import { getCurUserInfo, getMobTaskList, getPersionalInfo, getStuTask, submitStuTask, savePersonalInfo, savePersonInfo } from "@/api/user";
import { mapGetters } from "vuex";
import { isMobile } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { getImgUrl } from "@/utils";
import { getFileInfoById } from "@/api/contestManage";
// import Left from "./left.vue";
// import Right from "./right.vue";
import _ from "lodash";

export default {
  name: "StuTasks",
  components: {
    // Left,
    // Right,
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/uploader",
      uploadData: {
        userid: JSON.parse(localStorage.getItem("stuInfo") ?? "{}")?.userid,
      },
      msgShow: true,
      msg: {
        name: "张三",
        wancehgnduA: 13,
        wanchengdub: 30,
      },
      data: [],
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    handleSuccess(response, file, files, item) {
      l("sssssssssss", response, file, files, item);
      // item.id = response?.id;
      item.value = response?.result ?? URL.createObjectURL(file.raw);
      // this.form.pics.push({
      //   file: file,
      //   response,
      // });
    },
    handleRemove(file) {
      // let uploadFiles = this.$refs.upload.uploadFiles;
      // uploadFiles.forEach((v, i) => {
      //   if (v.response.id === file.response.id) {
      //     uploadFiles.splice(i, 1);
      //   }
      // });
      // this.form.pics = this.form.pics.filter((v) => v.response.id !== file.response.id);
    },
    sssss() {
      if (
        this.data.some((item) => {
          return item.value === "";
        })
      ) {
        return this.$message.warning("请完善后重试");
      }
      Promise.all([
        this.data.map((item) => {
          return new Promise((resolve) => {
            submitStuTask({
              id: item.id,
              dept_id: JSON.parse(localStorage.getItem("stuInfo") ?? "{}")?.dept_id,
              task_type: item.task_type,
              content: item.value,
            }).then((res) => {
              resolve();
            });
          });
        }),
      ]).then((res) => {
        this.$message.success("提交成功");
        this.init();
      });
    },
    init() {
      let stuInfo = JSON.parse(localStorage.getItem("stuInfo") ?? "{}");
      let _data = {
        userid: stuInfo?.userid ?? "",
      };
      getStuTask(_data).then((res) => {
        this.data = (res?.result?.task_content ?? []).map((v) => ({
          ...v,
          value: v.content ?? "",
        }));
        // let data =[ res?.result] ?? [];
        // this.data = [
        //   {
        //     ...data[0],
        //   },
        //   data[0],
        //   data[0],
        //   data[0],
        //   data[0],
        //   data[0],
        //   data[0],
        //   data[0],
        //   data[0],
        //   data[0],
        // ];
        l("777,", res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.stuTasks {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid darkblue;
  position: relative;

  .top {
    width: 100%;
    height: 30px;
    position: absolute;
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
    padding-top: 40px;
    width: 100%;
    overflow: auto;
    padding-bottom: 64px;
    height: 100%;
    .info {
      border: 1px solid darkblue;
      border-radius: 5px;
      padding: 5px;

      &:not(:first-child) {
        margin-top: 20px;
      }
      .img {
        height: 100px;
      }
      .daojishi {
        margin: 5px 0;
      }
    }
    ::v-deep {
      .el-upload--picture-card {
        height: 100px;
        width: 100px;
        line-height: 100px;
      }
      .el-upload-list--picture-card .el-upload-list__item {
        height: 100px;
        width: 100px;
        line-height: 100px;
      }
      .el-upload-dragger {
        width: 100px;
        height: 100px;
        .el-icon-upload {
          font-size: 24px;
          line-height: 100px;
          margin: 0;
        }
        img {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
  ::v-deep .el-textarea .el-textarea__inner {
    padding: 5px;
  }

  .upload-action {
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
}
</style>
