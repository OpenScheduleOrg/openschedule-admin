import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import SyName from "./symbols";
import { agendaGuard } from "./guards";
import SyNames from "./symbols";

const agendaParams = "/:day(\\d*)?/:month(\\d*)?/:year(\\d*)?";

const children: RouteRecordRaw[] = [
  {
    path: "/agenda",
    name: SyName.rootAgenda,
    beforeEnter: () => {
      store.dispatch("clinica/setClinica");
    },
    component: () => import("@/presentation/components/Agenda.vue"),
    children: [
      {
        path: "/agenda" + agendaParams,
        name: "agenda",
        component: () =>
          import("@/presentation/components/period/Consultas.vue"),
        meta: { title: "Agenda - CONSULTAS" },
      },
      {
        path: "/agenda/week" + agendaParams,
        name: "week",
        component: () => import("@/presentation/components/period/Week.vue"),
        meta: { title: "Agenda - SEMANA" },
      },
      {
        path: "/agenda/day" + agendaParams,
        name: "day",
        component: () => import("@/presentation/components/period/Day.vue"),
      },
    ],
  },
  {
    path: "/clinics",
    name: "clinics",
    component: () => import("@/presentation/components/clinic/ClinicRoute.vue"),
    children: [
      {
        path: "/clinics/:clinic_id",
        name: "clinic_detail",
        component: () =>
          import("@/presentation/components/clinic/ClinicDetail.vue"),
      },
      {
        path: "/clinics/new",
        name: "clinic_new",
        component: () =>
          import("@/presentation/components/clinic/ClinicForm.vue"),
      },
      {
        path: "/clinics/:clinic_id/edit",
        name: "clinic_edit",
        component: () =>
          import("@/presentation/components/clinic/ClinicForm.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/presentation/components/NotFound.vue"),
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: SyName.login,
    component: () => import("@/presentation/views/Login.vue"),
    meta: { title: "ConsuChat - LOGIN" },
  },
  {
    path: "/logout",
    name: SyName.logout,
    component: {
      beforeRouteEnter(to, from, next) {
        store.dispatch("auth/logout");
        next("/login");
      },
    },
  },
  {
    path: "/",
    name: SyName.home,
    component: () => import("@/presentation/views/Main.vue"),
    beforeEnter(to, from, next) {
      if (!store.state.auth.current_user)
        store
          .dispatch("auth/restoreSession")
          .then(() => agendaGuard(to, from, next))
          .catch(() => next({ name: SyNames.login }));
      else if (to.name === SyName.home)
        next({ name: store.state.calendar.period });
      else agendaGuard(to, from, next);
    },
    children,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
