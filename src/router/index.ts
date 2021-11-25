import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import store from "@/store";

/*
    FORMATO ROUTE
    {
        path: '/',
        name: '',
        component: () => import('@components/'),
    }, 

 */
const children: RouteRecordRaw[] = [
  {
    path: "/",
    alias: "/agenda",
    name: "agenda",
    component: () => import("@/components/Agenda.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: import("@/components/NotFound.vue"),
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: {
      beforeRouteEnter(to, from, next) {
        store.dispatch("auth/logout");
        next("/login");
      },
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Main.vue"),
    beforeEnter(to, from, next) {
      store
        .dispatch("auth/getLoged")
        .then(() => next())
        .catch((error) => {
          console.error(error);
          next("/login");
        });
    },
    children,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
