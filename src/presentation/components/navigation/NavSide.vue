<template>
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
                'is-invalid-day': !d.consultas.length && !d.hs_free.length,
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
        <router-link class="nav-link" to="/specialties">Especialidades</router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/professionals">Profissionais</router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/schedules">Horários</router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/patients">Pacientes</router-link>
      </li>
    </ul>
    <ul>
      <li>
        <router-link class="nav-link" to="/users">Usuários</router-link>
      </li>
    </ul>

  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "NavSide",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      six_weeks: "calendar/getSixWeeks",
      calendar_month: "calendar/getMonthOffset",
    }),
    ...mapState("calendar", ["period", "current_date"]),
  },
  methods: {
    ...mapActions({ setMonth: "calendar/setOffsetMonth" }),
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
  background-color: #00000007;
  border-radius: 5px;
}

nav {
  flex: 7;
  margin-top: 7px;
  background-color: #00000030;
  font-size: 1.05rem;
  padding: 1.5rem 2.3rem 1rem 1.2rem;
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
</style>
