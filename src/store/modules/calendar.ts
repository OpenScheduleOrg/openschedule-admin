import { Commit, Dispatch, Module } from "vuex";
import { State as stateRoot } from "..";
import {
  SET_PERIOD,
  SET_CURRENT_DATE,
  SET_OFFSET_MONTH,
  SET_NOW,
  SET_OFFSET_MONTH_PICKER,
} from "./mutation-types";
import { Month, Period, WeekDayShort } from "@/common/constants";
import { monthBetween, setPeriod, getPeriod } from "@/utils";
import { Consulta, DayDetail, SixWeeksDay } from "@/store/models";

import { startOfWeek, addDays, formatISO } from "date-fns";

const today = new Date();

export interface StateCalendar {
  period: Period;
  current_date: Date;
  offset_month: number;
  offset_month_picker: number;
  now: Date;
}

const initialPeriod = getPeriod();

export const CalendarModule: Module<StateCalendar, stateRoot> = {
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
      dispatch("agenda/updateAgenda", null, { root: true });
    },
    setPeriod(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      period
    ) {
      commit(SET_PERIOD, period);
      dispatch("agenda/updateAgenda", null, { root: true });
    },
    setNow({ commit }: { commit: Commit }) {
      commit(SET_NOW);
    },
    setOffsetMonth({ commit }: { commit: Commit }, offset: -1 | 1) {
      commit(SET_OFFSET_MONTH, offset);
    },
    setOffsetMonthPicker({ commit }: { commit: Commit }, offset: -1 | 1) {
      commit(SET_OFFSET_MONTH_PICKER, offset);
    },
  },
  getters: {
    getDateString(state) {
      const month = state.current_date.getMonth();
      const day = state.current_date.getDate();
      const year = state.current_date.getFullYear();

      if (state.period == Period.Day)
        return day + " de " + Month[month][0] + " de " + year;

      const other_date = monthBetween(state.current_date);

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
      const date = addDays(state.current_date, offset);

      return date;
    },
    getDateNext(state) {
      const offset = state.period == Period.Week ? 7 : 1;
      const date = addDays(state.current_date, offset);
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
    getSixWeeks(state, _, rootState) {
      const current_date = state.current_date;
      const today = new Date();
      const days: any[] = [];

      const start_month = new Date(
        current_date.getFullYear(),
        current_date.getMonth() + state.offset_month,
        1
      );
      const wd_schedules = new Set(
        rootState.agenda.schedules.map((s) => s.week_day)
      );

      let d: Date = addDays(start_month, -start_month.getDay() - 1);
      for (let i = 0; i < 42; i++) {
        d = addDays(d, 1);
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
          valid_day: wd_schedules.has((d.getDay() + 6) % 7),
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
        current_week_day: WeekDayShort[current_date.getDay()][1],
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
        hs_free: DayDetail[];
      };

      let d: Date = addDays(start_month, -start_month.getDay() - 1);
      for (let i = 0; i < 42; i++) {
        d = addDays(d, 1);
        day_details = rootGetters["clinica/getDayDetails"](
          formatISO(d, { representation: "date" }),
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
          valid_day:
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

    getWeekDays(state, _, rootState) {
      const week: Array<{
        day: number;
        month: number;
        year: number;
        isToday: boolean;
        weekDay: string;
      }> = [];
      const today = new Date();
      const professional_week = new Set(
        rootState.agenda.schedules.map((s) => (s.week_day + 1) % 7)
      );

      const current_date = state.current_date;
      const start_week = startOfWeek(current_date);
      let week_date;
      if (professional_week.size <= 0)
        for (let i = 0; i < 7; i++) professional_week.add(i);

      for (const wd of professional_week) {
        week_date = addDays(start_week, wd);
        week.push({
          day: week_date.getDate(),
          month: week_date.getMonth(),
          year: week_date.getFullYear(),
          isToday:
            week_date.getDate() == today.getDate() &&
            week_date.getMonth() == today.getMonth() &&
            week_date.getFullYear() == today.getFullYear(),
          weekDay: WeekDayShort[week_date.getDay()],
        });
      }

      return week;
    },
  },
};
