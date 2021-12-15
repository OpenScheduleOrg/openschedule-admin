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
        <transition name="fade" mode="out-in">
          <div
            :style="{ '--intervals': ch.intervals }"
            :class="[
              'day-' + ch.week_day,
              'num-interval',
              'has-consulta',
              ch.consulta.realizada ? 'cc-consulta-realizada' : '',
              !ch.consulta.realizada &&
              now.valueOf() > ch.consulta.marcada.valueOf() + ch.consulta.his
                ? 'cc-no-consulta-realizada'
                : '',
            ]"
            v-if="ch.consulta"
            @click="updateConsulta(ch.his, ch.consulta.marcada.toISODate())"
            :key="ch.consulta.marcada.valueOf()"
            @mouseenter="posFullDetail"
          >
            <div class="cc-consulta-detail">
              <span class="cc-consulta-start">{{
                ch.consulta.intervalo.start.hhmm
              }}</span>
              <strong class="cc-full-name"
                >{{ ch.consulta.cliente_nome }}
                {{ ch.consulta.cliente_sobrenome }}
              </strong>
              <span class="cc-consulta-end">{{
                ch.consulta.intervalo.end.hhmm
              }}</span>
            </div>
            <div class="cc-consulta-full-detail">
              <div class="cc-consulta-row">
                <span>
                  {{ Week[ch.consulta.marcada.getDay()][0] }}
                  {{ ch.consulta.marcada.getDate() }} de
                  {{ Month[ch.consulta.marcada.getMonth()][0] }} de
                  {{ ch.consulta.marcada.getFullYear() }}
                </span>
                <span>
                  {{ ch.consulta.intervalo.start.hhmm }} até
                  {{ ch.consulta.intervalo.end.hhmm }}
                </span>
              </div>
              <div class="cc-consulta-row">
                <label for="consulta.paciente-nome"
                  ><font-awesome-icon
                    :icon="['fa', 'user-alt']"
                  ></font-awesome-icon
                ></label>
                <span id="consulta.paciente-nome"
                  >{{ ch.consulta.cliente_nome }}
                  {{ ch.consulta.cliente_sobrenome }}</span
                >
              </div>
              <div class="cc-consulta-row">
                <label for="consulta.paciente-telefone"
                  ><font-awesome-icon
                    :icon="['fab', 'whatsapp-square']"
                  ></font-awesome-icon
                ></label>
                <span id="consulta.paciente-telefone"
                  >{{
                    "(" +
                    ch.consulta.cliente_telefone.slice(0, 2) +
                    ")" +
                    " 9 " +
                    ch.consulta.cliente_telefone.slice(2, 6) +
                    "-" +
                    ch.consulta.cliente_telefone.slice(6)
                  }}
                </span>
              </div>
              <div class="cc-consulta-row">
                <template
                  v-if="
                    now.valueOf() <
                    ch.consulta.marcada.valueOf() + ch.consulta.his
                  "
                >
                  <label for="consulta.status"
                    ><font-awesome-icon
                      :icon="['fa', 'minus-circle']"
                    ></font-awesome-icon
                  ></label>
                  <span id="consulta.status"> Aguardando </span></template
                >
                <template v-else-if="ch.consulta.realizada">
                  <label for="consulta.status"
                    ><font-awesome-icon
                      :icon="['fa', 'check-circle']"
                    ></font-awesome-icon
                  ></label>
                  <span id="consulta.status"> Realizada </span>
                </template>
                <template v-else>
                  <label for="consulta.status"
                    ><font-awesome-icon
                      :icon="['fa', 'times-circle']"
                    ></font-awesome-icon
                  ></label>
                  <span id="consulta.status"> Não realizada </span></template
                >
              </div>
              <div class="cc-consulta-row">
                <fieldset class="cc-consulta-descricao">
                  <legend>Descrição</legend>
                  {{ ch.consulta.descricao }}
                </fieldset>
              </div>
            </div>
          </div>
          <div
            :style="{ '--intervals': ch.intervals }"
            :class="[
              'day-' + ch.week_day,
              'num-interval',
              ch.valid_horario ? 'valid-horario' : 'invalid-horario',
            ]"
            @click="
              ch.valid_horario && newConsulta(ch.hora_in_seconds, ch.week_day)
            "
            v-else
          ></div>
        </transition>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { getUTCOffset } from "@/utils";
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";
import { Month, Week } from "@/constants";

export default defineComponent({
  name: "Week",
  data() {
    return {
      utc_offset: getUTCOffset(),
      Month,
      Week,
    };
  },
  computed: {
    ...mapGetters({
      week_days: "calendar/getWeekDays",
      aw: "clinica/getWeek",
    }),
    ...mapState("calendar", ["current_date", "period", "now"]),
  },
  methods: {
    newConsulta(hs: number, wd: number) {
      const new_current_date = this.$store.getters[
        "clinica/getConsultaDatetime"
      ](hs, wd);

      this.$emit("new-consulta", hs);
      this.$router.push({
        name: this.period,
        params: {
          day: new_current_date.getDate(),
          month: new_current_date.getMonth() + 1,
          year: new_current_date.getFullYear(),
        },
      });
    },
    posFullDetail() {
      const mgt = document.querySelector("main.grid-item") as Element;
      const consultas_full_detail = document.querySelectorAll(
        ".cc-consulta-full-detail"
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
    "tz wr" 15%
    "hc wha" 1fr / 1fr 19fr;
  font-size: 1rem;
  min-width: 900px;
  min-height: 400px;
  grid-gap: 2.5vh 0.75vh;
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
  grid-gap: 0.7vh;
}

.timezone,
.week-row {
  position: -webkit-sticky; /* Safari */
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

.has-consulta.cc-consulta-realizada {
  background-color: green;
}
.has-consulta.cc-no-consulta-realizada {
  background-color: rgb(148, 0, 12);
}

.week-hours-area .has-consulta:hover {
  box-shadow: 0 0 0.6em rgb(163, 163, 163);
}

.has-consulta .cc-consulta-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.has-consulta .cc-consulta-full-detail {
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

.has-consulta .cc-consulta-full-detail span {
  display: block;
  text-align: center;
}
.has-consulta .cc-consulta-full-detail > .cc-consulta-row {
  display: flex;
  align-items: center;
  margin: 0 1.2em;
}

.cc-consulta-row label {
  color: rgb(125, 125, 125);
  font-size: 1.4em;
  margin-right: 1em;
}

.fa-whatsapp-square {
  margin-left: 1px;
}

.cc-consulta-row span {
  font-size: 0.95em;
  color: black;
}

.has-consulta .cc-consulta-full-detail > .cc-consulta-row:first-child {
  flex-direction: column;
  font-weight: 700;
  margin-bottom: 8px;
}

.has-consulta .cc-consulta-full-detail > .cc-consulta-row:last-child {
  flex: 1;
  margin-bottom: 4px;
}

.cc-consulta-row .cc-consulta-descricao {
  height: 100%;
  width: 100%;
  border: solid 1.5px rgba(0, 0, 0, 0.568);
  font-size: 0.85em;
  text-align: justify;
  padding: 0px 6px 4px 6px;
  border-radius: 3px;
}

.cc-consulta-row .cc-consulta-descricao > legend {
  font-size: 1.1em;
  padding: 3px;
}

.has-consulta:hover .cc-consulta-full-detail {
  transition-delay: 0.5s;
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

.cc-consulta-detail .cc-consulta-start,
.cc-consulta-detail .cc-consulta-end {
  font-size: 0.9em;
  display: block;
  width: 100%;
}

.cc-consulta-detail .cc-consulta-start {
  font-weight: bold;
  font-size: 1em;
}

.cc-consulta-detail .cc-consulta-end {
  color: rgba(255, 255, 255, 0.815);
  text-align: end;
}

.cc-consulta-detail .cc-full-name {
  display: -webkit-box;
  text-align: center;
  font-size: 1.15em;
  overflow: hidden;
  margin-left: 8px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cc-consulta-detail .cc-consulta-descricao {
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
</style>
