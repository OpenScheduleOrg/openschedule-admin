<template>
  <div id="period-week" class="grid-container scrolled">
    <div class="timezone">
      <div class="content-ff">
        <span>{{ utc_offset }}</span>
      </div>
    </div>
    <div class="grid-container week-row">
      <div class="week-day" v-for="wd in week_days" :key="wd.weekDay">
        <span> {{ wd.weekDay }}</span>
        <router-link
          class="link-month-day"
          :class="{ 'is-today': wd.isToday }"
          :to="{
            name: 'day',
            params: { day: wd.day, month: wd.month + 1, year: wd.year },
          }"
          >{{ wd.day }}</router-link
        >
      </div>
    </div>
    <div
      class="grid-container hours-column"
      :class="{ 'empty-days': aw.empty_days }"
    >
      <div
        class="hour num-interval"
        :class="{ 'big-jump': h.bigjump }"
        v-for="h in aw.column_hms"
        :key="h.minutes + h.hours * 60"
        :style="{ '--intervals': h.intervals }"
      >
        <span class="hhmm">{{ h.hhmm }}</span>
        <div class="interval-fill"></div>
      </div>
    </div>
    <div
      class="grid-container week-hours-area"
      :class="{ 'empty-days': aw.empty_days }"
    >
      <template
        v-for="ch in aw.week_cells"
        :key="ch.week_day + '/' + ch.hora_in_seconds"
      >
        <div
          :style="{ '--intervals': ch.intervals }"
          :class="['day-' + ch.week_day, 'num-interval', 'has-consulta']"
          v-if="ch.consulta"
        >
          consulta
        </div>
        <div
          :style="{ '--intervals': ch.intervals }"
          :class="[
            'day-' + ch.week_day,
            'num-interval',
            ch.valid_horario ? 'valid-horario' : 'invalid-horario',
          ]"
          @click="ch.valid_horario && newConsulta(ch.hora_in_seconds, ch.week_day)"
          v-else
        ></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { getUTCOffset } from "@/utils";
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

export default defineComponent({
  name: "Week",
  data() {
    return {
      utc_offset: getUTCOffset(),
    };
  },
  computed: {
    ...mapGetters({
      week_days: "calendar/getWeekDays",
      aw: "clinica/getWeek",
    }),
    ...mapState("calendar", ["current_date", "period"]),
  },
  methods: {
    newConsulta(hs: number, wd: number) {
      this.$emit(
        "new-consulta",
        this.$store.getters["clinica/getConsultaDatetime"](hs, wd)
      );
    },
  },
});
</script>

<style scoped>
#period-week {
  --bg-period-week: white;
  --bg-week-days: rgb(220, 220, 220);
  --bg-valid-horario: rgb(230, 230, 230);
  --bg-valid-horario-hv: rgb(210, 210, 210);
  --bg-invalid-horario: rgb(250, 250, 250);
  --bg-has-consulta: rgb(0, 76, 240);
}

#period-week.grid-container {
  position: relative;
  grid-template:
    "tz wr" 15%
    "hc wha" 1fr / 1fr 19fr;
  height: 100%;
  font-size: 1rem;
  grid-gap: 2.5vh 0.75vh;
  background-color: var(--bg-period-week);
}

.num-interval {
  --intervals: 2;
  grid-row: span var(--intervals);
}

#period-week:hover::-webkit-scrollbar-thumb {
  background: rgb(110, 110, 110) !important;
}

#period-week .grid-container {
  grid-gap: 0.7vh;
}

.timezone,
.week-row {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  height: 100%;
  width: 100%;
}

.timezone {
  display: flex;
  grid-area: tz;
  font-size: 0.58em;
  color: rgba(0, 0, 0, 0.664);
  padding: 4px 0;
  background-color: var(--bg-period-week);
}

.timezone .content-ff {
  display: flex;
  align-self: flex-end;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  flex: 1;
  border-radius: 4px 4px 0 0;
}

.week-row,
.week-hours-area {
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: dense;
}

.week-row {
  grid-area: wr;
  background-color: var(--bg-period-week);
}

#period-week.isScrolled .week-row,
#period-week.isScrolled .timezone {
  transition: all 0.1s ease-in-out;
  box-shadow: 0px 4px 6px -6px #33333393;
}

.week-row .week-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-week-days);
  padding: 4px 0;
  border-radius: 6px 6px 0 0;
}

.week-day span {
  display: block;
  text-transform: uppercase;
  font-size: 0.77em;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
}

.link-month-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.2rem;
  width: 3.2rem;
  color: rgb(85, 85, 85);
  font-size: 1.6rem;
  border-radius: 50%;
  margin-top: 2px;
  transition: background-color 0.4s ease-out;
}

.link-month-day:hover {
  background-color: rgba(0, 0, 0, 0.103);
}

.hours-column,
.week-hours-area {
  grid-auto-rows: 5vh;
  margin-bottom: 2.4vh;
}

.hours-column.empty-days,
.week-hours-area.empty-days {
  grid-auto-rows: 1fr;
  margin-bottom: 0;
}

.hours-column {
  grid-area: hc;
}
.hours-column .hour {
  --offset: -1.5vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--bg-period-week);
  text-align: center;
  font-size: 0.75em;
  color: rgb(50, 50, 50);
  padding-bottom: 1vh;
}

.hours-column .hour > span {
  background-color: white;
}

.hours-column .hour > .hhmm {
  margin-top: var(--offset);
}

.hours-column .hour > .interval-fill {
  flex: 1;
  background: linear-gradient(var(--bg-valid-horario), var(--bg-period-week));
  border-radius: 3px;
}
.hours-column .hour.big-jump > .interval-fill {
  background: linear-gradient(
    var(--bg-valid-horario),
    var(--bg-period-week),
    var(--bg-valid-horario)
  );
}

.hours-column .hour > .hhmm-end {
  margin-bottom: var(--offset);
}

.week-hours-area {
  grid-area: wha;
  background-color: var(--bg-period-week);
}

.week-hours-area div {
  display: flex;
  transition: background-color 0.2s ease-in;
}

.week-hours-area .valid-horario {
  background-color: var(--bg-valid-horario);
  border-radius: 6px 0 6px 0;
}
.week-hours-area .valid-horario:hover {
  background-color: var(--bg-valid-horario-hv);
}

.week-hours-area .has-consulta {
  background-color: rgb(220, 220, 220);
}

.week-hours-area .invalid-horario {
  background-color: var(--bg-invalid-horario);
  border-radius: 0 6px 0 6px;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.15);
}

.week-hours-area .invalid-horario::before {
  content: "FORA DO EXPEDIENTE";
}

.week-hours-area .day-0 {
  grid-column: 1;
}

.week-hours-area .day-1 {
  grid-column: 2;
}

.week-hours-area .day-2 {
  grid-column: 3;
}

.week-hours-area .day-3 {
  grid-column: 4;
}

.week-hours-area .day-4 {
  grid-column: 5;
}

.week-hours-area .day-5 {
  grid-column: 6;
}

.week-hours-area .day-6 {
  grid-column: 7;
}
</style>
