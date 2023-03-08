<template>
  <div class="rooms">
    <div class="room-item" @click="getDetail(item)" v-for="(item, i) of data" :key="item.dormId">
      <div class="name">{{ item.dormFloor }} - {{ item.dormName }}</div>
      <div class="widow">窗户</div>
      <div class="status">{{ item.nowNumber }} / {{ item.number }}</div>
    </div>
  </div>
</template>

<script>
import { getRoomDetail, getRooms } from "@/api/user";

export default {
  name: "Rooms",
  data() {
    let data = Array.from(
      {
        length: 10,
      },
      (v, i) => ({
        name: "一层#/109 宿舍",
        status: "3/6",
        id: i + 1,
      })
    );
    // l(9999999, data);
    return {
      data: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      getRooms()
        .then((res) => {
          l(454, res);
          this.data = res?.data ?? [];
        })
        .catch((err) => {});
    },
    getDetail(v) {
      // getRoomDetail(dat)
      //   .then((res) => {
      //     this.$router.push("/roomDetail" + "/" + v.id);
      //   })
      //   .catch((err) => {});
      localStorage.setItem("roomInfo", JSON.stringify(v));
      if (v.dormId) {
        this.$router.push("/roomDetail" + "/" + v.dormId);
      }

      // window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.rooms {
  width: 600px;
  height: 100%;
  margin: 0 auto;
  overflow: auto;
  background: #f1f1f1;
  padding-top: 100px;
  .room-item {
    transition: all ease-in-out 0.3s;
    cursor: pointer;
    height: 300px;
    //line-height: 300px;
    width: 180px;
    text-align: center;
    //border-radius: 10%;
    font-size: 20px;
    margin-bottom: 100px;
    display: inline-block;
    margin-left: 10px;
    &:hover {
      background: #e0dede;
    }

    .name {
      height: 30px;
      background: #00afff;
      color: white;
    }
    .widow {
      background: rgba(255, 255, 0, 0.2);
      color: black;
      height: 30px;
    }
    .status {
      background: rgba(19, 206, 102, 0.16);
      height: 240px;
      line-height: 240px;
      border-bottom-left-radius: 5%;
      border-bottom-right-radius: 5%;
    }
  }
}
@media (max-width: 768px) {
  .rooms {
    width: 100%;
    .room-item {
      //margin-left: 10px;
      width: 45%;
    }
  }
}
</style>
