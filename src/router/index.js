import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  // {
  //   path: "/notices",
  //   component: () => import("@/views/noticeManage/index"),
  //   hidden: true,
  // },
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      // {
      //   path: "dashboard",
      //   component: () => import("@/views/sjDashboard/index"),
      // },
      {
        path: "index",
        component: () => import("@/views/index"),
        name: "Index",
        hidden: true,
        meta: { title: "首首页首页页", icon: "dashboard", affix: true },
      },
      // {
      //   path: "/baseInfo",
      //   component: () => import("@/views/baseInfo/index"),
      //   hidden: true,
      // },
      // {
      //   path: "/home",
      //   component: () => import("@/views/home/index"),
      //   hidden: true,
      // },
      // {
      //   // 发布管理
      //   path: "/fabus",
      //   component: () => import("@/views/tasks/index"),
      //   hidden: true,
      // },
      // // 任务库
      // {
      //   path: "/taskLib",
      //   component: () => import("@/views/taskLib/index"),
      //   hidden: true,
      // },
      // {
      //   path: "/batchFabu",
      //   component: () => import("@/views/batchFabu/index"),
      //   hidden: true,
      // },
    ],
  },
  // {
  //   path: "/stuMenus",
  //   component: () => import("@/views/stuMenus/index"),
  //   hidden: true,
  // },
  { path: "/rooms", component: () => import("@/views/rooms/index"), hidden: true },
  { path: "/admin", component: () => import("@/views/admin/index"), hidden: true },
  { path: "/roomDetail/:id", component: () => import("@/views/roomDetail/index"), hidden: true },
  // {
  //   path: "/student",
  //   component: () => import("@/views/student/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/teacher",
  //   component: () => import("@/views/teacher/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/tea-mob-taskLib",
  //   component: () => import("@/views/teacher-mob-taskLib/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/dazi",
  //   component: () => import("@/views/stuMenus/stuMenus/dazi/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/danci",
  //   component: () => import("@/views/stuMenus/stuMenus/danci/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/ribao",
  //   component: () => import("@/views/stuMenus/stuMenus/ribao/index"),
  //   hidden: true,
  // },
  // //.file
  // {
  //   path: "/xiangmu",
  //   component: () => import("@/views/stuMenus/stuMenus/xiangmu/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/kaoshi",
  //   component: () => import("@/views/stuMenus/stuMenus/kaoshi/index"),
  //   hidden: true,
  // },
  // {
  //   path: "/ketang",
  //   component: () => import("@/views/stuMenus/stuMenus/ketang/index"),
  //   hidden: true,
  // },
  //
  // {
  //   path: "/user",
  //   component: Layout,
  //   hidden: true,
  //   redirect: "noredirect",
  //   children: [
  //     {
  //       path: "profile",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" },
  //     },
  //   ],
  // },
  // {
  //   path: "/resetPassword",
  //   name: "resetPassword",
  //   component: () => import("../views/register/resetPassword.vue"),
  // },
  // {
  //   path: "/institutionReg",
  //   name: "InstitutionReg",
  //   component: () => import("../views/register/InstitutionRegister.vue"),
  // },
  // {
  //   path: "/individualReg",
  //   name: "IndividualReg",
  //   component: () => import("../views/register/IndividualRegister.vue"),
  // },
];

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
