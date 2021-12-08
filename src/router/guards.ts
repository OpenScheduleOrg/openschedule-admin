import { NavigationGuard, RouteRecordName } from "vue-router";
import { Period } from "@/constants/index";
import { SET_PERIOD, SET_CURRENT_DATE } from "@/store/modules/mutation-types";
import store from "@/store";
import SyNames from "./symbols";

export const agendaGuard: NavigationGuard = function (to, from, next) {
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
        next({ name: to.name });
        return;
      }

      store.commit("calendar/" + SET_CURRENT_DATE, new Date(year, month, day));
    } else {
      store.commit(
        "calendar/" + SET_CURRENT_DATE,
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
      // eslint-disable-next-line
      for (var _ in to.params) {
        next({ name: to.name });
        return;
      }
    }

    if (to.name !== store.state.calendar.period) {
      store.commit("calendar/" + SET_PERIOD, to.name);
      const params = (from.name as string) in Period ? from.params : to.params;
      next({ name: to.name, params: params });
    } else {
      next();
    }
  } else if (to.name === SyNames.home)
    next({ name: store.state.calendar.period });
  else next();
};
