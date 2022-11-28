import { Commit, Module } from "vuex";
import { State as stateRoot } from "..";
import { UPDATE_CACHE_PATIENTS } from "./mutation-types";

import { PatientModel } from "@/domain/models";
import { patientService } from "@/domain/services";

export type StateCache = {
  patients: PatientModel[];
};

export const CacheModule: Module<StateCache, stateRoot> = {
  namespaced: true,
  state: {
    patients: [],
  },
  mutations: {
    [UPDATE_CACHE_PATIENTS](state, patients: PatientModel[]) {
      state.patients = patients;
    },
  },
  actions: {
    updateCachePatients({ commit }: { commit: Commit }) {
      patientService.load().then((patients) => {
        commit(UPDATE_CACHE_PATIENTS, patients);
      });
    },
  },
};
