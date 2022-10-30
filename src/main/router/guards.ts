import { NavigationGuard, RouteRecordName } from "vue-router";
import { Period } from "@/common/constants";
import store from "@/store";
import SyNames from "./symbols";

let intervaleUpdateState: number | undefined = undefined;

export const agendaGuard: NavigationGuard = function (to, from, next) {
  if (to.name && Object.values<RouteRecordName>(Period).includes(to.name)) {
    if (!intervaleUpdateState)
      intervaleUpdateState = setInterval(() => {
        store.dispatch("clinica/setConsultas");
        store.dispatch("calendar/setNow");
      }, 6000);
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

      store.dispatch("calendar/setCurrentDate", new Date(year, month, day));
    } else {
      store.dispatch(
        "calendar/setCurrentDate",
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
      // eslint-disable-next-line
      for (var _ in to.params) {
        next({ name: to.name });
        return;
      }
    }

    if (to.name !== store.state.calendar.period) {
      store.dispatch("calendar/setPeriod", to.name);
      const params = (from.name as string) in Period ? from.params : to.params;
      next({ name: to.name, params: params });
    } else {
      next();
    }
  } else if (to.name === SyNames.home)
    next({ name: store.state.calendar.period });
  else {
    clearInterval(intervaleUpdateState);
    intervaleUpdateState = undefined;
    next();
  }
};
