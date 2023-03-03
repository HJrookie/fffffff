<template>
  <div class="home">
    <!--    <left :menuData="menuData" @initMenu="initMenuData" @setStus="updateMenuData"></left>-->
    <right :selectedStus="students" ref="right" :active-tag="activeTag" @updateStus="update_stus"

           @updateActiveTag="update_activeTag"
    ></right>
  </div>
</template>

<script>
import {getCurUserInfo, getPersionalInfo, savePersonalInfo, savePersonInfo} from "@/api/user";
import {mapGetters} from "vuex";
import {isMobile} from "@/utils/validate";
import {getToken} from "@/utils/auth";
import {getImgUrl} from "@/utils";
import {getFileInfoById} from "@/api/contestManage";
// import Left from "./left.vue";
import Right from "./right.vue";
import _ from 'lodash'

export default {
  name: "PersonEdit",
  components: {
    // Left,
    Right
  },
  data() {
    return {
      students: [],  // 被选中的学生信息
      menuData: [],  // 大的菜单
      activeTag: '', // 右边选中的tag
      activeMenu: '', //
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["dicts"]),
    ...mapGetters(["sidebarRouters", "activeStus", "sidebar"]),
  },
  methods: {
    // 点击左侧选项后 更新数据
    updateMenuData({menu, item, targetStatus}) {
      // l(1, menu, item, targetStatus)
      // 代表新的menu被选中了.因此置空所有数据
      if (menu.children.every(v => v.checked === false)) {
        this.students = [item]
        this.activeMenu = menu;
        this.menuData.forEach(v => {
          v.children.forEach(_ => {
            _.checked = false
            if (_.id === item.id) {
              _.checked = targetStatus;
            }
          })
        })
      } else {
        // 还是原来的menu被选中了
        const _menu = this.menuData.find(v => v.id === menu.id);
        _menu.children.forEach(v => {
          if (v.id === item.id) {
            v.checked = targetStatus;
            // 更新被选中的学生
            if (v.checked) {
              this.students.push({...item, checked: true})
            } else {
              this.students = this.students.filter(v => v.id !== item.id)
            }
          }
        })
      }
      if (this.students.length) {
        this.activeTag = this.students[0];
        // this.$refs.right.getStuData(null);
      } else {
        this.activeTag = '';
      }
      // l(8, this.students)
    },
    update_stus(data) {
      const _menu = this.menuData.find(v => v.id === this.activeMenu.id);
      _menu.children.forEach(v => {
        if (v.id === data.id) {
          v.checked = false;
        }
      })

      this.students = this.students.filter(v => v.id !== data.id);
      this.activeTag = this.students.length ? this.students[0] : '';
    },
    update_activeTag(data) {
      this.activeTag = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
