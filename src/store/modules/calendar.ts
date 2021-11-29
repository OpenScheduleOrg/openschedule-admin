import { Module } from "vuex";
import { State as stateRoot } from "..";
import { SET_PERIOD, SET_CURRENT_DATE } from "./mutation-types";
import { Month, Period } from "@/constants";
import { monthBetween, setPeriod, getPeriod } from "@/utils";

const today = new Date();

export interface StateCalendar {
  period: Period;
  current_date: Date;
}

const initialPeriod = getPeriod();

const calendar: Module<StateCalendar, stateRoot> = {
  namespaced: true,
  state: {
    period: initialPeriod,
    current_date: today,
  },
  mutations: {
    [SET_PERIOD](state, period: Period) {
      setPeriod(period);
      state.period = period;
    },
    [SET_CURRENT_DATE](state, date: Date) {
      state.current_date = date;
    },
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
      console.log(other_month);

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
      const date = state.current_date.addDays(-1);

      return date;
    },
    getDateNext(state) {
      const date = state.current_date.addDays(1);
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
  },
};

export default calendar;
