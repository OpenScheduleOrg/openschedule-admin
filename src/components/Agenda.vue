<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NavigationGuard, RouteRecordName } from "vue-router";
import { Period } from "@/constants/index";
import { SET_PERIOD, SET_CURRENT_DATE } from "@/store/modules/mutation-types";
import store from "@/store";

const handlerRoute: NavigationGuard = function (to, from, next) {
  if (to.name && Object.values<RouteRecordName>(Period).includes(to.name)) {
    const today = new Date();
    if (to.params.day && to.params.year && to.params.month) {
      const year = Number(to.params.year);
      const month = Number(to.params.month) - 1;
      const day = Number(to.params.day);

      if (
        year == today.getFullYear() &&
        month == today.getMonth() &&
        day == today.getDate()
      ) {
        next({ name: to.name, params: { day: "", month: "", year: "" } });
        return;
      }

      store.commit("calendar/" + SET_CURRENT_DATE, new Date(year, month, day));
    } else {
      store.commit("calendar/" + SET_CURRENT_DATE, today);
    }

    if (to.name !== store.state.calendar.period) {
      store.commit("calendar/" + SET_PERIOD, to.name);
      const params = (from.name as string) in Period ? from.params : to.params;
      next({ name: to.name, params: params });
    } else next();
  } else
    next({
      name: store.state.calendar.period,
      params: { day: "", month: "", year: "" },
    });
};

export default defineComponent({
  name: "Agenda",
  beforeRouteEnter: handlerRoute,
  beforeRouteUpdate: handlerRoute,
});
</script>
