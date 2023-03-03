<template>
  <div class="roomDetail">
    <div class="name">{{ name }}</div>
    <div class="widow">窗户</div>
    <div class="room-item" v-for="(item, i) of data" :key="item.name">
      <div class="item-wrapper">
        <div class="top" @click="showDetail(item)">{{ item.top }}</div>
        <div class="bottom" @click="showDetail(item)">{{ item.bottom }}</div>
      </div>
    </div>

    <el-drawer title="宿舍" :visible.sync="drawer" direction="btt" :before-close="handleClose" size="50%" class="dddddddd">
      <div class="tips">输入个人信息并确认即可预占该位置</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="姓名" prop="name">
          <el-input size="small" v-model="form.name" placeholder="请输入姓名" clearable />
        </el-form-item>

        <el-form-item label="手机" prop="phone">
          <el-input size="small" v-model="form.phone" placeholder="请输入手机" clearable />
        </el-form-item>

        <el-row>
          <el-button type="primary" size="small" @click="sssave">确定</el-button>
        </el-row>
      </el-form>
    </el-drawer>

    <!--    <update ref="udpateRef"></update>-->
  </div>
</template>

<script>
import { getRoomDetail, getRooms } from "@/api/user";
import Update from "./udpate.vue";
export default {
  name: "RoomDetail",
  components: {
    Update,
  },
  data() {
    return {
      name: "",
      data: [],
      drawer: false,
      form: {
        name: "",
        phone: "",
      },
      rules: {
        name: [{ required: true, trigger: "change", message: "请输入姓名" }],
        phone: [{ required: true, trigger: "change", message: "请输入手机" }],
      },
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    init() {
      getRooms().then((res) => {
        // this.data = [];
      });
    },
    showDetail(item) {
      this.drawer = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    handleClose() {
      this.drawer = false;
    },
    sssave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          l(444444444, this.form);
        }
      });
    },
    getDetail() {
      l(343, this.$route);
      let id = this.$route.params.id;
      let dat = { id: id };
      // getRoomDetail(dat)
      //   .then((res) => {
      //     // this.$router.push("/roomDetail" + "/" + v.id);
      //   })
      //   .catch((err) => {});
      this.name = "433434";
      this.data = [
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
        {
          top: "111",
          bottom: "22",
        },
      ];
      // window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.name {
  height: 30px;
  background: #00afff;
  color: white;
  line-height: 30px;
}
.tips {
  font-size: 12px;
  background: #5a5e66;
  color: wheat;
  padding: 2px;
  margin-bottom: 5px;
}
.widow {
  //background: yellow;
  color: black;
  line-height: 30px;

  height: 30px;
}
.roomDetail {
  overflow: auto;
  width: 600px;
  margin: 0 auto;
  height: 100%;
  background: #f1f1f1ad;
  text-align: center;
  padding-top: 100px;
  .room-item {
    transition: all ease-in-out 0.3s;
    height: 140px;
    //line-height: 300px;
    text-align: center;
    //border-radius: 10%;
    font-size: 20px;
    width: 160px;
    margin-top: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
    display: inline-block;

    &:hover {
      background: #e0dede;
    }
    .item-wrapper {
      height: 100%;
      //background: #e0dede;
      //border: 1px solid white;
      //border-radius: 5%;
      background: #5a5e6624;
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top {
      height: 60px;
      line-height: 60px;
      //border: 1px solid white;
      color: black;
      background: #5a5e663d;
      cursor: pointer;

      border-radius: 5%;
    }
    .bottom {
      margin-top: 10px;
      color: black;
      height: 60px;
      line-height: 60px;
      cursor: pointer;

      border-radius: 5%;
      background: rgba(0, 136, 255, 0.08);
    }
  }
}

@media (max-width: 768px) {
  .roomDetail {
    width: 100%;
    .room-item {
      margin-left: 10px;
      width: 45%;
    }
  }
  .dddddddd ::v-deep {
    .el-drawer__header {
      margin-bottom: 10px;
    }
    .el-drawer__body {
      padding: 0 20px;
    }
  }
}
</style>
