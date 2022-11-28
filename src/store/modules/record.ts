import { AppointmentBody, PatientBody } from "@/domain/params";
import { Commit, Module } from "vuex";
import { State as stateRoot } from "..";
import {
  RESET_STATE_RECORD,
  INIT_STATE_RECORD,
  SET_RECORD_PATIENT_ID,
  INIT_UPDATE_RECORD,
  UPDATE_RECORD_ACTUATIONS,
  SET_RECORD_APPOINTMENT,
  SET_RECORD_PATIENT,
  SET_HASH_APPOINTMENT,
  SET_HASH_PATIENT,
  SET_CURRENT_TAB_RECORD,
} from "./mutation-types";

import { actingService } from "@/domain/services";
import { ActingModel } from "@/domain/models";
import { RECORD_TAB } from "@/common/constants";

export type StateRecord = {
  showModal: boolean;
  active_tab: RECORD_TAB;
  professional_id?: number;
  appointment_id?: number;
  appointment?: AppointmentBody;
  patient_id?: number;
  patient?: PatientBody;
  hash_appointment?: string;
  hash_patient?: string;
  actuations: ActingModel[];
};

export const RecordModule: Module<StateRecord, stateRoot> = {
  namespaced: true,
  state: {
    showModal: false,
    active_tab: RECORD_TAB.appointment,
    appointment_id: undefined,
    appointment: undefined,
    patient_id: undefined,
    hash_appointment: undefined,
    hash_patient: undefined,
    actuations: [],
    patient: undefined,
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
      state.active_tab = RECORD_TAB.appointment;
      state.appointment = undefined;
      state.patient = undefined;
      state.appointment_id = undefined;
      state.patient_id = undefined;
      state.hash_appointment = undefined;
      state.hash_patient = undefined;
    },
    [INIT_STATE_RECORD](state, new_appointment: AppointmentBody) {
      state.showModal = true;
      state.patient = undefined;
      state.appointment = new_appointment;
    },
    [SET_CURRENT_TAB_RECORD](state, tab: RECORD_TAB) {
      state.active_tab = tab;
    },
    [SET_RECORD_PATIENT_ID](state, patient_id: number | undefined) {
      state.hash_patient = undefined;
      state.patient = undefined;
      state.patient_id = patient_id;
    },
    [INIT_UPDATE_RECORD](state, appointment_id: number) {
      state.showModal = true;
      state.hash_appointment = undefined;
      state.appointment = undefined;
      state.patient = undefined;
      state.appointment_id = appointment_id;
    },
    [UPDATE_RECORD_ACTUATIONS](state, actuations: ActingModel[]) {
      state.actuations = actuations;
    },
    [SET_RECORD_APPOINTMENT](state, appointment: AppointmentBody) {
      state.appointment = appointment;
    },
    [SET_RECORD_PATIENT](state, patient: PatientBody) {
      state.patient = patient;
    },
    [SET_HASH_APPOINTMENT](state, hash: string) {
      state.hash_appointment = hash;
    },
    [SET_HASH_PATIENT](state, hash: string) {
      state.hash_patient = hash;
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
    setActiveTab({ commit }: { commit: Commit }, tab: RECORD_TAB) {
      commit(SET_CURRENT_TAB_RECORD, tab);
    },
    setRecordPatientId(
      { commit }: { commit: Commit },
      patient_id: number | undefined
    ) {
      commit(SET_RECORD_PATIENT_ID, patient_id);
    },
    initUpdateRecord({ commit }: { commit: Commit }, appointment_id: number) {
      commit(INIT_UPDATE_RECORD, appointment_id);
    },
    updateActuationsOptions({ commit }: { commit: Commit }) {
      actingService.load().then((actuations) => {
        commit(UPDATE_RECORD_ACTUATIONS, actuations);
      });
    },
    setRecordAppointment(
      { commit }: { commit: Commit },
      appointment: AppointmentBody
    ) {
      commit(SET_RECORD_APPOINTMENT, appointment);
    },
    setRecordPatient({ commit }: { commit: Commit }, patient: PatientBody) {
      commit(SET_RECORD_PATIENT, patient);
    },
    setHashAppointment({ commit }: { commit: Commit }, hash: string) {
      commit(SET_HASH_APPOINTMENT, hash);
    },
    setHashPatient({ commit }: { commit: Commit }, hash: string) {
      commit(SET_HASH_PATIENT, hash);
    },
  },
};
