<template>
  <div id="nav-calendar">
    <div id="month-year-nav">
      <span> {{ calendar_month }}</span>
      <div class="nav-month">
        <span class="noselect prev-next">
          <font-awesome-icon icon="chevron-left" @click="setMonth(-1)" />
        </span>
        <span class="noselect prev-next" @click="setMonth(1)">
          <font-awesome-icon icon="chevron-right" />
        </span>
      </div>
    </div>
    <div id="six-weeks">
      <div id="week-calendar">
        <span> D </span>
        <span> S </span>
        <span> T </span>
        <span> Q </span>
        <span> Q </span>
        <span> S </span>
        <span> S </span>
      </div>
      <div id="four-two">
        <router-link
          class="date-link"
          v-for="d in dates"
          :key="d.day + '/' + d.month + '/' + d.year"
          :class="{
            'is-selected': d.isSelected,
            'out-month': d.outMonth,
            'is-today': d.isToday,
            'is-invalid-day': !d.isValidDay,
          }"
          :to="{
            name: period,
            params: { day: d.day, month: d.month+1, year: d.year },
          }"
        >
          {{ d.day }}
        </router-link>
      </div>
    </div>
  </div>

  <nav id="nav-main">
    <ul>
      <li>
        <router-link class="nav-link" to="/clinica">Clínica </router-link>
      </li>
    </ul>

    <ul>
      <li>
        <router-link class="nav-link" to="/cliente/new"
          >Novo cliente</router-link
        >
      </li>
      <li>
        <router-link class="nav-link" to="/clientes">Clientes</router-link>
      </li>
    </ul>
    <ul>
      <li>
        <router-link class="nav-link" to="/funcionario/new"
          >Novo funcionário</router-link
        >
      </li>
      <li>
        <router-link class="nav-link" to="/funcionarios"
          >Funcionários</router-link
        >
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
      dates: "calendar/getSixWeeks",
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
ul {
  list-style-type: none;
}

#nav-calendar,
nav {
  background-color: #00000007;
  padding: 4px;
  border-radius: 5px;
}

#month-year-nav {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}
#month-year-nav > span {
  font-size: 1rem;
}

.prev-next {
  margin: 0 0.1rem;
  padding: 0.3rem;
  border-radius: 50%;
  text-align: center;
  color: rgba(0, 0, 0, 0.493);
  cursor: pointer;
  transition: background-color 0.2s;
}
.prev-next > * {
  height: 1rem;
  width: 1rem;
  margin-bottom: -1px;
}
.prev-next:hover {
  background-color: rgba(0, 0, 0, 0.048);
  color: rgba(0, 0, 0, 0.726);
}
.prev-next:active {
  background-color: rgba(0, 0, 0, 0.253);
}

#six-weeks {
  margin-top: 5px;
  padding: 0 0.6rem;
}
#week-calendar {
  display: flex;
  text-align: center;
  font-size: 0.85rem;
}
#week-calendar > span {
  flex: 1;
  display: block;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.63);
}

#four-two {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  margin-top: 2px;
}

.date-link {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  font-size: 0.75em;
  border-radius: 50%;
  padding: 0.5em;
  margin: 2px 4px;
  color: black;
  transition: background-color 0.25s;
  font-weight: 700;
}

.date-link:hover {
  background-color: rgba(0, 0, 0, 0.055);
}

.date-link.out-month {
  color: rgba(0, 0, 0, 0.596);
}

.date-link.is-invalid-day {
  pointer-events: none;
  cursor: initial;
  color: rgba(0, 0, 0, 0.3);
}

.date-link.is-selected.out-month {
  background-color: #2231d923 !important;
  color: var(--font-secundary) !important;
}
.date-link.is-today.out-month {
  transition: background-color 0.3s;
  background-color: #006fd6d3 !important;
  color: rgb(241, 240, 240) !important;
}

nav {
  flex: 7;
  margin-top: 8px;
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
