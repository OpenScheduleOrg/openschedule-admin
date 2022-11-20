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
  StateProfessionals,
  ProfessionalsModule,
  StateSchedules,
  SchedulesModule,
  StateAgenda,
  AgendaModule,
} from "./modules";

export type State = {
  auth: StateAuth;
  calendar: StateCalendar;
  clinica: StateClinica;
  clinics: StateClinics;
  professional: StateProfessionals;
  schedule: StateSchedules;
  agenda: StateAgenda;
};

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    auth: AuthModule,
    calendar: CalendarModule,
    clinica: ClinicaModule,
    clinics: ClinicsModule,
    professionals: ProfessionalsModule,
    schedules: SchedulesModule,
    agenda: AgendaModule,
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
