import { Commit, Module } from "vuex";
import { State as stateRoot } from "..";
import {
  SET_PERIOD,
  SET_CURRENT_DATE,
  SET_OFFSET_MONTH,
} from "./mutation-types";
import { Month, Period, Week } from "@/constants";
import { monthBetween, setPeriod, getPeriod } from "@/utils";

import { SixWeeksDay } from "@/interfaces/store";
import { Horario } from "@/interfaces";
const today = new Date();

export interface StateCalendar {
  period: Period;
  current_date: Date;
  offset_month: number;
}

const initialPeriod = getPeriod();

const calendar: Module<StateCalendar, stateRoot> = {
  namespaced: true,
  state: {
    period: initialPeriod,
    current_date: today,
    offset_month: 0,
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
    getSixWeeks(state, getteres, rootState) {
      let i = 0;
      const current_date = state.current_date;
      const days: SixWeeksDay[] = [];
      const valid_week_days: number[] = rootState.clinica.horarios.map(
        (h) => h.dia_semana
      );

      const start_month = new Date(
        current_date.getFullYear(),
        current_date.getMonth() + state.offset_month,
        1
      );
      const before_month = start_month.addDays(-1);

      for (let j = start_month.getDay() - 1; j >= 0; j--)
        days[i++] = {
          day: before_month.getDate() - j,
          month: before_month.getMonth() + 1,
          year: before_month.getFullYear(),
          outMonth: true,
          isToday:
            today.getDate() == before_month.getDate() - j &&
            today.getMonth() == before_month.getMonth() &&
            today.getFullYear() == before_month.getFullYear(),
          isSelected:
            state.current_date.getDate() == before_month.getDate() + j &&
            state.current_date.getMonth() == before_month.getMonth() &&
            state.current_date.getFullYear() == before_month.getFullYear(),
          isValidDay: valid_week_days.includes((i - 1) % 7),
        };

      for (let j = 0; j < start_month.monthSize(); j++)
        days[i++] = {
          day: start_month.getDate() + j,
          month: start_month.getMonth() + 1,
          year: start_month.getFullYear(),
          outMonth: false,
          isToday:
            today.getDate() == start_month.getDate() + j &&
            today.getMonth() == start_month.getMonth() &&
            today.getFullYear() == start_month.getFullYear(),
          isSelected:
            state.current_date.getDate() == start_month.getDate() + j &&
            state.current_date.getMonth() == start_month.getMonth() &&
            state.current_date.getFullYear() == start_month.getFullYear(),
          isValidDay: valid_week_days.includes((i - 1) % 7),
        };

      const after_month = new Date(
        start_month.getFullYear(),
        start_month.getMonth() + 1,
        1
      );
      for (let j = 0; i < 7 * 6; j++)
        days[i++] = {
          day: after_month.getDate() + j,
          month: after_month.getMonth() + 1,
          year: after_month.getFullYear(),
          outMonth: true,
          isToday:
            today.getDate() == after_month.getDate() + j &&
            today.getMonth() == after_month.getMonth() &&
            today.getFullYear() == after_month.getFullYear(),
          isSelected:
            state.current_date.getDate() == after_month.getDate() + j &&
            state.current_date.getMonth() == after_month.getMonth() &&
            state.current_date.getFullYear() == after_month.getFullYear(),
          isValidDay: valid_week_days.includes((i - 1) % 7),
        };

      return days;
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
  mutations: {
    [SET_PERIOD](state, period: Period) {
      setPeriod(period);
      state.period = period;
    },
    [SET_CURRENT_DATE](state, date: Date) {
      state.offset_month = 0;
      state.current_date = date;
    },
    [SET_OFFSET_MONTH](state, offset) {
      state.offset_month = state.offset_month + offset;
    },
  },
  actions: {
    setOffsetMonth({ commit }: { commit: Commit }, offset: -1 | 1) {
      commit(SET_OFFSET_MONTH, offset);
    },
  },
};

export default calendar;
