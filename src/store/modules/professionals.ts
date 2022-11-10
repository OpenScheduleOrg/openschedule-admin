import { Module, Commit } from "vuex";
import { State as stateRoot } from "..";
import {
  END_LOADING,
  RESET_PROFESSIONALS_STATE,
  SET_PROFESSIONALS,
} from "./mutation-types";
import { ProfessionalModel } from "@/domain/models";
import { professionalService } from "@/domain/services";

export type StateProfessionals = {
  professionals: ProfessionalModel[];
  page: number;
  items_per_page: number;
  isLoading: boolean;
};

export const ProfessionalsModule: Module<StateProfessionals, stateRoot> = {
  namespaced: true,
  state: {
    professionals: [],
    page: 1,
    items_per_page: 20,
    isLoading: true,
  },
  mutations: {
    [END_LOADING](state) {
      state.isLoading = false;
    },
    [SET_PROFESSIONALS](state, professionals: ProfessionalModel[]) {
      state.professionals = professionals;
    },
    [RESET_PROFESSIONALS_STATE](state) {
      state.professionals = [];
      state.page = 1;
      state.isLoading = true;
    },
  },
  actions: {
    load({ commit }: { commit: Commit }) {
      commit(RESET_PROFESSIONALS_STATE);
      return professionalService.load().then((professionals) => {
        commit(END_LOADING);
        commit(SET_PROFESSIONALS, professionals);
      });
    },
  },
};
