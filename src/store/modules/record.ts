import { AppointmentBody } from "@/domain/params";
import { Commit, Module } from "vuex";
import { State as stateRoot } from "..";
import {
  RESET_STATE_RECORD,
  INIT_STATE_RECORD,
  INIT_UPDATE_RECORD,
  UPDATE_RECORD_ACTUATIONS,
} from "./mutation-types";

import { actingService } from "@/domain/services";
import { ActingModel } from "@/domain/models";

export type StateRecord = {
  showModal: boolean;
  professional_id?: number;
  appointment_id?: number;
  appointment?: AppointmentBody;
  actuations: ActingModel[];
};

export const RecordModule: Module<StateRecord, stateRoot> = {
  namespaced: true,
  state: {
    showModal: false,
    appointment_id: undefined,
    appointment: undefined,
    actuations: [],
  },
  getters: {
    actuations_options(state) {
      return state.actuations.map((a: ActingModel) => ({
        label: a.professional_name + " - " + a.specialty_description,
        value: a.id,
      }));
    },
  },
  mutations: {
    [RESET_STATE_RECORD](state) {
      state.showModal = false;
      state.appointment = undefined;
      state.appointment_id = undefined;
    },
    [INIT_STATE_RECORD](state, new_appointment: AppointmentBody) {
      state.showModal = true;
      state.appointment = new_appointment;
    },
    [INIT_UPDATE_RECORD](state, appointment_id: number) {
      state.showModal = true;
      state.appointment_id = appointment_id;
    },
    [UPDATE_RECORD_ACTUATIONS](state, actuations: ActingModel[]) {
      state.actuations = actuations;
    },
  },
  actions: {
    resetAndClose({ commit }: { commit: Commit }) {
      commit(RESET_STATE_RECORD);
    },
    initRecord(
      { commit }: { commit: Commit },
      new_appointment: AppointmentBody
    ) {
      commit(INIT_STATE_RECORD, new_appointment);
    },
    initUpdateRecord({ commit }: { commit: Commit }, appointment_id: number) {
      commit(INIT_UPDATE_RECORD, appointment_id);
    },
    updateActuationsOptions({ commit }: { commit: Commit }) {
      actingService.load().then((actuations) => {
        commit(UPDATE_RECORD_ACTUATIONS, actuations);
      });
    },
  },
};
