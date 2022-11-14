import { Module, Commit } from "vuex";
import { State as stateRoot } from "..";
import {
  END_LOADING,
  RESET_SCHEDULES_STATE,
  SET_SCHEDULES,
} from "./mutation-types";
import { ScheduleModel } from "@/domain/models";
import { scheduleService } from "@/domain/services";

export type StateSchedules = {
  schedules: ScheduleModel[];
  page: number;
  items_per_page: number;
  isLoading: boolean;
};

export const SchedulesModule: Module<StateSchedules, stateRoot> = {
  namespaced: true,
  state: {
    schedules: [],
    page: 1,
    items_per_page: 20,
    isLoading: true,
  },
  mutations: {
    [END_LOADING](state) {
      state.isLoading = false;
    },
    [SET_SCHEDULES](state, schedules: ScheduleModel[]) {
      state.schedules = schedules;
    },
    [RESET_SCHEDULES_STATE](state) {
      state.schedules = [];
      state.page = 1;
      state.isLoading = true;
    },
  },
  actions: {
    load({ commit }: { commit: Commit }, professional_id: number) {
      commit(RESET_SCHEDULES_STATE);
      return scheduleService
        .load({
          professional_id,
        })
        .then((schedules) => {
          commit(END_LOADING);
          commit(SET_SCHEDULES, schedules);
        });
    },
  },
};
