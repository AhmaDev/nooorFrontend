import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/users/:role",
    name: "users",
    component: () => import("../views/Users.vue"),
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/Users.vue"),
  },
  {
    path: "/categories",
    name: "categories",
    component: () => import("../views/Categories.vue"),
  },
  {
    path: "/avatars",
    name: "avatars",
    component: () => import("../views/Avatars.vue"),
  },
  {
    path: "/courses",
    name: "courses",
    component: () => import("../views/Courses.vue"),
  },
  {
    path: "/course/:id",
    name: "course",
    component: () => import("../views/Course.vue"),
  },
  {
    path: "/profile/:type/:id",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/Settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
