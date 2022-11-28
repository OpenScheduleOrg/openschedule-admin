<template>
  <div class="container scrolled">
    <div class="list-wrapper">
      <h1>Horários</h1>
      <div class="list-header">
        <Form>
          <select-option
            :name="'professional_id'"
            :label="'Selecione o profissional'"
            :options="professional_options"
            :empty_message="'Cadastre um professional'"
            v-model="professional_id"
          />
        </Form>
        <router-link
          class="btn btn-new"
          :to="{
            name: 'schedule_new',
            query: { professional_id: professional_id },
          }"
        >
          Novo Horário
        </router-link>
      </div>
      <ul
        :class="{
          'list-items': true,
          loading: isLoading,
          'empty-list': !isLoading && !schedules.length,
        }"
      >
        <template v-if="!isLoading">
          <li
            v-for="schedule in (schedules as ScheduleModel[])"
            :key="schedule.id"
          >
            <div class="item-data">
              <strong
                >{{ WeekDay[schedule.week_day] }} das
                {{ schedule.start_time.toClockTime() }} até
                {{ schedule.end_time.toClockTime() }}</strong
              >
              <p>
                {{ schedule.specialty_description }} -
                {{ schedule.clinic_name }}
              </p>
              <p>
                <font-awesome-icon :icon="['fa', 'users']"></font-awesome-icon>
                {{ schedule.max_visits }}
              </p>
            </div>
            <div class="item-operations">
              <router-link
                class="btn"
                :to="{
                  name: 'schedule_edit',
                  params: {
                    schedule_id: schedule.id,
                  },
                  query: { professional_id: professional_id },
                }"
              >
                <font-awesome-icon
                  :icon="['fa', 'pen-square']"
                ></font-awesome-icon>
              </router-link>
              <button
                class="btn btn-delete"
                @click="deleteSchedule(schedule.id)"
              >
                <font-awesome-icon :icon="['fa', 'trash']"></font-awesome-icon>
              </button>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { ScheduleModel } from "@/domain/models";
import { professionalService, scheduleService } from "@/domain/services";
import { defineComponent } from "vue";
import { Form, SelectOption } from "../util";

import { mapState, mapActions } from "vuex";
import { WeekDay } from "@/common/constants";
import { OptionSelect } from "@/presentation/models";

type ComponentData = {
  professional_options: OptionSelect[];
  professional_id?: number;
  WeekDay: string[];
};

export default defineComponent({
  name: "ScheduleList",
  data(): ComponentData {
    return {
      WeekDay,
      professional_options: [],
      professional_id: undefined,
    };
  },
  computed: {
    ...mapState("schedules", ["schedules", "isLoading"]),
  },
  components: {
    Form,
    SelectOption,
  },
  created() {
    this.loadProfesssionalsOptions();
  },
  methods: {
    loadProfesssionalsOptions() {
      professionalService.load().then((professionals) => {
        this.professional_options = professionals.map((p) => ({
          value: p.id,
          label: p.name,
        }));
        this.professional_id = this.professional_options?.[0].value as number;
      });
    },
    deleteSchedule(id: number) {
      if (confirm("Você realmente deseja deletar esse horário?")) {
        scheduleService.deleteById(id).then(() => {
          this.loadSchedules(this.professional_id);
        });
      }
    },
    ...mapActions({ loadSchedules: "schedules/load" }),
  },
  watch: {
    professional_id(id) {
      this.loadSchedules(id);
    },
  },
});
</script>

<style scoped>
.container {
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
  height: 100%;
}

.container .list-wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-height: 100%;
  width: 65%;
  background-color: rgba(19, 19, 19, 0.082);
  border-radius: 0.6rem;
  padding: 1.3rem 3rem;
}

.list-wrapper > h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.list-wrapper .list-header {
  display: flex;
  background-color: rgba(19, 19, 19, 0.06);
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
}

.list-header .list-dropdown {
  size: 2rem;
}

.list-header .btn {
  border-radius: 4px;
  white-space: nowrap;
  margin-left: 5vw;
}

.list-items {
  min-height: 110px;
  padding: 0.3rem;
}

.list-items.empty-list::after {
  content: "Nenhum horário definido";
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  color: rgba(169, 169, 169, 0.967);
  margin-top: 1.2rem;
}

.list-items.loading::after {
  content: "Carregando...";
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  color: rgba(169, 169, 169, 0.827);
  margin-top: 1.2rem;
}

.list-wrapper li {
  display: flex;
  background-color: rgba(19, 19, 19, 0.08);
  border-radius: 0.5rem;
  margin: 0.6rem 0;
  padding: 0.7rem 1rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

li .item-data {
  display: flex;
  flex: 15;
  justify-content: center;
  flex-direction: column;
}

li .item-data strong {
  display: block;
  margin-bottom: 4px;
}

li .item-data p {
  font-size: 12px;
}

li .item-operations {
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.item-operations .btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
