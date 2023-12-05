import { Module, Commit, Dispatch } from "vuex";
import { State as stateRoot } from "..";
import {
  SET_APPOINTMENTS_AGENDA,
  SET_PROFESSIONAL_AGENDA,
  SET_PROFESSIONAL_OPTIONS,
  SET_SCHEDULES_AGENDA,
} from "./mutation-types";
import {
  professionalService,
  scheduleService,
  appointmentService,
} from "@/domain/services";
import { OptionSelect } from "@/presentation/models";
import { AppointmentModel, ScheduleModel } from "@/domain/models";
import { DaySchedule, WeekDaySchedules } from "../models";

import { startOfWeek, formatISO, addDays } from "date-fns";

export type StateAgenda = {
  professional_id?: number;
  professional_options: OptionSelect[];
  schedules: ScheduleModel[];
  appointments: AppointmentModel[];
};

const calcHeightSchedule = function (start_time?: number, end_time?: number) {
  if (!start_time || !end_time) return 5;
  const height = (end_time - start_time) / 10;
  return height < 5 ? 5 : height;
};

const sortDaySchedules = function (a: DaySchedule, b: DaySchedule) {
  const diff = a.start_time - b.start_time;
  if (diff === 0) {
    if (a.end_time === undefined) return -1;
    if (b.end_time === undefined) return 1;
    return a.end_time - b.end_time;
  }
  return diff;
};

export const AgendaModule: Module<StateAgenda, stateRoot> = {
  namespaced: true,
  state: {
    professional_options: [],
    schedules: [],
    appointments: [],
  },
  getters: {
    getWeek(state, _, rootState): WeekDaySchedules {
      const current_date = rootState.calendar.current_date;

      const schedules = state.schedules;
      const appointments = state.appointments;

      const start_week = startOfWeek(current_date);
      const day_schedules: WeekDaySchedules = {};

      for (const sc of schedules) {
        if (day_schedules[sc.week_day] === undefined)
          day_schedules[sc.week_day] = [];
        day_schedules[sc.week_day].push({
          key: sc.id.toString() + "sc",
          schedule_id: sc.id,
          date: addDays(start_week, (sc.week_day + 1) % 6),
          start_time: sc.start_time,
          end_time: sc.end_time,
          height: calcHeightSchedule(sc.start_time, sc.end_time),
          appointments: [],
          max_visits: sc.max_visits,
          specialty: sc.specialty_description,
        });
      }

      for (const dwk in day_schedules) {
        const week_date_iso = formatISO(
          addDays(start_week, (Number(dwk) + 1) % 7),
          { representation: "date" }
        );
        const day_appointments = appointments
          .filter((a) => a.scheduled_day === week_date_iso)
          .map((a) => ({
            key: a.id.toString() + "ap",
            appointment_id: a.id,
            start_time: a.start_time,
            end_time: a.end_time,
            specialty: a.specialty_description,
            patient: a.patient_name,
            height: calcHeightSchedule(a.start_time, a.end_time),
          }));
        for (const dap of day_appointments) {
          const in_schedule = day_schedules[dwk].find(
            (ds) =>
              ds.appointments !== undefined &&
              dap.start_time >= ds.start_time &&
              ds.end_time &&
              dap.start_time < ds.end_time
          );
          if (in_schedule && in_schedule.appointments)
            in_schedule.appointments = [...in_schedule.appointments, dap].sort(
              sortDaySchedules
            );
          else day_schedules[dwk].push(dap);
        }
      }

      for (const ds in day_schedules)
        day_schedules[ds] = day_schedules[ds].sort(sortDaySchedules);

      return day_schedules;
    },
  },
  mutations: {
    [SET_PROFESSIONAL_OPTIONS](state, options: OptionSelect[]) {
      state.professional_options = options;
    },
    [SET_PROFESSIONAL_AGENDA](state, professional_id: number) {
      state.professional_id = professional_id;
    },
    [SET_SCHEDULES_AGENDA](state, schedules: ScheduleModel[]) {
      state.schedules = schedules;
    },
    [SET_APPOINTMENTS_AGENDA](state, appointments: AppointmentModel[]) {
      state.appointments = appointments;
    },
  },
  actions: {
    populateProfessionalOptions({ commit }: { commit: Commit }) {
      return professionalService.load({ limit: 50 }).then((professionals) => {
        const professional_options: OptionSelect[] = professionals.map((p) => ({
          value: p.id,
          label: p.name,
        }));

        const agenda = !this.state.auth.current_user?.admin && this.state.auth.current_user
            ? this.state.auth.current_user.id
            : professional_options[0]?.value;

        commit(SET_PROFESSIONAL_OPTIONS, professional_options);
        commit( SET_PROFESSIONAL_AGENDA, agenda);
      });
    },
    setProfessional(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      professional_id
    ) {
      commit(SET_PROFESSIONAL_AGENDA, professional_id);
      dispatch("updateAgenda", professional_id);
    },
    loadSchedules({ commit }: { commit: Commit }, professional_id: number) {
      return scheduleService
        .load({
          professional_id: professional_id,
        })
        .then((schedules) => {
          commit(SET_SCHEDULES_AGENDA, schedules);
        });
    },
    loadAppointments({ commit }: { commit: Commit }, professional_id: number) {
      return appointmentService
        .load({ professional_id, limit: 5000 })
        .then((appointments) => {
          commit(SET_APPOINTMENTS_AGENDA, appointments);
        });
    },
    updateAgenda(
      { dispatch }: { dispatch: Dispatch },
      professional_id: number
    ) {
      if (!this.state.agenda.professional_id) return;

      dispatch(
        "loadSchedules",
        professional_id || this.state.agenda.professional_id
      );
      dispatch(
        "loadAppointments",
        professional_id || this.state.agenda.professional_id
      );
    },
  },
};
