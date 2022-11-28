<template>
  <transition name="modal">
    <div ref="modal_mask" @mousedown="closeModal($event)" class="modal-mask">
      <div class="modal-container">
        <router-link id="close-modal" :to="{ name: 'schedules' }">
          <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
        </router-link>
        <h1 class="modal-title">{{ !schedule_id ? "Novo " : "" }}Horário</h1>
        <div class="form-wrap">
          <Form>
            <div class="form-dynamic-row form-group-col-1">
              <select-option
                :name="'specialty'"
                :label="'Atuação'"
                :readonly="true"
                :options="select_options.specialties"
                :empty_message="'Cadastre uma especialidade'"
                v-model="body.acting_id"
                @updateValidation="updateValidation"
              />
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <select-option
                :name="'week_day'"
                :label="'Dia da semana'"
                :required="true"
                :options="[
                  { value: 0, label: 'Segunda-feira' },
                  { value: 1, label: 'Terça-feira' },
                  { value: 2, label: 'Quarta-feira' },
                  { value: 3, label: 'Quinta-feira' },
                  { value: 4, label: 'Sexta-feira' },
                ]"
                v-model="body.week_day"
                @updateValidation="updateValidation"
              />
              <number-field
                :name="'max_visits'"
                :label="'Número de atendimentos'"
                v-model="body.max_visits"
                :minlength="0"
                :maxlength="20"
                :validators="{ required: {} }"
                @updateValidation="updateValidation"
              />
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <time-picker
                :name="'start_time'"
                :label="'Início atendimento'"
                v-model="body.start_time"
                :custom_clock="clocks.start"
                :disabled="
                  body.week_day === undefined || clocks.start.length == 0
                "
                :required="true"
                @updateValidation="updateValidation"
              />
              <time-picker
                v-model="body.end_time"
                :name="'end_time'"
                :label="'Fim atendimento'"
                :custom_clock="clocks.end"
                :disabled="!field_valid.start_time"
                :required="true"
                @updateValidation="updateValidation"
              />
            </div>
          </Form>
        </div>
        <div class="operations-wrap">
          <button
            :class="{
              btn: true,
              'btn-update': !isLoading && isFormValid && !!schedule_id,
              'btn-new': !isLoading && isFormValid && !!!schedule_id,
            }"
            :disabled="!isFormValid || isLoading"
            @click="save"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Form, SelectOption, NumberField, TimePicker } from "../util";
import { defineComponent } from "vue";

import { ScheduleBody } from "@/domain/params";
import { professionalService, scheduleService } from "@/domain/services";
import { ScheduleModel } from "@/domain/models";
import { OptionSelect } from "@/presentation/models";
import { mapActions } from "vuex";
import hash from "object-hash";

type ComponentData = {
  schedule_id?: number;
  professional_id: number;
  isLoading: boolean;
  field_valid: { [field: string]: boolean };
  body: ScheduleBody;
  body_hash?: string;
  select_options: {
    specialties: OptionSelect[];
  };
  clocks: { start: boolean[][]; end: boolean[][] };
  professional_schedules: ScheduleModel[];
  disable_watch: { [name: string]: boolean };
};

export default defineComponent({
  name: "ScheduleForm",
  components: { Form, SelectOption, NumberField, TimePicker },
  data(): ComponentData {
    const schedule_id = Number(this.$route.params.schedule_id);

    const professional_id = Number(this.$route.query.professional_id);
    return {
      professional_id: professional_id,
      schedule_id,
      isLoading: false,
      field_valid: {
        week_day: !!schedule_id,
        max_visits: true,
        start_time: !!schedule_id,
        end_time: !!schedule_id,
      },
      body: {
        max_visits: 0,
        start_date: new Date(),
        end_date: undefined,
        start_time: undefined,
        end_time: undefined,
      },
      select_options: {
        specialties: [],
      },
      clocks: { start: [], end: [] },
      professional_schedules: [],
      disable_watch: { week_day: true, start_time: true },
    };
  },
  async created() {
    await this.populateSelects();
    await this.loadProfessionalSchedules();
    if (this.schedule_id) await this.loadSchedule(this.schedule_id);
  },
  computed: {
    isFormValid() {
      for (let field_name in this.field_valid)
        if (!this.field_valid[field_name]) return false;
      return true;
    },
  },
  methods: {
    save() {
      this.isLoading = true;
      const payload = { ...this.body };

      if (this.schedule_id && this.body_hash != hash(this.body))
        return scheduleService
          .update(this.schedule_id, payload as ScheduleBody)
          .then(() => {
            this.isLoading = false;
            this.loadSchedules(this.professional_id);
            this.$router.push("/schedules");
          })
          .catch(() => (this.isLoading = false));
      else if (!this.schedule_id)
        return scheduleService
          .create(payload as ScheduleBody)
          .then(() => {
            this.isLoading = false;
            this.loadSchedules(this.professional_id);
            this.$router.push("/schedules");
          })
          .catch(() => (this.isLoading = false));

      this.$router.push("/schedules");
    },
    closeModal(e: Event) {
      if (
        e.target == this.$refs.modal_mask ||
        e.target == this.$refs.close_modal
      )
        this.$router.push("/schedules");
    },
    updateValidation(field: string, valid: boolean) {
      this.field_valid[field] = valid;
    },
    async populateSelects() {
      await professionalService
        .getById(this.professional_id)
        .then((professional) => {
          this.select_options.specialties =
            professional.actuations?.map((a) => ({
              value: a.id,
              label: a.specialty_description + " - " + a.clinic_name,
            })) || [];
          this.body.acting_id = this.select_options.specialties[0]
            ?.value as number;
        });
    },
    async loadProfessionalSchedules() {
      await scheduleService
        .load({ professional_id: this.professional_id })
        .then((schedules) => {
          this.professional_schedules = schedules.filter(
            (s) => s.id !== this.schedule_id
          );
        })
        .catch(() => this.$router.push("/schedules"));
    },
    async loadSchedule(schedule_id: number) {
      this.isLoading = true;
      await scheduleService
        .getById(schedule_id)
        .then(async (schedule) => {
          this.body = {
            acting_id: schedule.acting_id,
            start_date: schedule.start_date,
            end_date: schedule.end_date,
            max_visits: schedule.max_visits,
            week_day: schedule.week_day,
          };

          this.body.start_time = schedule.start_time;
          this.body.end_time = schedule.end_time;
          this.updateClockStart(schedule.week_day);
          this.updateClockEnd(this.clocks.start, schedule.start_time);

          this.body_hash = hash(this.body);
          this.isLoading = false;
        })
        .catch(() => this.$router.push("/schedules"));
    },
    updateClockStart(weekday: number) {
      const schedules = this.professional_schedules.filter(
        (s) => s.week_day == weekday
      );
      let currrent_schedule = schedules.shift();
      let time_seconds;
      for (let i = 0; i < 24; i++) {
        this.clocks.start[i] = [];
        for (let j = 0; j < 60; j++) {
          time_seconds = i * 60 + j;
          if (currrent_schedule && time_seconds === currrent_schedule.end_time)
            currrent_schedule = schedules.shift();
          this.clocks.start[i][j] =
            !currrent_schedule || time_seconds < currrent_schedule.start_time;
        }
      }
    },
    updateClockEnd(startclock: boolean[][], start_seconds: number) {
      let time_seconds;
      for (let i = 0; i < 24; i++) {
        this.clocks.end[i] = [];
        for (let j = 0; j < 60; j++) {
          time_seconds = i * 60 + j;
          if (time_seconds <= start_seconds) this.clocks.end[i][j] = false;
          else this.clocks.end[i][j] = startclock[i][j];
        }
      }
    },
    ...mapActions({ loadSchedules: "schedules/load" }),
  },
  watch: {
    "body.week_day"(weekday: number) {
      if (this.disable_watch.week_day && this.schedule_id) {
        this.disable_watch.week_day = false;
        return;
      }
      this.updateClockStart(weekday);
      this.body.start_time = undefined;
    },
    "body.start_time"(time_seconds: number) {
      if (this.disable_watch.start_time && this.schedule_id) {
        this.disable_watch.start_time = false;
        return;
      }
      this.updateClockEnd(this.clocks.start, time_seconds);
      this.body.end_time = undefined;
    },
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
  display: flex;
  transition: opacity 0.5s ease;
  align-items: center;
  justify-content: center;
}

.modal-container {
  position: relative;
  min-width: 27vw;
  background-color: var(--bg-light);
  border-radius: 0.3rem;
  padding: 0.8em;
}

#close-modal {
  display: block;
  position: absolute;
  cursor: pointer;
  right: 2px;
  top: -4px;
  color: rgba(31, 31, 31, 0.35);
  font-size: 1.3rem;
}

#close-modal:hover {
  transition: color 0.3s;
  color: rgba(31, 31, 31, 0.55);
}

.modal-title {
  font-size: 1.6rem;
  padding: 6px;
  color: var(--font-main);
  border-bottom: 1px solid rgb(174, 174, 174);
  text-align: center;
}

.form-wrap {
  margin: 1rem;
  background-color: rgba(201, 201, 201, 0.261);
  padding: 1rem;
  border-radius: 0.5rem;
  width: 28vw;
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
