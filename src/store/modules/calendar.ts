import { Commit, Dispatch, Module } from "vuex";
import { State as stateRoot } from "..";
import {
  SET_PERIOD,
  SET_CURRENT_DATE,
  SET_OFFSET_MONTH,
  SET_NOW,
  SET_OFFSET_MONTH_PICKER,
} from "./mutation-types";
import { Month, Period, Week } from "@/constants";
import { monthBetween, setPeriod, getPeriod } from "@/utils";

import { DayDetails, SixWeeksDay } from "@/interfaces/store";
import { Consulta, Horario } from "@/interfaces";
const today = new Date();

export interface StateCalendar {
  period: Period;
  current_date: Date;
  offset_month: number;
  offset_month_picker: number;
  now: Date;
}

const initialPeriod = getPeriod();

const calendar: Module<StateCalendar, stateRoot> = {
  namespaced: true,
  state: {
    period: initialPeriod,
    current_date: today,
    offset_month: 0,
    offset_month_picker: 0,
    now: new Date(),
  },
  mutations: {
    [SET_PERIOD](state, period: Period) {
      setPeriod(period);
      state.period = period;
    },
    [SET_CURRENT_DATE](state, new_current_date: Date) {
      state.offset_month = 0;
      state.offset_month_picker = 0;
      state.current_date = new_current_date;
    },
    [SET_OFFSET_MONTH](state, offset) {
      state.offset_month = state.offset_month + offset;
    },
    [SET_OFFSET_MONTH_PICKER](state, offset) {
      state.offset_month_picker = state.offset_month_picker + offset;
    },
    [SET_NOW](state) {
      state.now = new Date();
    },
  },
  actions: {
    setCurrentDate(
      {
        commit,
        dispatch,
      }: {
        commit: Commit;
        dispatch: Dispatch;
      },
      new_current_date: Date
    ) {
      commit(SET_CURRENT_DATE, new_current_date);
      dispatch("clinica/setConsultas", null, { root: true });
    },
    setPeriod(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      period
    ) {
      commit(SET_PERIOD, period);
      dispatch("clinica/updateConsultas", null, { root: true });
    },
    setNow({ commit }: { commit: Commit }) {
      commit(SET_NOW);
    },
    setOffsetMonth(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      offset: -1 | 1
    ) {
      commit(SET_OFFSET_MONTH, offset);
      dispatch("updateConsultas", offset);
    },
    setOffsetMonthPicker(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      offset: -1 | 1
    ) {
      commit(SET_OFFSET_MONTH_PICKER, offset);
      dispatch("updateConsultas", offset);
    },
    updateConsultas(
      {
        dispatch,
        state,
      }: {
        dispatch: Dispatch;
        state: StateCalendar;
      },
      offset: number
    ) {
      const current_date = new Date(
        state.current_date.getFullYear(),
        state.current_date.getMonth(),
        state.current_date.getDate()
      );

      current_date.setMonth(current_date.getMonth() + offset);
      const date_start = current_date.addDays(-7);
      const date_end = current_date.addDays(40);
      dispatch(
        "clinica/setConsultas",
        { date_start, date_end },
        { root: true }
      );
    },
  },
  getters: {
    getDateString(state) {
      let other_date: Date;
      const month = state.current_date.getMonth();
      const day = state.current_date.getDate();
      const year = state.current_date.getFullYear();

      if (state.period == Period.Day) {
        return day + " de " + Month[month][0] + " de " + year;
      }

      if (state.period == Period.Agenda) {
        other_date = new Date(year, month + 6, day);
      } else {
        other_date = monthBetween(state.current_date);
      }

      if (
        other_date.getMonth() !== month ||
        other_date.getFullYear() !== year
      ) {
        if (other_date.getFullYear() !== year)
          return (
            Month[month][1] +
            " " +
            year +
            " - " +
            Month[other_date.getMonth()][1] +
            " " +
            other_date.getFullYear()
          );
        else if (year > other_date.getFullYear())
          return (
            Month[other_date.getMonth()][1] +
            " " +
            other_date.getFullYear() +
            " - " +
            Month[month][1] +
            " " +
            year
          );
        else if (month > other_date.getMonth()) {
          return (
            Month[other_date.getMonth()][1] +
            " - " +
            Month[month][1] +
            " " +
            year
          );
        }
        return (
          Month[month][1] + " - " + Month[other_date.getMonth()][1] + " " + year
        );
      }

      return Month[month][0] + " de " + year;
    },
    getDatePrev(state) {
      const offset = state.period == Period.Week ? -7 : -1;
      const date = state.current_date.addDays(offset);

      return date;
    },
    getDateNext(state) {
      const offset = state.period == Period.Week ? 7 : 1;
      const date = state.current_date.addDays(offset);
      return date;
    },
    isActivedPeriod: (state) => (p: Period) => {
      return state.period == p;
    },
    isToday(state) {
      const today = new Date();

      return (
        state.current_date.getDate() === today.getDate() &&
        state.current_date.getMonth() === today.getMonth() &&
        state.current_date.getFullYear() === today.getFullYear()
      );
    },
    getSixWeeks(state, getters, rootState, rootGetters) {
      const current_date = state.current_date;
      const today = new Date();
      const days: SixWeeksDay[] = [];

      const start_month = new Date(
        current_date.getFullYear(),
        current_date.getMonth() + state.offset_month,
        1
      );
      let day_details: {
        consultas: Consulta[];
        hs_free: DayDetails;
      };

      let d: Date = start_month.addDays(-start_month.getDay() - 1);
      for (let i = 0; i < 42; i++) {
        d = d.addDays(1);
        day_details = rootGetters["clinica/getDayDetails"](
          d.toISODate,
          d.getDay()
        );
        days[i] = {
          day: d.getDate(),
          month: d.getMonth(),
          year: d.getFullYear(),
          outMonth: d.getMonth() != start_month.getMonth(),
          isToday:
            today.getDate() == d.getDate() &&
            today.getMonth() == d.getMonth() &&
            today.getFullYear() == d.getFullYear(),
          isSelected:
            state.current_date.getDate() == d.getDate() &&
            state.current_date.getMonth() == d.getMonth() &&
            state.current_date.getFullYear() == d.getFullYear(),
          isValidDay:
            day_details.consultas.length > 0 || day_details.hs_free.length > 0,
          consultas: day_details.consultas,
          hs_free: day_details.hs_free,
        };
      }

      return days;
    },
    getDatePickerSixWeeks(state, getters, rootState, rootGetters) {
      const current_date = state.current_date;
      const today = new Date();
      const days: SixWeeksDay[] = [];
      const date_picker: {
        current_month?: string;
        current_week_day?: string;
        current_year?: number;
        current_day?: number;
        offset_month?: string;
        offset_year?: number;
        six_weeks?: SixWeeksDay[];
      } = {
        current_month: Month[current_date.getMonth()][1],
        current_week_day: Week[current_date.getDay()][1],
        current_day: current_date.getDate(),
        current_year: current_date.getFullYear(),
      };

      const start_month = new Date(
        current_date.getFullYear(),
        current_date.getMonth() + state.offset_month_picker,
        1
      );

      date_picker.offset_month = Month[start_month.getMonth()][0];
      date_picker.offset_year = start_month.getFullYear();

      let day_details: {
        consultas: Consulta[];
        hs_free: DayDetails;
      };

      let d: Date = start_month.addDays(-start_month.getDay() - 1);
      for (let i = 0; i < 42; i++) {
        d = d.addDays(1);
        day_details = rootGetters["clinica/getDayDetails"](
          d.toISODate,
          d.getDay()
        );
        days[i] = {
          day: d.getDate(),
          month: d.getMonth(),
          year: d.getFullYear(),
          outMonth: d.getMonth() != start_month.getMonth(),
          isToday:
            today.getDate() == d.getDate() &&
            today.getMonth() == d.getMonth() &&
            today.getFullYear() == d.getFullYear(),
          isSelected:
            state.current_date.getDate() == d.getDate() &&
            state.current_date.getMonth() == d.getMonth() &&
            state.current_date.getFullYear() == d.getFullYear(),
          isValidDay:
            day_details.consultas.length > 0 || day_details.hs_free.length > 0,
          consultas: day_details.consultas,
          hs_free: day_details.hs_free,
        };
      }

      date_picker.six_weeks = days;
      return date_picker;
    },

    getMonthOffset(state) {
      const offset_date = new Date(state.current_date.valueOf());

      offset_date.setMonth(offset_date.getMonth() + state.offset_month);

      return (
        Month[offset_date.getMonth()][0] + " de " + offset_date.getFullYear()
      );
    },

    getWeekDays(state, getters, rootState) {
      const week: Array<{
        day: number;
        month: number;
        year: number;
        isToday: boolean;
        weekDay: string;
      }> = [];
      const today = new Date();
      const horarios: (Horario | { dia_semana: number })[] =
        (rootState.clinica.horarios.length && rootState.clinica.horarios) || [];

      const current_date = state.current_date;
      const weekDay = current_date.getDay();
      let week_date;
      if (horarios.length == 0)
        for (let i = 0; i < 7; i++) horarios.push({ dia_semana: i });

      for (const h of horarios) {
        week_date = current_date.addDays(h.dia_semana - weekDay);
        week.push({
          day: week_date.getDate(),
          month: week_date.getMonth(),
          year: week_date.getFullYear(),
          isToday:
            week_date.getDate() == today.getDate() &&
            week_date.getMonth() == today.getMonth() &&
            week_date.getFullYear() == today.getFullYear(),
          weekDay: Week[week_date.getDay()][1],
        });
      }

      return week;
    },
  },
};

export default calendar;
