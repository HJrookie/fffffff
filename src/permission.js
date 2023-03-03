import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/logins", "/auth-redirect", "/institutionReg", "/individualReg", "/bind", "/register", "/notices", "/resetPassword", "/rooms", "/admin"];

router.beforeEach((to, from, next) => {
  NProgress.start();
  // console.log(1, getToken());
  if (getToken()) {
    // to.meta.title && store.dispatch("settings/setTitle", to.meta.title);
    /* has token*/
    if (to.path === "/login") {
      let role = localStorage.getItem("role");
      if (role === "admin") {
        next({ path: "/home" });
      } else {
        next({ path: "/student" });
      }
      // next({ path: "/" });
      NProgress.done();
    } else {
      if (!store.getters.menus) {
        store.dispatch("GenerateRoutes").then(() => {
          next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
        });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    // console.log("whiteList.indexOf(to.path)", whiteList.indexOf(to.path), to.path);
    if (whiteList.indexOf(to.path) !== -1 || to.path.includes("roomDetail")) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
