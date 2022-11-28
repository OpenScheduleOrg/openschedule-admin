import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import {
  StateAuth,
  StateCalendar,
  StateClinics,
  CalendarModule,
  AuthModule,
  ClinicsModule,
  StateProfessionals,
  ProfessionalsModule,
  StateSchedules,
  SchedulesModule,
  StateAgenda,
  AgendaModule,
  StateRecord,
  RecordModule,
  StateCache,
  CacheModule,
} from "./modules";

export type State = {
  auth: StateAuth;
  calendar: StateCalendar;
  clinics: StateClinics;
  professional: StateProfessionals;
  schedule: StateSchedules;
  agenda: StateAgenda;
  record: StateRecord;
  cache: StateCache;
};

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    auth: AuthModule,
    calendar: CalendarModule,
    clinics: ClinicsModule,
    professionals: ProfessionalsModule,
    schedules: SchedulesModule,
    agenda: AgendaModule,
    record: RecordModule,
    cache: CacheModule,
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
