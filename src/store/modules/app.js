import Cookies from "js-cookie";
import { searchStus } from "@/api/user";
import { login } from "@/api/login";
import { setToken } from "@/utils/auth";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus") ? !!+Cookies.get("sidebarStatus") : true,
    withoutAnimation: false,
  },
  device: "desktop",
  size: Cookies.get("size") || "medium",
  menuData: [], // 左侧的菜单树
  activeMenu: "", //当前被选中的班级, 只有一个
  activeStu: "", //当前被选中的学生, 只有一个
  students: [], // 目前选中 的students
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    Cookies.set("size", size);
  },
  SET_MENUDATA: (state, menuData) => {
    state.menuData = menuData;
  },
  SET_ACTIVEMENU: (state, activeMenu) => {
    state.activeMenu = activeMenu;
  },
  SET_STUDENTS: (state, students) => {
    state.students = students;
  },
  SET_ACTIVE_STU: (state, activeStu) => {
    state.activeStu = activeStu;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size);
  },
  initStuInfo({ commit }, data) {
    let _data = {
      ...(data ?? {}),
      "userid": data.userid,
    };
    localStorage.setItem("userid", data.userid);
    commit("SET_STUDENTS", [_data]);
    commit("SET_ACTIVE_STU", _data);
    return Promise.resolve();
  },
  initMenus(context, data) {
    searchStus(data).then((res) => {
      let { result, size } = res.result;
      let year = result[0]?.dept_name?.slice(0, 3) ?? "";
      let { clas } = result.reduce(
        (prev, cur) => {
          if (!prev.clas[cur.parent_id]) {
            prev.clas[cur.parent_id] = {
              id: cur.parent_id,
              label: cur.dept_name.slice(3),
              children: [
                {
                  ...cur,
                  label: cur.user_name,
                  id: cur.userid,
                  checked: false,
                },
              ],
            };
          } else {
            prev.clas[cur.parent_id].children.push({
              ...cur,
              label: cur.user_name,
              id: cur.userid,
              checked: false,
            });
          }
          return prev;
        },
        {
          clas: {},
        }
      );
      let _menuData = Object.values(clas);
      context.commit("SET_MENUDATA", _menuData);
    });
  },
  updateMenuData(context, { menu, item, targetStatus }) {
    l(
      "updateMenuData",
      menu,
      item,
      menu.children.every((v) => v.checked === false),
      "---",
      targetStatus
    );
    context.commit("SET_ACTIVEMENU", menu);
    if (menu.children.every((v) => v.checked === false)) {
      context.commit("SET_STUDENTS", [item]);
      context.state.menuData.forEach((v) => {
        v.children.forEach((_) => {
          _.checked = false;
          if (_.id === item.id) {
            _.checked = targetStatus;
          }
        });
      });
      context.commit("SET_MENUDATA", context.state.menuData);
      context.commit("SET_ACTIVE_STU", item);
    } else {
      let _stus = [...context.state.students];
      // 还是原来的menu被选中了
      const _menu = context.state.menuData.find((v) => v.id === menu.id);
      _menu.children.forEach((v) => {
        if (v.id === item.id) {
          v.checked = targetStatus;
          // 更新被选中的学生
          if (v.checked) {
            _stus.push({ ...item, checked: true });
          } else {
            _stus = _stus.filter((v) => v.id !== item.id);
          }
        }
      });
      context.commit("SET_STUDENTS", _stus);
      if (_stus.length) {
        context.commit("SET_ACTIVE_STU", _stus[0]);
      } else {
        context.commit("SET_ACTIVE_STU", "");
      }
    }
  },
  handleTagClose(context, data) {
    l("333", context.state);
    const _menu = context.state.menuData.find((v) => v.id === context.state.activeMenu.id);
    _menu.children.forEach((v) => {
      if (v.id === data.id) {
        v.checked = false;
      }
    });
    context.commit("SET_MENUDATA", _menu);
    let _stus = context.state.students.filter((v) => v.id !== data.id);
    context.commit("SET_STUDENTS", _stus);
    context.commit("SET_ACTIVE_STU", _stus.length ? _stus[0] : "");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
