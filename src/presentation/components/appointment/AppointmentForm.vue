<template>
  <div class="some-padding">
    <h1 class="form-title">{{ !appointment_id ? "Nova " : "" }}Consulta</h1>
    <Form class="form-wrap">
      <div class="form-dynamic-row form-group-col-2">
        <select-option
          :name="'acting_id'"
          :label="'Profissional'"
          :readonly="true"
          :options="actuations_options"
          :empty_message="'Cadastre um professional'"
          v-model="body.acting_id"
          @updateValidation="updateValidation"
        />
        <select-search-patient
          :name="'patient_id'"
          :label="'Paciente'"
          :empty_message="'Nenhum um paciente encontrado'"
          v-model="body.patient_id"
          :required="true"
          :readonly="!!appointment_id"
          @updateValidation="updateValidation"
        />
      </div>
      <div class="form-dynamic-row form-group-col-3">
        <date-picker
          :name="'scheduled_day'"
          :label="'Data Marcada'"
          :required="true"
          v-model="body.scheduled_day"
          @updateValidation="updateValidation"
        ></date-picker>
        <time-picker
          :name="'start_time'"
          :label="'Início atendimento'"
          v-model="body.start_time"
          :required="true"
          @updateValidation="updateValidation"
        />
        <time-picker
          v-model="body.end_time"
          :name="'end_time'"
          :label="'Fim atendimento'"
          :custom_clock="clocks.end"
          :disabled="!field_valid.start_time"
          @updateValidation="updateValidation"
        />
      </div>
      <div class="form-dynamic-row form-group-col-1">
        <text-area v-model="body.complaint" :label="'Queixa/Anamnese'"> </text-area>
      </div>
      <div class="form-dynamic-row form-group-col-1">
        <text-area v-model="body.prescription" :label="'Receita'"> </text-area>
      </div>
    </Form>
    <div class="operations-wrap">
      <button
        :class="{
          btn: true,
          'btn-update': !isLoading && isFormValid && !!appointment_id,
          'btn-new': !isLoading && isFormValid && !!!appointment_id,
        }"
        :disabled="!isFormValid || isLoading"
        @click="save()"
      >
        Salvar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Form,
  SelectOption,
  DatePicker,
  TimePicker,
  TextArea,
  SelectSearchPatient,
} from "../util";
import { defineComponent } from "vue";

import { AppointmentBody } from "@/domain/params";
import { ScheduleModel } from "@/domain/models";
import { mapActions, mapState, mapGetters } from "vuex";
import { appointmentService } from "@/domain/services";
import hash from "object-hash";
import { parseISO } from "date-fns";

type ComponentData = {
  isLoading: boolean;
  field_valid: { [field: string]: boolean };
  body: AppointmentBody;
  clocks: { end: boolean[][] };
  professional_schedules: ScheduleModel[];
  disable_watch: { [name: string]: boolean };
};

export default defineComponent({
  name: "AppointmentForm",
  components: {
    Form,
    SelectOption,
    TimePicker,
    DatePicker,
    TextArea,
    SelectSearchPatient,
  },
  data(): ComponentData {
    const appointment_id = this.$store.state.record.appointment_id;
    const patient_id = this.$store.state.record.patient_id;
    const body = { ...this.$store.state.record.appointment, patient_id };

    let end_clock: boolean[][] = [];
    if (body.start_time) this.updateClockEnd(body.start_time, end_clock);

    if (!body.acting_id)
      body.acting_id = this.$store.state.record.actuations.find(
        (a) => a.professional_id == this.$store.state.agenda.professional_id
      )?.id;

    return {
      isLoading: false,
      field_valid: {
        acting_id: !!appointment_id || !!body.acting_id,
        start_time: !!appointment_id || !!body.start_time,
        scheduled_day: !!appointment_id || !!body.scheduled_day,
        patient_id: !!appointment_id || !!patient_id,
      },
      body,
      clocks: { end: end_clock },
      professional_schedules: [],
      disable_watch: { start_time: true },
    };
  },
  async created() {
    if (this.appointment_id && !this.hash_appointment)
      await appointmentService
        .getById(this.appointment_id)
        .then((appointment) => {
          this.body.acting_id = appointment.acting_id;
          this.body.patient_id = appointment.patient_id;
          this.body.scheduled_day = parseISO(appointment.scheduled_day);

          this.body.complaint = appointment.complaint || "";
          this.body.prescription = appointment.prescription || "";
          this.body.start_time = appointment.start_time;
          this.updateClockEnd(appointment.start_time, this.clocks.end);
          this.body.end_time = appointment.end_time;

          this.setHashAppointment(hash(this.body));
        });
  },
  computed: {
    isFormValid() {
      for (let field_name in this.field_valid)
        if (!this.field_valid[field_name]) return false;
      return true;
    },
    ...mapState("record", [
      "appointment",
      "appointment_id",
      "hash_appointment",
    ]),
    ...mapGetters("record", ["actuations_options"]),
  },
  methods: {
    updateClockEnd(start_seconds: number, clock: boolean[][]): void {
      let time_seconds;
      for (let i = 0; i < 24; i++) {
        clock[i] = [];
        for (let j = 0; j < 60; j++) {
          time_seconds = i * 60 + j;
          if (time_seconds <= start_seconds) clock[i][j] = false;
          else clock[i][j] = true;
        }
      }
    },
    ...mapActions({
      updateAgenda: "agenda/updateAgenda",
      loadSchedules: "schedules/load",
      resetCloseNewAppointment: "record/resetAndClose",
      setRecordPatientId: "record/setRecordPatientId",
      setRecordAppointment: "record/setRecordAppointment",
      setHashAppointment: "record/setHashAppointment",
    }),
    updateValidation(field: string, valid: boolean) {
      this.field_valid[field] = valid;
    },
    save() {
      this.isLoading = true;
      const payload = { ...this.body };
      payload.end_time =
        payload.end_time !== undefined &&
        payload.end_time !== null &&
        payload.end_time >= 0
          ? payload.end_time
          : undefined;


      if (this.appointment_id && this.hash_appointment != hash(this.body))
        return appointmentService
          .update(this.appointment_id, payload as AppointmentBody)
          .then(() => {
            this.isLoading = false;
            this.close();
          });
      else if (!this.appointment_id)
        return appointmentService
          .create(payload as AppointmentBody)
          .then(() => {
            this.isLoading = false;
            this.close();
          });
      this.close();
    },
    close() {
      this.updateAgenda();
      this.resetCloseNewAppointment();
    },
  },
  beforeUnmount() {
    this.setRecordAppointment(this.body);
  },
  watch: {
    "body.start_time"(time_seconds: number) {
      if (this.disable_watch.start_time && this.appointment_id) {
        this.disable_watch.start_time = false;
        return;
      }
      if (time_seconds > -1) {
        this.updateClockEnd(time_seconds, this.clocks.end);
        this.body.end_time = undefined;
        this.$forceUpdate();
        return;
      }
      this.clocks.end = [];
      this.body.end_time = undefined;
    },
    "body.patient_id"(patient_id: number | undefined) {
      this.setRecordPatientId(patient_id);
    },
  },
});
</script>

<style scoped>
.form-wrap {
  background-color: rgba(201, 201, 201, 0.261);
  border-radius: 0.5rem;
  padding: 1em;
}

.operations-wrap {
  margin-top: 1rem;
  margin-bottom: 0.3rem;
}

.form-title {
  font-size: 1.5em;
  padding-bottom: 6px;
  color: var(--font-main);
  border-bottom: 1px solid rgb(174, 174, 174);
  text-align: center;
  margin-bottom: 0.4em;
}

.some-padding {
  padding: 1em;
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
</style>
