<template>
  <div class="wrap-content">
    <h1 class="content-title">Histórico Paciente</h1>
    <div class="patient-history scrolled">
      <div
        :class="{
          'patient-appointment': true,
          'current-appointment': app.id == appointment_id,
        }"
        v-for="app in appointments"
        :key="app.id"
        @click="updateAppointmentRecord(app)"
      >
        <strong>{{
          showAppointmentDateTime(
            app.scheduled_day,
            app.start_time,
            app.end_time
          )
        }}</strong>
        <div class="detail-appointment">
          <span>{{ app.professional_name }}</span>
          <span>{{ app.specialty_description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { appointmentService } from "@/domain/services";
import { AppointmentModel } from "@/domain/models";
import { AppointmentBody } from "@/domain/params";
import { WeekDay, Month, RECORD_TAB } from "@/common/constants";

import hash from "object-hash";
import { parseISO } from "date-fns";

type ComponentData = {
  appointments: AppointmentModel[];
};

export default defineComponent({
  name: "PatientHistory",
  data(): ComponentData {
    return {
      appointments: [],
    };
  },
  async created() {
    appointmentService
      .load({ patient_id: this.patient_id })
      .then((appointments) => {
        this.appointments = appointments.reverse();
      });
  },
  computed: {
    ...mapState("record", ["patient_id", "appointment_id"]),
  },
  methods: {
    ...mapActions({
      setRecordAppointmentId: "record/setRecordAppointmentId",
      setRecordAppointment: "record/setRecordAppointment",
      setHashAppointment: "record/setHashAppointment",
      setActiveTab: "record/setActiveTab",
    }),
    updateAppointmentRecord(appointment: AppointmentModel) {
      const body: AppointmentBody = {};

      body.acting_id = appointment.acting_id;
      body.patient_id = appointment.patient_id;
      body.scheduled_day = parseISO(appointment.scheduled_day);

      body.complaint = appointment.complaint || "";
      body.prescription = appointment.prescription || "";
      body.start_time = appointment.start_time;
      body.end_time = appointment.end_time;

      this.setRecordAppointmentId(appointment.id)
      this.setRecordAppointment(body);
      this.setHashAppointment(hash(body));
      this.setActiveTab(RECORD_TAB.appointment)
    },
    showAppointmentDateTime(
      scheduled_day: string,
      start_time: number,
      end_time?: number
    ): string {
      let result = "";
      const scheduled_date = parseISO(scheduled_day);

      result = `${
        WeekDay[scheduled_date.getDay()]
      } ${scheduled_date.getDate()} de ${Month[scheduled_date.getMonth()][0]} `;

      if (end_time === undefined || end_time === null)
        result = result + " as " + start_time.toClockTime();
      else
        result =
          result +
          " das " +
          start_time.toClockTime() +
          " até " +
          end_time?.toClockTime();

      return result;
    },
  },
});
</script>

<style scoped>
.wrap-content {
  display: flex;
  flex-direction: column;
  padding: 1em;
  height: 100%;
}

.content-title {
  font-size: 1.5em;
  padding-bottom: 6px;
  color: var(--font-main);
  border-bottom: 1px solid rgb(174, 174, 174);
  text-align: center;
  margin-bottom: 0.4em;
}

.patient-history {
  background-color: rgba(201, 201, 201, 0.261);
  border-radius: 0.5rem;
  padding: 0.3em 0.3em 0.3em 0.6em;
  flex-grow: 1;
  flex-basis: 0;
}

.patient-appointment {
  width: 100%;
  margin: 0.5em 0;
  background-color: #47b5ff;
  border-radius: 0.4em;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0.4em;
  color: rgb(45, 45, 45);
}

.patient-appointment:hover {
  background-color: #3babf6;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.patient-appointment > strong {
  display: block;
  text-align: center;
  margin-bottom: 6px;
}

.patient-appointment .detail-appointment {
  display: flex;
  justify-content: space-between;
  padding: 0 1em;
}

.current-appointment {
  cursor: initial;
  pointer-events: none;
  background-color: #7e98be;
}
</style>
