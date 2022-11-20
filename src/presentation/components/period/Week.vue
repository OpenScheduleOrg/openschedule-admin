<template>
  <div id="period-week" class="grid-container scrolled">
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
      class="grid-container week-hours-area"
      :class="{ 'empty-days': false }"
    >
      <template v-for="(aps, wkd) in week_agenda" :key="wkd">
        <div :class="['week-day-column']">
          <template v-for="scap in aps" :key="scap.key">
            <div
              v-if="scap.appointments !== undefined"
              class="day-schedule"
              :style="{ 'min-height': scap.height + 'em' }"
            >
              <div class="sc-top-info">
                <span>{{ scap.start_time.toClockTime() }}</span>
                <strong> {{ scap.specialty }} </strong>
                <a class="icon-new-appointment">
                  <font-awesome-icon :icon="['fa', 'plus']"></font-awesome-icon>
                </a>
              </div>
              <div class="sc-appointments">
                <div
                  v-for="sap in scap.appointments"
                  class="day-appointment"
                  :style="{ height: sap.height + 'em' }"
                  :key="sap.key"
                >
                  <div class="ap-top-info">
                    <span>{{ sap.start_time.toClockTime() }}</span>
                    <span :class="{ 'not-end-time': !sap.end_time }">{{
                      sap.end_time ? sap.end_time.toClockTime() : "88:88"
                    }}</span>
                  </div>
                  <div class="ap-patient">{{ sap.patient }}</div>
                </div>
              </div>
              <span class="sc-bottom-info">
                <span>
                  {{ scap.appointments.length }}/{{ scap.max_visits }}
                </span>
                <span>
                  {{ scap.end_time.toClockTime() }}
                </span>
              </span>
            </div>
            <div
              v-else
              class="day-appointment"
              :style="{ height: scap.height + 'em' }"
            >
              <div class="ap-top-info">
                <span>{{ scap.start_time.toClockTime() }}</span>
                <strong>{{ scap.specialty }}</strong>
                <span :class="{ 'not-end-time': !scap.end_time }">{{
                  scap.end_time ? scap.end_time.toClockTime() : "88:88"
                }}</span>
              </div>
              <div class="ap-patient">{{ scap.patient }}</div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { getUTCOffset } from "@/utils";
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";
import { Month, WeekDay } from "@/common/constants";
import { Consulta } from "@/store/models";

export default defineComponent({
  name: "Week",
  data() {
    return {
      utc_offset: getUTCOffset(),
      Month,
      WeekDay,
    };
  },
  computed: {
    ...mapGetters({
      week_days: "calendar/getWeekDays",
      week_agenda: "agenda/getWeek",
    }),
    ...mapState("calendar", ["current_date", "period", "now"]),
  },
  methods: {
    async newConsulta(his: number, wd: number) {
      const new_current_date = this.$store.getters[
        "clinica/getConsultaDatetime"
      ](his, wd);

      await this.$router.push({
        name: this.period,
        params: {
          day: new_current_date.getDate(),
          month: new_current_date.getMonth() + 1,
          year: new_current_date.getFullYear(),
        },
      });

      this.$emit("new-consulta", his);
    },
    async updateConsulta(s_consulta: Consulta) {
      await this.$router.push({
        name: this.period,
        params: {
          day: s_consulta.marcada.getDate(),
          month: s_consulta.marcada.getMonth() + 1,
          year: s_consulta.marcada.getFullYear(),
        },
      });

      this.$emit("update-consulta", s_consulta);
    },
    posFullDetail() {
      const mgt = document.querySelector("main.grid-item") as Element;
      const consultas_full_detail = document.querySelectorAll(
        ".consulta-full-detail"
      );

      const max_bottom =
        mgt.getBoundingClientRect().height + mgt.getBoundingClientRect().top;
      const max_right =
        mgt.getBoundingClientRect().width + mgt.getBoundingClientRect().left;
      const max_top = mgt.getBoundingClientRect().top;

      let fd_height: number =
        consultas_full_detail[0] &&
        consultas_full_detail[0].getBoundingClientRect().height;
      let fd_width: number =
        consultas_full_detail[0] &&
        consultas_full_detail[0].getBoundingClientRect().width;

      let e_top, e_right, test_top, test_bottom, test_right;
      for (const e of consultas_full_detail) {
        e_top = e.getBoundingClientRect().top;
        e_right = e.getBoundingClientRect().left;

        test_bottom = e_top + fd_height > max_bottom;
        test_top = e_top < max_top;
        test_right = e_right + fd_width > max_right;

        if (
          (test_bottom && test_right) ||
          (test_bottom && e.classList.contains("consulta-in-right-top"))
        ) {
          e.classList.add("consulta-in-right-bottom");
          e.classList.remove("consulta-in-right-top");
        } else if (
          (test_right && test_top) ||
          (test_top && e.classList.contains("consulta-in-right-bottom"))
        ) {
          e.classList.add("consulta-in-right-top");
          e.classList.remove("consulta-in-right-bottom");
        } else if (test_bottom) {
          e.classList.add("consulta-in-bottom");
          e.classList.remove("consulta-in-top");
        } else if (test_top) {
          e.classList.add("consulta-in-top");
          e.classList.remove("consulta-in-right-bottom");
        } else if (test_right) {
          e.classList.add("consulta-in-right");
        }
      }
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
  --bg-has-consulta: var(--bg-blue);
}

#period-week.grid-container {
  position: relative;
  grid-template:
    "wr" 15%
    "wha" 1fr;
  font-size: 1rem;
  min-width: 900px;
  min-height: 100%;
  grid-gap: 0.7em;
  background-color: var(--bg-period-week);
  overflow-x: hidden;
}

.num-interval {
  --intervals: 2;
  grid-row: span var(--intervals);
}

#period-week:hover::-webkit-scrollbar-thumb {
  background: rgb(110, 110, 110) !important;
}

#period-week::-webkit-scrollbar-thumb:hover {
  background: rgb(17, 17, 17) !important;
}

#period-week .grid-container {
  grid-gap: 0.5em;
}

.timezone,
.week-row {
  position: -webkit-sticky;
  /* Safari */
  position: sticky;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 8;
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
  grid-auto-rows: minmax(34px, 1fr);
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
  transition: all 0.7s;
  cursor: pointer;
}

.week-hours-area .valid-horario:hover {
  background-color: var(--bg-valid-horario-hv);
}

.week-hours-area .has-consulta {
  position: relative;
  display: flex;
  transition: all 0.3s;
  background-color: var(--bg-has-consulta);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  padding: 4px;
  cursor: pointer;
  min-width: 0;
}

.has-consulta.consulta-realizada {
  background-color: green;
}

.has-consulta.no-consulta-realizada {
  background-color: rgb(148, 0, 12);
}

.week-hours-area .has-consulta:hover {
  box-shadow: 0 0 0.6em rgb(163, 163, 163);
}

.has-consulta .consulta-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.has-consulta .consulta-full-detail {
  display: flex;
  position: absolute;
  height: 250px;
  width: 200%;
  z-index: 16;
  top: 50%;
  left: 50%;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
  border-radius: 2px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 0.7em rgb(56, 56, 56);
  color: rgb(40, 40, 40);
  font-size: 0.9rem;
  flex-direction: column;
  padding: 4px;
}

.has-consulta .consulta-full-detail span {
  display: block;
  text-align: center;
}

.has-consulta .consulta-full-detail > .consulta-row {
  display: flex;
  align-items: center;
  margin: 0 1.2em;
}

.consulta-row label {
  color: rgb(125, 125, 125);
  font-size: 1.4em;
  margin-right: 1em;
}

.fa-whatsapp-square {
  margin-left: 1px;
}

.consulta-row span {
  font-size: 0.95em;
  color: black;
}

.has-consulta .consulta-full-detail > .consulta-row:first-child {
  flex-direction: column;
  font-weight: 700;
  margin-bottom: 8px;
}

.has-consulta .consulta-full-detail > .consulta-row:last-child {
  flex: 1;
  margin-bottom: 4px;
}

.consulta-row .consulta-descricao {
  height: 100%;
  width: 100%;
  border: solid 1.5px rgba(0, 0, 0, 0.568);
  font-size: 0.85em;
  text-align: justify;
  padding: 0px 6px 4px 6px;
  border-radius: 3px;
}

.consulta-row .consulta-descricao > legend {
  font-size: 1.1em;
  padding: 3px;
}

.has-consulta:hover .consulta-full-detail {
  transition-delay: 0.8s;
  opacity: 1;
  visibility: visible;
  cursor: initial;
}

.has-consulta .consulta-in-bottom {
  transform: translateY(-100%);
}

.has-consulta .consulta-in-top {
  transform: translateY(0);
}

.has-consulta .consulta-in-right {
  transform: translateX(-100%);
}

.has-consulta .consulta-in-right-bottom {
  transform: translate(-100%, -100%);
}

.has-consulta .consulta-in-right-top {
  transform: translate(-100%, 0);
}

.consulta-detail .consulta-start,
.consulta-detail .consulta-end {
  font-size: 0.9em;
  display: block;
  width: 100%;
}

.consulta-detail .consulta-start {
  font-weight: bold;
  font-size: 1em;
}

.consulta-detail .consulta-end {
  color: rgba(255, 255, 255, 0.815);
  text-align: end;
}

.consulta-detail .full-name {
  display: -webkit-box;
  text-align: center;
  font-size: 1.15em;
  overflow: hidden;
  margin-left: 8px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.consulta-detail .consulta-descricao {
  display: -webkit-box;
  width: 100%;
  font-size: 0.8em;
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

.week-hours-area .week-day-column {
  display: grid;
  background-color: rgb(238, 238, 238);
  border-radius: 2px;
  grid-template-columns: 1fr;
  grid-gap: 0.5em;
  justify-content: start;
  align-content: start;
}

.day-schedule,
.day-appointment {
  display: flex;
  flex-direction: column;
  background-color: rgb(122, 190, 249);
  border-radius: 0.6em 0em 0.6em 0px;
  height: auto;
  width: 100%;
}

.day-schedule .sc-top-info {
  display: flex;
  font-size: 0.8em;
  padding: 0.3em 0.8em;
  justify-content: space-between;
  align-items: center;
}

.day-schedule .sc-appointments {
  display: grid;
  flex: 1;
  border-top: solid 1px rgb(44, 44, 44);
  border-bottom: solid 1px rgb(44, 44, 44);
  padding: 1em 2px;
  grid-gap: 0.3em;
  justify-content: start;
  align-content: start;
  grid-template-columns: 1fr;
}

.day-schedule .sc-bottom-info {
  display: flex;
  font-size: 0.8em;
  padding: 0.3em 0.8em;
  justify-content: space-between;
}

.icon-new-appointment {
  display: flex;
  cursor: pointer;
  color: white;
  background-color: rgb(0, 115, 27);
  justify-content: center;
  align-items: center;
  font-size: 1em;
  width: 20px;
  height: 20px;
  border-radius: 20px;
}

.day-appointment {
  cursor: pointer;
  font-size: 0.7em;
  color: white;
  border-radius: 0.3em;
  background-color: rgb(18, 106, 199);
  transition: all 0.3s ease-in-out;
}

.day-appointment .ap-top-info {
  display: flex;
  justify-content: space-between;
  padding: 0.3em 0.8em;
}

.day-appointment .ap-patient {
  flex: 1;
  display: flex;
  border-top: solid 1px white;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2em;
}

.day-appointment:hover {
  background-color: rgba(18, 105, 199, 0.85);
}

.not-end-time {
  visibility: hidden;
}
</style>
