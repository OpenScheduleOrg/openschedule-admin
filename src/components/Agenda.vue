<template>
  {{ $route.params }}
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Period } from "@/constants/index";
import { SET_PERIOD, SET_CURRENT_DATE } from "@/store/modules/mutation-types";

export default defineComponent({
  name: "Agenda",
  beforeRouteUpdate(to, from, next) {
    if (to.name == Period.Week || to.name == Period.Day) {
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
          next({ name: to.name, params: {day: "", month: "", year: ""} });
          return;
        }

        this.$store.commit(
          "calendar/" + SET_CURRENT_DATE,
          new Date(year, month, day)
        );
      } else {
        this.$store.commit("calendar/" + SET_CURRENT_DATE, today);
      }

      if (to.name !== this.$store.state.calendar.period) {
        this.$store.commit("calendar/" + SET_PERIOD, to.name);
        next({ name: to.name, params: from.params });
      } else next();
    } else next();
  },
});
</script>
