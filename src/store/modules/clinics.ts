import { Module, Commit } from "vuex";
import { State as stateRoot } from "..";
import {
  END_LOADING,
  RESET_CLINICS_STATE,
  SET_CLINICS,
} from "./mutation-types";
import { ClinicModel } from "@/domain/models";
import { clinicService } from "@/domain/services";

export type StateClinics = {
  clinics: ClinicModel[];
  page: number;
  items_per_page: number;
  isLoading: boolean;
};

export const ClinicsModule: Module<StateClinics, stateRoot> = {
  namespaced: true,
  state: {
    clinics: [],
    page: 1,
    items_per_page: 20,
    isLoading: true,
  },
  mutations: {
    [END_LOADING](state) {
      state.isLoading = false;
    },
    [SET_CLINICS](state, clinics: ClinicModel[]) {
      state.clinics = clinics;
    },
    [RESET_CLINICS_STATE](state) {
      state.clinics = [];
      state.page = 1;
      state.isLoading = true;
    },
  },
  actions: {
    load({ commit }: { commit: Commit }) {
      commit(RESET_CLINICS_STATE);
      return clinicService.load().then((clinics) => {
        commit(END_LOADING);
        commit(SET_CLINICS, clinics);
      });
    },
  },
};
