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
    path: "/agenda",
    name: "agenda",
    component: () => import("@/components/Agenda.vue"),
    redirect: "/agenda/" + store.state.calendar.period,
    children: [
      {
        path: "/agenda/week/:day?/:month?/:year?",
        name: "week",
        component: () => import("@/components/periodo/Week.vue"),
      },
      {
        path: "/agenda/day/:day?/:month?/:year?",
        name: "day",
        component: () => import("@/components/periodo/Week.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/components/NotFound.vue"),
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
    redirect: "/agenda/" + store.state.calendar.period,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
