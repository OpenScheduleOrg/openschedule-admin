import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import { rootAgenda } from "./symbols";

const children: RouteRecordRaw[] = [
  {
    path: "/agenda",
    name: rootAgenda,
    component: () => import("@/components/Agenda.vue"),
    children: [
      {
        path: "/agenda/:day?/:month?/:year?",
        name: "agenda",
        component: () => import("@/components/period/Consultas.vue"),
      },
      {
        path: "/agenda/week/:day?/:month?/:year?",
        name: "week",
        component: () => import("@/components/period/Week.vue"),
      },
      {
        path: "/agenda/day/:day?/:month?/:year?",
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
    redirect: { name: rootAgenda },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
