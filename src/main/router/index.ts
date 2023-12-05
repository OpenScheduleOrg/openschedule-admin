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
    component: () => import("@/presentation/components/Agenda.vue"),
    children: [
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
    path: "/specialties",
    name: "specialties",
    component: () =>
      import("@/presentation/components/specialty/Specialties.vue"),
  },
  {
    path: "/professionals",
    name: "professionals",
    component: () =>
      import("@/presentation/components/professional/ProfessionalRoute.vue"),
    children: [
      {
        path: "/professionals/new",
        name: "professional_new",
        component: () =>
          import("@/presentation/components/professional/ProfessionalForm.vue"),
      },
      {
        path: "/professionals/:professional_id/edit",
        name: "professional_edit",
        component: () =>
          import("@/presentation/components/professional/ProfessionalForm.vue"),
      },
    ],
  },
  {
    path: "/users",
    name: "users",
    component: () =>
      import("@/presentation/components/user/UserRoute.vue"),
    children: [
      {
        path: "/users/new",
        name: "user_new",
        component: () =>
          import("@/presentation/components/user/UserForm.vue"),
      },
      {
        path: "/users/:user_id/edit",
        name: "user_edit",
        component: () =>
          import("@/presentation/components/user/UserForm.vue"),
      },
    ],
  },
  {
    path: "/schedules",
    name: "schedules",
    component: () =>
      import("@/presentation/components/schedule/ScheduleRoute.vue"),
    children: [
      {
        path: "/schedules/new",
        name: "schedule_new",
        component: () =>
          import("@/presentation/components/schedule/ScheduleForm.vue"),
      },
      {
        path: "/schedules/:schedule_id/edit",
        name: "schedule_edit",
        component: () =>
          import("@/presentation/components/schedule/ScheduleForm.vue"),
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
    beforeEnter(to, from, next) {
      if (!store.state.auth.current_user)
        store
          .dispatch("auth/restoreSession")
          .then(() => next({ name: SyNames.home }))
          .catch(next)
      else next({ name: SyNames.home });
    },
    meta: { title: "Open Schedule - Login" },
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
