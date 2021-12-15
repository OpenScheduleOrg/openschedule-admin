import { Module, Commit, Dispatch } from "vuex";
import { State as stateRoot } from "..";
import { Horario, Clinica, Consulta } from "@/interfaces";
import {
  RESET_STATE,
  SET_CLINICA,
  SET_CONSULTAS,
  SET_HORARIOS,
} from "./mutation-types";

import { getClinicas, getConsultas, getHorarios } from "@/services";

interface WeekCell {
  consulta?: Consulta;
  week_day: number;
  hora_in_seconds: number;
  valid_horario?: boolean;
  intervals: number;
}

import {
  timeStringToS,
  sortHorarios,
  secondsToHorario,
  sortConsultas,
} from "@/utils";
import { MIN_INTERVAL } from "@/constants";

interface ClinicaConsultas {
  [ISODate: string]: Consulta[];
}

export interface StateClinica extends Clinica {
  horarios: Horario[];
  consultas: ClinicaConsultas;
}

const clinica: Module<StateClinica, stateRoot> = {
  namespaced: true,
  state: {
    horarios: [],
    consultas: {},
  },
  getters: {
    getWeekConsultas(state, getters, rootState) {
      const week_consultas: ClinicaConsultas = {};
      const consultas = state.consultas;
      const current_date = rootState.calendar.current_date;
      const weekDay = current_date.getDay();
      const start_week = current_date.addDays(-weekDay);

      let iso_date: string;
      for (let wd = 0; wd < 7; wd++) {
        iso_date = start_week.addDays(wd).toISODate();
        if (consultas[iso_date]) week_consultas[wd] = [...consultas[iso_date]];
      }

      return week_consultas;
    },
    getWeekDayRange(state, getters) {
      const horarios = state.horarios;
      const week_consultas: ClinicaConsultas = getters.getWeekConsultas;

      let am_inicio = 3600 * 24 - 60;
      let pm_fim = 0;
      let interval = 3600 * 4;

      for (const h of horarios) {
        if (h && h.am_inicio && h.am_inicio < am_inicio) {
          am_inicio = h?.am_inicio as number;
        }
        if (h && h.pm_fim && h.pm_fim > pm_fim) {
          pm_fim = h?.pm_fim as number;
        }
        if (h && h.intervalo && h.intervalo < interval) {
          interval = h.intervalo as number;
        }
      }

      for (const d in week_consultas)
        for (const c of week_consultas[d]) {
          if (c.his < am_inicio) am_inicio = c.his;
          else if (c.his >= pm_fim) pm_fim = c.his + c.duracao;
        }

      if (am_inicio > pm_fim) {
        const y = am_inicio;
        am_inicio = pm_fim;
        pm_fim = y;
      }

      return { am_inicio, pm_fim, interval };
    },
    getWeek(state, getters) {
      const week: WeekCell[] = [];
      const column_hms: {
        hours: number;
        minutes: number;
        hhmm: string;
        intervals: number;
        bigjump?: boolean;
      }[] = [];

      const horarios = state.horarios;
      const week_consultas = getters.getWeekConsultas as ClinicaConsultas;

      const { am_inicio, pm_fim, interval } = getters.getWeekDayRange as {
        am_inicio: number;
        pm_fim: number;
        interval: number;
      };

      let day_consultas;
      let ch: number;
      let chh: number;
      let chi: number;
      let num_min_intervals: number;
      let ciis: number;
      let wd: number;
      let consulta: Consulta | undefined;
      for (const h of horarios) {
        ch = am_inicio;
        chh = h.am_inicio as number;
        wd = h.dia_semana;

        num_min_intervals = (h.intervalo as number) / MIN_INTERVAL;

        day_consultas =
          week_consultas[h.dia_semana] &&
          week_consultas[h.dia_semana].sort(sortConsultas);

        consulta = day_consultas && day_consultas.shift();

        ciis = 0;
        chi = ch;
        for (; ch < pm_fim; ch += MIN_INTERVAL) {
          if (consulta && ch == consulta.his) {
            if (ciis)
              week.push({
                week_day: wd,
                hora_in_seconds: chi,
                intervals: ciis,
                valid_horario: ciis == num_min_intervals,
              });

            week.push({
              consulta: consulta,
              week_day: wd,
              hora_in_seconds: ch,
              intervals: consulta.duracao / MIN_INTERVAL,
              valid_horario: true,
            });

            ch += consulta.duracao;
            consulta = day_consultas.shift();

            chh =
              h.pm_inicio && h.am_fim && h.am_fim >= ch && h.pm_inicio < ch
                ? (h.pm_inicio as number)
                : ch;

            ch -= MIN_INTERVAL;
            ciis = 0;
          } else if (ch == chh) {
            if (ciis)
              week.push({
                week_day: wd,
                hora_in_seconds: chi,
                intervals: ciis,
                valid_horario: false,
              });

            week.push({
              week_day: wd,
              hora_in_seconds: ch,
              intervals: num_min_intervals,
              valid_horario: true,
            });

            chh =
              h.pm_inicio &&
              h.am_fim &&
              h.am_fim == chh + MIN_INTERVAL * num_min_intervals
                ? (h.pm_inicio as number)
                : chh + MIN_INTERVAL * num_min_intervals;

            ch += MIN_INTERVAL * (num_min_intervals - 1);

            ciis = 0;
          } else {
            if (!ciis) chi = ch;
            ciis++;
          }
        }
      }

      num_min_intervals = interval / MIN_INTERVAL;
      const num_days = state.horarios.length;

      let h: number;
      let result: WeekCell[];
      let indexes: number[];
      let end_h: number;
      for (h = am_inicio; h < pm_fim; h += interval) {
        indexes = [];
        result = week.filter((c, i) => {
          if (
            c.hora_in_seconds <= h &&
            c.intervals > num_min_intervals + 1 &&
            !c.valid_horario
          ) {
            indexes.push(i);

            return true;
          }
          return false;
        });
        end_h =
          result[0] &&
          result[0].hora_in_seconds + MIN_INTERVAL * result[0].intervals;
        if (
          result.filter((c) => {
            if (
              c.hora_in_seconds + MIN_INTERVAL * c.intervals == end_h &&
              c.hora_in_seconds >= h
            )
              return true;
            return false;
          }).length == num_days &&
          horarios.length
        ) {
          column_hms.push({
            ...secondsToHorario(h),
            intervals: num_min_intervals + 1,
            bigjump: true,
          });

          for (const i of indexes) week[i].intervals = num_min_intervals + 1;

          h = end_h - interval;
        } else {
          column_hms.push({
            ...secondsToHorario(h),
            intervals: num_min_intervals,
          });
        }
      }

      const lr = column_hms.pop();
      if (lr) {
        lr.intervals += Math.round((pm_fim - h) / MIN_INTERVAL);
        column_hms.push(lr);
      }

      if (!horarios.length) {
        for (let i = 0; i < 7; i++)
          week.push({
            week_day: i,
            valid_horario: false,
            intervals: 12,
            hora_in_seconds: (4 * 160) / MIN_INTERVAL,
          });
      }

      return { column_hms, week_cells: week, empty_days: !horarios.length };
    },
    getConsultaDatetime:
      (state, getters, rootState) => (hs: number, wd: number) => {
        const consulta_datetime = rootState.calendar.current_date.addDays(
          wd - rootState.calendar.current_date.getDay()
        );

        consulta_datetime.setSeconds(consulta_datetime.getSeconds() + hs);

        return consulta_datetime;
      },
    getDayDetails: (state) => (d: string, wd: number) => {
      const day_consultas = state.consultas[d];
      const horario = state.horarios.find((hrr) => hrr.dia_semana == wd);

      const details: {
        consultas: Consulta[];
        hs_free: [
          { hours: number; minutes: number; hhmm: string },
          { hours: number; minutes: number; hhmm: string }
        ][];
      } = { consultas: [], hs_free: [] };

      if (!horario) return details;

      const intervalo = horario.intervalo as number;
      let consulta: Consulta | undefined;

      for (
        let h = horario.am_inicio as number;
        h < horario.pm_fim;
        h += intervalo
      ) {
        if (
          horario.am_fim &&
          horario.pm_inicio &&
          h >= horario.am_fim &&
          h <= horario.pm_inicio
        )
          h = horario.pm_inicio as number;
        else {
          consulta =
            day_consultas &&
            day_consultas.find(
              (c) =>
                h >= c.his && c.his < h + intervalo && c.his + c.duracao > h
            );
          if (consulta) details.consultas.push(consulta);
          else
            details.hs_free.push([
              secondsToHorario(h),
              secondsToHorario(h + intervalo),
            ]);
        }
      }
      return details;
    },
  },
  mutations: {
    [SET_CLINICA](state, clinica: Clinica) {
      state.id = clinica.id;
      state.nome = clinica.nome;
      state.endereco = clinica.endereco;
      state.telefone = clinica.telefone;
    },
    [SET_HORARIOS](state, horarios: [Horario]) {
      state.horarios = horarios;
    },
    [SET_CONSULTAS](state, consultas: ClinicaConsultas) {
      state.consultas = consultas;
    },
    [RESET_STATE](state) {
      delete state.id;
      delete state.nome;
      delete state.endereco;
      delete state.telefone;
      state.horarios = [];
      state.consultas = {};
    },
  },
  actions: {
    setClinica({
      commit,
      rootState,
      dispatch,
    }: {
      commit: Commit;
      rootState: stateRoot;
      dispatch: Dispatch;
    }) {
      return getClinicas({}, rootState.auth.user?.clinica_id)
        .then((res) => {
          commit(SET_CLINICA, res.data.clinica);
          return dispatch("setHorarios");
        })
        .catch((error) => {
          dispatch("resetState");
          return Promise.reject(error);
        });
    },
    setHorarios({
      commit,
      state,
      dispatch,
    }: {
      commit: Commit;
      state: StateClinica;
      dispatch: Dispatch;
    }) {
      return getHorarios({ clinica_id: state.id as number }).then((res) => {
        const horarios = res.data.horarios;

        for (const h of horarios) {
          h.am_inicio = timeStringToS(h.am_inicio as string);
          if (h.am_fim) h.am_fim = timeStringToS(h.am_fim as string);
          if (h.pm_inicio) h.pm_inicio = timeStringToS(h.pm_inicio as string);
          h.pm_fim = timeStringToS(h.pm_fim as string);
          h.intervalo = timeStringToS(h.intervalo as string);
          h.dia_semana = h.dia_semana + 1 >= 7 ? 0 : h.dia_semana + 1;
        }
        horarios.sort(sortHorarios);
        commit(SET_HORARIOS, horarios);

        return dispatch("setConsultas");
      });
    },
    setConsultas(
      {
        commit,
        state,
        rootState,
      }: { commit: Commit; state: StateClinica; rootState: stateRoot },
      params = undefined
    ) {
      const clinica_id = state.id;
      const current_date = rootState.calendar.current_date;
      let date_start: Date, date_end: Date, cliente_id;
      if (!params) {
        date_start = new Date(
          current_date.getFullYear(),
          current_date.getMonth(),
          -7
        );
        date_end = new Date(
          current_date.getFullYear(),
          current_date.getMonth() + 1,
          +8
        );
      } else {
        date_start = params.date_start;
        date_end = params.date_end;
        cliente_id = params.cliente_id;
      }
      return getConsultas({
        clinica_id,
        cliente_id,
        date_start,
        date_end,
      }).then((res) => {
        const consutlas_array = res.data.consultas;

        const consultas: ClinicaConsultas = consutlas_array.reduce((cs, cc) => {
          const marcada = cc.marcada as Date;

          if (!cs[marcada.toISODate()]) cs[marcada.toISODate()] = [];
          cs[marcada.toISODate()].push(cc);

          return cs;
        }, {} as ClinicaConsultas);
        if (date_end && date_start) {
          let current_date: Date;
          for (const isodate in state.consultas) {
            current_date = new Date(isodate);

            if (
              current_date.valueOf() < date_start.valueOf() ||
              current_date.valueOf() > date_end.valueOf()
            ) {
              consultas[isodate] = state.consultas[isodate];
            }
          }
        }

        commit(SET_CONSULTAS, consultas);
      });
    },
    resetState({ commit }: { commit: Commit }) {
      commit(RESET_STATE);
    },
  },
};

export default clinica;
