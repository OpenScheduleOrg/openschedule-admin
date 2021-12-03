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
    component: () => import("@/components/Agenda.vue"),
    children: [
      {
        path: "/agenda" + agendaParams,
        name: "agenda",
        component: () => import("@/components/period/Consultas.vue"),
        meta: { title: "Agenda - CONSULTAS" },
      },
      {
        path: "/agenda/week" + agendaParams,
        name: "week",
        component: () => import("@/components/period/Week.vue"),
        meta: {title: "Agenda - SEMANA"}
      },
      {
        path: "/agenda/day" + agendaParams,
        name: "day",
        component: () => import("@/components/period/Day.vue"),
      },
    ],
  },
  {
    path: "/clinica",
    name: "clinica",
    component: () => import("@/components/Clinica.vue"),
    children: [
      {
        path: "/clinica/update",
        name: "updateClinica",
        component: () => import("@/components/clinica/ClinicaForm.vue"),
      },
    ],
  },
  {
    path: "/clientes",
    name: "clientes",
    component: () => import("@/components/Cliente.vue"),
    children: [
      {
        path: "/clientes/:id",
        name: "detailCliente",
        component: () => import("@/components/cliente/ClienteDetail.vue"),
      },
      {
        path: "/clientes/:id/update",
        name: "updateCliente",
        component: () => import("@/components/cliente/ClienteForm.vue"),
      },
      {
        path: "/cliente/new",
        name: "newCliente",
        component: () => import("@/components/cliente/ClienteForm.vue"),
      },
    ],
  },
  {
    path: "/funcionarios",
    name: "funcinarios",
    component: () => import("@/components/Funcionario.vue"),
    children: [
      {
        path: "/funcionario/new",
        name: "newFuncionario",
        component: () => import("@/components/funcionario/FuncionarioForm.vue"),
      },
      {
        path: "/funcionario/:id/update",
        name: "updateFuncionario",
        component: () => import("@/components/funcionario/FuncionarioForm.vue"),
      },
      {
        path: "/funcionario/:id",
        name: "detailFuncionario",
        component: () =>
          import("@/components/funcionario/FuncionarioDetail.vue"),
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
    name: SyName.login,
    component: () => import("@/views/Login.vue"),
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
    component: () => import("@/views/Main.vue"),
    beforeEnter(to, from, next) {
      if (!store.state.auth.status)
        store
          .dispatch("auth/getLoged")
          .then(() => {
            agendaGuard(to, from, next);
          })
          .catch(() => {
            next({name: SyNames.login});
          });
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
