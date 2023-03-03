import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";

const permission = {
  state: {
    routes: [],
    menus: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    activeStus: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [
        {
          path: "index",
          meta: { title: "统计报表", icon: "dashboard" },
        },
      ];
      state.topbarRouters = routes.concat(index);
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes;
    },

    SET_ACTIVE_STUS: (state, activeStus) => {
      state.activeStus = activeStus;
    },
  },
  actions: {
    ChangeActiveMenu(context, value) {
      if (context.state.activeMenu.id === value.id) {
        return;
      }
      // 重置数据
      context.state.sidebarRouters.forEach((v) => {
        if (v.id === context.state.activeMenu.id) {
          v.children.forEach((item) => {
            item.checked = false;
          });
        }
      });
      // if(context.state)
      // console.log(9, value);
      value.children[0].checked = true;
      context.commit("SET_ACTIVE_MENU", value);
      context.commit("SET_ACTIVE_STUS", [
        {
          ...value.children[0],
        },
      ]);
    },
    ChangeActiveStus(context, payload) {
      let data = [...context.state.activeStus];
      // add
      if (payload.item.checked) {
        data.push({
          ...payload.item,
        });
      } else {
        data = data.filter((v) => v.id !== payload.item.id);
        let activeMenu = context.state.sidebarRouters.find((v) => v.id === context.state.activeMenu.id);
        activeMenu.children.forEach((v) => {
          if (v.id === payload.item.id) {
            v.checked = false;
          }
        });
        context.commit("SET_ACTIVE_MENU", activeMenu);
      }
      context.commit("SET_ACTIVE_STUS", data);
    },
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        // getRouters()
        Promise.resolve().then((res) => {
          // const sdata = JSON.parse(JSON.stringify(res.data));
          // const rdata = JSON.parse(JSON.stringify(res.data));
          // const sidebarRoutes = filterAsyncRouter(sdata);
          // const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          // const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          // rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
          router.addRoutes([{ path: "*", redirect: "/404", hidden: true }]);
          // commit("SET_ROUTES", rewriteRoutes);
          // commit("SET_SIDEBAR_ROUTERS", constantRoutes.concat(sidebarRoutes));
          const menuData = [
            {
              id: "1",
              label: "111",
              children: [
                {
                  id: 3,
                  label: "3",
                  checked: true,
                },
                {
                  id: 4,

                  label: "4",
                  checked: false,
                },
                {
                  id: 5,

                  label: "5",
                  checked: false,
                },
                {
                  id: 6,
                  label: "6",
                  checked: false,
                },
              ],
            },
            {
              id: "2",
              label: "222",
              children: [
                {
                  id: 7,
                  label: "7",
                  checked: false,
                },
                {
                  id: 8,
                  label: "8",
                  checked: false,
                },
                {
                  id: 9,
                  label: "9",
                  checked: false,
                },
                {
                  id: 10,
                  label: "10",
                  checked: false,
                },
              ],
            },
          ];
          commit("SET_SIDEBAR_ROUTERS", menuData);
          commit("SET_ACTIVE_MENU", menuData[0] ?? 0);
          commit("SET_MENUS", [{}]);
          commit("SET_ACTIVE_STUS", [menuData[0].children[0]] ?? 0);
          // commit("SET_DEFAULT_ROUTES", sidebarRoutes);
          // commit("SET_TOPBAR_ROUTES", sidebarRoutes);
          resolve([]);
        });
      });
    },
  },
};

export const loadView = (view) => {
  if (process.env.NODE_ENV === "development") {
    // return (resolve) => require([`@/views/${view}`], resolve);
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`);
  }
};

export default permission;
