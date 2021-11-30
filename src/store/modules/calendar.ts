import { Commit, Module } from "vuex";
import { State as stateRoot } from "..";
import {
  SET_PERIOD,
  SET_CURRENT_DATE,
  SET_OFFSET_MONTH,
} from "./mutation-types";
import { Month, Period } from "@/constants";
import { monthBetween, setPeriod, getPeriod } from "@/utils";

import { SixWeeksDay } from "@/interfaces/store";
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
      const month = state.current_date.getMonth();
      const day = state.current_date.getDate();
      const year = state.current_date.getFullYear();

      if (state.period == Period.Day) {
        return day + " de " + Month[month][0] + " de " + year;
      }

      const other_month = monthBetween(state.current_date);

      if (other_month !== null) {
        if (other_month === 0)
          return (
            Month[month][1] +
            " " +
            year +
            " - " +
            Month[other_month][1] +
            " " +
            (year + 1)
          );
        else if (month == 0)
          return (
            Month[other_month][1] +
            " " +
            (year - 1) +
            " - " +
            Month[month][1] +
            " " +
            year
          );
        else if (month > other_month) {
          return Month[other_month][1] + " - " + Month[month][1] + " " + year;
        }
        return Month[month][1] + " - " + Month[other_month][1] + " " + year;
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
    getSixWeeks(state) {
      let i = 0;
      const days: SixWeeksDay[] = [];

      const start_month = new Date(
        state.current_date.getFullYear(),
        state.current_date.getMonth() + state.offset_month,
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
          isSelected: false,
        };

      console.log(start_month);
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
        };

      const end_month = new Date(
        start_month.getFullYear(),
        start_month.getMonth() + 1,
        1
      );
      for (let j = 0; i < 7 * 6; j++)
        days[i++] = {
          day: end_month.getDate() + j,
          month: end_month.getMonth() + 1,
          year: end_month.getFullYear(),
          outMonth: true,
          isToday:
            today.getDate() == end_month.getDate() + j &&
            today.getMonth() == end_month.getMonth() &&
            today.getFullYear() == end_month.getFullYear(),
          isSelected: false,
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
