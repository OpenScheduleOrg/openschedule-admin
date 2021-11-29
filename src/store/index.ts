import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import auth, { StateAuth } from "./modules/auth";
import calendar, { StateCalendar } from "./modules/calendar";
import clinica, { StateClinica } from "./modules/clinica";

export interface State {
  calendar: StateCalendar;
  auth: StateAuth;
  clinica: StateClinica;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    calendar,
    auth,
    clinica,
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
