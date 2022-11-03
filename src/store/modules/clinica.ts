import { Module, Commit, Dispatch } from "vuex";
import { State as stateRoot } from "..";
import { Horario, Clinica, Consulta, DayDetail } from "@/store/models";
import {
  RESET_STATE,
  SET_CLINICA,
  SET_CONSULTAS,
  SET_HORARIOS,
} from "./mutation-types";

interface WeekCell {
  consulta?: Consulta;
  week_day: number;
  hora_in_seconds: number;
  valid_horario?: boolean;
  intervals: number;
}

import { secondsToHorario, sortConsultas } from "@/utils";
import { MIN_INTERVAL } from "@/common/constants";

interface ClinicaConsultas {
  [ISODate: string]: Consulta[];
}

export interface StateClinica extends Clinica {
  horarios: Horario[];
  consultas: ClinicaConsultas;
}

export const ClinicaModule: Module<StateClinica, stateRoot> = {
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
              h.pm_inicio && h.am_fim && h.am_fim <= ch && h.pm_inicio > ch
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
        hs_free: DayDetail[];
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
        consulta =
          day_consultas &&
          day_consultas.find(
            (c) => h >= c.his && c.his < h + intervalo && c.his + c.duracao > h
          );
        if (consulta) details.consultas.push(consulta);
        else
          details.hs_free.push({
            start: secondsToHorario(h),
            end: secondsToHorario(h + intervalo),
          });
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
      dispatch,
    }: {
      commit: Commit;
      rootState: stateRoot;
      dispatch: Dispatch;
    }) {
      commit(SET_CLINICA, {
        id: 1,
        nome: "Foo Bar",
        endereco: "Rua X",
        telefone: "9878797867",
      });
      return dispatch("setHorarios");
    },
    setHorarios({
      commit,
      dispatch,
    }: {
      commit: Commit;
      state: StateClinica;
      dispatch: Dispatch;
    }) {
      commit(SET_HORARIOS, [
        {
          almoco: true,
          am_inicio: 25200,
          am_fim: 25200 + 4 * 3600,
          pm_inicio: 50400,
          pm_fim: 61200,
          intervalo: 3600,
          dia_semana: 1,
        },
        {
          almoco: true,
          am_inicio: 25200,
          am_fim: 25200 + 4 * 3600,
          pm_inicio: 50400,
          pm_fim: 61200,
          intervalo: 3600,
          dia_semana: 2,
        },
        {
          almoco: true,
          am_inicio: 25200,
          am_fim: 25200 + 4 * 3600,
          pm_inicio: 50400,
          pm_fim: 61200,
          intervalo: 1800,
          dia_semana: 3,
        },
        {
          almoco: true,
          am_inicio: 25200,
          am_fim: 25200 + 4 * 3600,
          pm_inicio: 50400,
          pm_fim: 61200,
          intervalo: 1800,
          dia_semana: 4,
        },
      ]);
      return dispatch("setConsultas");
    },

    setConsultas({
      commit,
    }: {
      commit: Commit;
      state: StateClinica;
      rootState: stateRoot;
    }) {
      commit(SET_CONSULTAS, {
        "2022-10-31": [
          {
            id: 69,
            clinica_id: 1,
            cliente_id: 1,
            marcada: new Date("2022-10-31"),
            duracao: 3600,
            his: 25200,
            intervalo: {
              start: {
                his: 25200,
                hours: 7,
                minutes: 0,
                hhmm: "07:00",
              },
              end: {
                his: 25200 + 3600,
                hours: 8,
                minutes: 0,
                hhmm: "08:00",
              },
            },
            descricao: "",
            cliente_nome: "Marcos Pacheco",
            cliente_telefone: "8681732880",
          },
        ],
      });
    },
    resetState({ commit }: { commit: Commit }) {
      commit(RESET_STATE);
    },
  },
};
