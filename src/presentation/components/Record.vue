<template>
  <transition name="modal">
    <div ref="modal_mask" @mousedown="closeModal($event)" class="modal-mask">
      <div class="modal-container">
        <a
          ref="close_modal"
          class="close-modal"
          @click="resetCloseNewAppointment()"
        >
          <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
        </a>
        <div class="app-pac-nav">
          <button
            @click="setActiveTab(RECORD_TAB.appointment)"
            :class="{
              active: active_tab == RECORD_TAB.appointment,
            }"
          >
            Consulta
          </button>
          <button
            @click="setActiveTab(RECORD_TAB.patient)"
            :class="{
              active: active_tab == RECORD_TAB.patient,
            }"
          >
            Paciente
          </button>
          <button
            @click="setActiveTab(RECORD_TAB.history)"
            :class="{
              active: active_tab == RECORD_TAB.history,
            }"
            :disabled="!patient_id"
          >
            Histórico
          </button>
        </div>
        <div class="wrap-appointment-patient">
          <appointment-form
            v-if="active_tab === RECORD_TAB.appointment"
          ></appointment-form>
          <patient-form v-if="active_tab === RECORD_TAB.patient"></patient-form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import AppointmentForm from "./appointment/AppointmentForm.vue";
import PatientForm from "./patient/PatientForm.vue";

import { RECORD_TAB } from "@/common/constants";

export default defineComponent({
  name: "Record",
  components: { AppointmentForm, PatientForm },
  data() {
    return {
      RECORD_TAB,
    };
  },
  computed: {
    ...mapState("record", ["patient_id", "active_tab"]),
  },
  methods: {
    closeModal(e: Event) {
      if (e.target == this.$refs.modal_mask) this.resetCloseNewAppointment();
    },
    ...mapActions({
      resetCloseNewAppointment: "record/resetAndClose",
      setActiveTab: "record/setActiveTab",
    }),
  },
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: opacity 0.5s ease;
  padding-top: 8vh;
}

.modal-container {
  position: relative;
  width: 42vw;
  background-color: var(--bg-light);
  border-radius: 0.3rem;
  padding: 0.4em;
  margin: 0 auto;
  height: 86vh;
}

.close-modal {
  display: block;
  position: absolute;
  cursor: pointer;
  right: 2px;
  top: -4px;
  color: rgba(31, 31, 31, 0.35);
  font-size: 1.3rem;
}

.close-modal:hover {
  transition: color 0.3s;
  color: rgba(31, 31, 31, 0.55);
}

.operations-wrap {
  margin-top: 1rem;
  margin-bottom: 0.3rem;
}

.operations-wrap .btn {
  font-size: 1rem;
  margin: 0 auto;
  width: 200px;
}

.app-pac-nav {
  display: flex;
  width: 100%;
  align-items: center;
}

.app-pac-nav > button {
  width: 9.5em;
  border-radius: 0.2em;
  margin: 2px;
  padding: 0.5em;
  font-size: 0.8em;
}

.app-pac-nav > button.active,
.app-pac-nav > button.active:hover {
  pointer-events: none;
  background-color: #0057a7;
  color: rgb(233, 233, 233);
}
</style>
