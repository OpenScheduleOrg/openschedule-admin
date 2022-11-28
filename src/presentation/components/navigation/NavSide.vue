<template>
  <div class="select-professional" v-if="current_user.admin">
    <select-option
      :name="'profesisonal'"
      :label="'Profissional'"
      v-model="professional_id"
      :options="professional_options"
      :empty_message="'Nenhum profissional cadastrado'"
    />
  </div>

  <div id="nav-calendar">
    <div class="calendar-picker">
      <div class="calendar-main">
        <div class="calendar-nav">
          <span class="calendar-month-year"> {{ calendar_month }}</span>
          <div class="nav-month">
            <span class="noselect prev-next" @click="setMonth(-1)">
              <font-awesome-icon icon="chevron-left" />
            </span>
            <span class="noselect prev-next" @click="setMonth(1)">
              <font-awesome-icon icon="chevron-right" />
            </span>
          </div>
        </div>
        <div class="six-weeks">
          <div class="week-days">
            <span> D </span>
            <span> S </span>
            <span> T </span>
            <span> Q </span>
            <span> Q </span>
            <span> S </span>
            <span> S </span>
          </div>
          <div class="four-two">
            <router-link
              class="noselect select-date"
              v-for="d in six_weeks"
              :key="d.day + '/' + d.month + '/' + d.year"
              :class="{
                'is-selected': d.isSelected,
                'out-month': d.outMonth,
                'is-today': d.isToday,
                'is-invalid-day': !d.valid_day,
              }"
              :to="{
                name: period,
                params: { day: d.day, month: d.month + 1, year: d.year },
              }"
            >
              {{ d.day }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav id="nav-main">
    <ul>
      <li>
        <router-link class="nav-link" to="/clinics">Clínicas</router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/specialties"
          >Especialidades</router-link
        >
      </li>
      <li>
        <router-link class="nav-link" to="/professionals"
          >Profissionais</router-link
        >
      </li>
      <li>
        <router-link class="nav-link" to="/schedules">Horários</router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/patients">Pacientes</router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/users">Usuários</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { SelectOption } from "../util";
import { defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

type ComponentData = {
  professional_id?: number;
};
export default defineComponent({
  name: "NavSide",
  components: { SelectOption },
  data(): ComponentData {
    return { professional_id: undefined };
  },
  created() {
    this.populateProfessionalOptions();
  },
  computed: {
    ...mapGetters({
      six_weeks: "calendar/getSixWeeks",
      calendar_month: "calendar/getMonthOffset",
    }),
    ...mapState("calendar", ["period", "current_date"]),
    ...mapState("auth", ["current_user"]),
    ...mapState("agenda", ["professional_options"]),
  },
  methods: {
    ...mapActions({
      setMonth: "calendar/setOffsetMonth",
      populateProfessionalOptions: "agenda/populateProfessionalOptions",
      setProfessional: "agenda/setProfessional",
    }),
  },
  watch: {
    professional_id(id: number) {
      this.setProfessional(id);
    },
    "$store.state.agenda.professional_id"(id: number) {
      this.professional_id = id;
    },
  },
});
</script>

<style scoped>
.calendar-picker {
  --day-size: 30px;
  background-color: rgb(236, 236, 236);
  padding: 0 9px;
}

ul {
  list-style-type: none;
}

#nav-calendar {
  padding: 0 8px;
}
nav {
  flex: 7;
  margin-top: 7px;
  font-size: 1.05rem;
  padding: 0 8px;
}
nav > ul {
  display: block;
  background-color: #777777bc;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  padding: 0.8em 2.8em 0.8em 2.2em;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
}

nav > ul:not(:first-child) {
  margin-top: 0.7em;
}

a.nav-link {
  display: inline-block;
  font-size: 0.9em;
  width: 100%;
  padding: 6px 10px;
  margin: 4px auto;
  font-weight: 700;
  color: var(--font-main);
  border-radius: 4px;
  background-color: white;
}
a.nav-link:hover {
  transition: all 200ms;
  background-color: rgb(237, 237, 237);
}

a.nav-link.router-link-active {
  background-color: var(--bg-blue);
  color: white;
}

a.nav-link.router-link-exact-active {
  background-color: rgb(19, 63, 114);
  color: white;
}

.select-professional {
  padding: 0 1rem;
  font-size: 0.8em;
  margin-bottom: 8px;
}
</style>
