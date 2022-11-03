import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import {
  StateAuth,
  StateCalendar,
  StateClinica,
  StateClinics,
  CalendarModule,
  AuthModule,
  ClinicaModule,
  ClinicsModule,
} from "./modules";

export type State = {
  auth: StateAuth;
  calendar: StateCalendar;
  clinica: StateClinica;
  clinics: StateClinics;
};

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    auth: AuthModule,
    calendar: CalendarModule,
    clinica: ClinicaModule,
    clinics: ClinicsModule,
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
