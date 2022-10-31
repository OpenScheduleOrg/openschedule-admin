<template>
  <modal @click="closeAll">
    <h1 class="modal-title" v-if="consulta.id">Consulta</h1>
    <h1 class="modal-title" v-if="!consulta.id">Nova consulta</h1>

    <div class="cc-consulta-wrapper">
      <h2 class="cc-form-title">Consulta</h2>
      <div class="form-container">
        <Form>
          <div class="cc-form-dynamic-row cc-form-group-col-2">
            <date-consulta-picker
              ref="date_picker"
              :field_name="'Data Marcada'"
            ></date-consulta-picker>
            <horario-picker
              v-model="consulta.his"
              :field_name="'Horario'"
              :list="hs_free_list"
            />
          </div>
          <text-area
            v-model="consulta.descricao"
            :field_name="'Descrição'"
          ></text-area>
          <input-check
            :field_name="'Consulta realizada?'"
            :valid="consulta.realizada"
            :invalid="
              !consulta.realizada && now.valueOf() > consulta.marcada.valueOf()
            "
            v-model="consulta.realizada"
          ></input-check>
        </Form>
      </div>
    </div>
    <div class="cc-cliente-wrapper">
      <h2 class="cc-form-title">Cliente</h2>
      <div class="form-container">
        <Form>
          <div class="cc-form-dynamic-row cc-form-group-col-2">
            <input-text
              :field_name="'Nome'"
              v-model="cliente.nome"
              :advise="validate.cliente.nome"
            >
            </input-text>
            <input-text :field_name="'Sobrenome'" v-model="cliente.sobrenome">
            </input-text>
          </div>
          <div class="cc-form-dynamic-row cc-form-group-col-3">
            <input-text
              :field_name="'CPF'"
              :maxlength="14"
              v-model="cliente.cpf"
              :format="'cpf'"
              :advise="validate.cliente.cpf"
              :readonly="!!cliente.id"
            >
            </input-text>
            <input-text
              :field_name="'Telefone'"
              v-model="cliente.telefone"
              :maxlength="16"
              :format="'telefone'"
              :advise="validate.cliente.telefone"
            >
            </input-text>
            <date-picker
              :field_name="'Nascimento'"
              v-model="cliente.nascimento"
            >
            </date-picker>
          </div>
          <input-text v-model="cliente.endereco" :field_name="'Endereco'">
          </input-text>
        </Form>
      </div>
    </div>
    <div class="cc-actions-wrapper">
      <button class="cc-btn cc-btn-close" @click="$emit('close_modal')">
        Fechar</button
      ><button
        class="cc-btn cc-btn-delete"
        v-if="consulta.id"
        @click="cancelarConsulta"
      >
        Cancelar
      </button>
      <button
        class="cc-btn cc-btn-new"
        @click="commitChange"
        v-if="!consulta.id"
      >
        Marcar Consulta
      </button>
      <button
        class="cc-btn cc-btn-update"
        @click="commitChange"
        v-if="consulta.id"
      >
        Salvar
      </button>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import Modal from "../Modal.vue";
import {
  Form,
  InputText,
  DateConsultaPicker,
  DatePicker,
  HorarioPicker,
  TextArea,
  InputCheck,
} from "../util";

import { Cliente, Consulta } from "@/data/interfaces";

import { secondsToHorario } from "@/utils";

export default defineComponent({
  name: "ConsultaForm",
  props: ["his", "s_consulta"],
  data(): {
    validate: { cliente: { nome: string; cpf: string; telefone: string } };
    initial_iso_date: string;
    initial_his: number;
    consulta: Consulta;
    cliente: Cliente;
    hs_free_list: {
      selected: boolean;
      start: { his: number; hhmm: string };
      end: { his: number; hhmm: string };
    }[];
  } {
    const current_date = this.$store.state.calendar.current_date;
    const initial_iso_date = current_date.toISODate();
    const initial_his = this.his ? this.his : this.s_consulta.his;

    const clinica_id = this.$store.state.clinica.id as number;

    let consulta = {
      id: 0,
      descricao: "",
      clinica_id,
      cliente_id: 0,
      his: this.his,
      realizada: false,
      marcada: new Date(
        current_date.getFullYear(),
        current_date.getMonth(),
        current_date.getDate(),
        0,
        0,
        this.his
      ),
      duracao: 0,
    };
    const cliente: Cliente = {
      id: 0,
      nascimento: new Date(),
      nome: "",
      sobrenome: "",
      cpf: "",
      telefone: "",
      endereco: "",
    };

    if (this.s_consulta) {
      consulta = this.s_consulta;
      this.setCliente(consulta.cliente_id);
    }

    const hs_free_list = this.getHsFree(
      current_date,
      initial_iso_date,
      initial_his,
      consulta
    );
    return {
      initial_iso_date,
      initial_his,
      consulta,
      cliente,
      validate: { cliente: { nome: "", cpf: "", telefone: "" } },
      hs_free_list,
    };
  },
  components: {
    Modal,
    Form,
    DatePicker,
    HorarioPicker,
    TextArea,
    InputText,
    DateConsultaPicker,
    InputCheck,
  },
  computed: {
    ...mapState("calendar", ["current_date", "now"]),
  },
  methods: {
    async setCliente(cliente_id: number) {
      console.log(cliente_id)
      // Mock cliente
      const res = {
        data: {
          cliente: {
            id: 1,
            nome: "Foo",
            sobrenome: "Bar",
            nascimento: new Date().toString(),
            cpf: "99889098723",
            telefone: "8938232312",
            endereco: "Rua X",
          },
        },
      };

      const res_cliente = res.data.cliente;
      this.cliente.id = res_cliente.id;
      this.cliente.nome = res_cliente.nome;
      this.cliente.sobrenome = res_cliente.sobrenome;
      this.cliente.nascimento =
        res_cliente.nascimento && new Date(res_cliente.nascimento as string);
      this.cliente.cpf =
        res_cliente.cpf.slice(0, 3) +
        "." +
        res_cliente.cpf.slice(3, 6) +
        "." +
        res_cliente.cpf.slice(6, 9) +
        "-" +
        res_cliente.cpf.slice(9);
      this.cliente.telefone =
        "(" +
        res_cliente.telefone.slice(0, 2) +
        ") 9 " +
        res_cliente.telefone.slice(2, 6) +
        "-" +
        res_cliente.telefone.slice(6);
      this.cliente.endereco = res_cliente.endereco;
    },
    closeAll(ev: Event) {
      return ev;
    },
    getHsFree(
      ncd: Date,
      initial_iso_date: string,
      initial_his: number,
      consulta: { his: number; duracao: number; id?: number }
    ) {
      const current_iso_date = ncd.toISODate();
      let { hs_free } = this.$store.getters["clinica/getDayDetails"](
        current_iso_date,
        ncd.getDay()
      );

      if (current_iso_date == initial_iso_date) {
        for (let i = 0; i < hs_free.length; i++) {
          if (consulta && consulta.id) {
            if (hs_free[i].start.his > consulta.his) {
              hs_free = [
                ...hs_free.slice(0, i),
                {
                  selected: true,
                  start: secondsToHorario(consulta.his),
                  end: secondsToHorario(consulta.his + consulta.duracao),
                },
                ...hs_free.slice(i),
              ];
              return hs_free;
            }
            continue;
          }
          if (hs_free[i].start.his == initial_his) {
            hs_free[i].selected = true;
            return hs_free;
          }
        }
        if (consulta && consulta.id)
          return hs_free.push({
            selected: true,
            start: secondsToHorario(consulta.his),
            end: secondsToHorario(consulta.his + consulta.duracao),
          });
      }

      if (hs_free[0]) hs_free[0].selected = true;
      return hs_free;
    },
    async commitChange() {
      let cliente: Cliente;
      const nome = this.cliente.nome;
      //const sobrenome = this.cliente.sobrenome;
      //const nascimento = this.cliente.nascimento as Date;
      //const endereco = this.cliente.endereco;
      const cpf = this.cliente.cpf.replace(/\.|-/g, "");
      const telefone = this.cliente.telefone.replace(/\(|\)|-|(?:\s9\s)/g, "");
      let valid = true;

      if (nome.length < 3) {
        valid = false;
        this.validate.cliente.nome = "Nome muito pequeno";
      }
      if (telefone.length < 10) {
        valid = false;
        this.validate.cliente.telefone = "Telefone inválido";
      }
      if (cpf.length < 11) {
        valid = false;
        this.validate.cliente.cpf = "CPF inválido";
      }
      if (valid) {
        if (!this.cliente.id) {
          // Mock cliente
          const res = {
            data: {
              cliente: {
                id: 1,
                nome: "Foo",
                sobrenome: "Bar",
                nascimento: new Date().toString(),
                cpf: "99889098723",
                telefone: "8938232312",
                endereco: "Rua X",
              },
            },
          };

          cliente = res.data && res.data.cliente;
          if (cliente) {
            this.cliente = cliente;
            this.consulta.cliente_id = cliente.id as number;
          }
        }
      } else {
        return;
      }

      const consulta_id = this.consulta.id;
      //const marcada = this.consulta.marcada as Date;
      //const clinica_id = this.consulta.clinica_id;
      //const cliente_id = this.consulta.cliente_id;
      //const descricao = this.consulta.descricao;
      //const realizada = this.consulta.realizada;
      if (consulta_id) {
        /* updateConsulta(consulta_id, marcada, realizada, descricao); */
      } else {
        /* createConsulta({
          marcada,
          descricao,
          realizada,
          clinica_id,
          cliente_id,
        }); */
      }
      this.$store.dispatch("clinica/setConsultas");
      this.$emit("close_modal");
    },

    async cancelarConsulta() {
      if (confirm("Você deseja realmente cancelar essa consulta?")) {
        this.$store.dispatch("clinica/setConsultas");
        this.$emit("close_modal");
      }
    },
  },
  watch: {
    current_date(ncd) {
      this.hs_free_list = this.getHsFree(
        ncd,
        this.initial_iso_date,
        this.initial_his,
        this.consulta
      );
    },
    "consulta.his": function (nhis) {
      this.consulta.marcada = new Date(
        this.current_date.getFullYear(),
        this.current_date.getMonth(),
        this.current_date.getDate(),
        0,
        0,
        nhis
      );
    },
    "cliente.cpf": async function (n) {
      this.validate.cliente.cpf = "";
      if (n.length == 14) {
        //const cpf: string = n.replace(/\.|-/g, "");

        // Mock cliente
        const res = {
          data: {
            cliente: {
              id: 1,
              nome: "Foo",
              sobrenome: "Bar",
              nascimento: new Date().toString(),
              cpf: "99889098723",
              telefone: "8938232312",
              endereco: "Rua X",
            },
          },
        };

        const cliente = res.data && res.data.cliente;
        if (cliente) {
          this.cliente.id = cliente.id;
          this.consulta.cliente_id = cliente.id as number;
          this.cliente.nome = cliente.nome;
          this.cliente.sobrenome = cliente.sobrenome;
          this.cliente.telefone =
            "(" +
            cliente.telefone.slice(0, 2) +
            ") 9 " +
            cliente.telefone.slice(2, 6) +
            "-" +
            cliente.telefone.slice(6);

          this.cliente.endereco = cliente.endereco;
          this.cliente.nascimento =
            cliente.nascimento && new Date(cliente.nascimento);
        }
      }
    },
    "cliente.telefone": async function (n) {
      this.validate.cliente.telefone = "";
      this.validate.cliente.cpf = "";
      if (n.length == 16) {
        // const telefone: string = n.replace(/\(|\)|-|(?:\s9\s)/g, "");
        // Mock cliente
        const res = {
          data: {
            cliente: {
              id: 1,
              nome: "Foo",
              sobrenome: "Bar",
              nascimento: new Date().toString(),
              cpf: "99889098723",
              telefone: "8938232312",
              endereco: "Rua X",
            },
          },
        };

        const cliente = res.data && res.data.cliente 

        if (cliente) {
          this.cliente.id = cliente.id as number;
          this.consulta.cliente_id = cliente.id as number;
          this.cliente.nome = cliente.nome;
          this.cliente.sobrenome = cliente.sobrenome;
          this.cliente.cpf =
            cliente.cpf.slice(0, 3) +
            "." +
            cliente.cpf.slice(3, 6) +
            "." +
            cliente.cpf.slice(6, 9) +
            "-" +
            cliente.cpf.slice(9);
          this.cliente.endereco = cliente.endereco;
          this.cliente.nascimento =
            cliente.nascimento && new Date(cliente.nascimento);
        }
      }
    },
    "cliente.nome": function () {
      this.validate.cliente.nome = "";
    },
  },
});
</script>

<style scoped>
.form-container {
  width: 550px;
  padding: 0.4rem 1rem;
  background-color: rgba(191, 191, 191, 0.15);
  border-radius: 8px;
  margin-left: 2rem;
  margin-top: 0.5rem;
}

.cc-form-title {
  font-size: 1.1rem;
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
  font-weight: 500;
}

.cc-consulta-wrapper,
.cc-cliente-wrapper {
  margin: 1rem;
}

.cc-actions-wrapper {
  display: flex;
  padding: 8px 1rem;
  justify-content: flex-end;
}
.cc-actions-wrapper > .cc-btn {
  margin: 0 8px;
}

.cc-actions-wrapper .cc-btn {
  min-width: 90px;
  height: 40px;
  border-radius: 4px;
  transition: all 0.25s ease-in;
}

.cc-btn.cc-btn-close {
  background-color: white;
  color: black;
  border: solid 1px rgb(226, 16, 16);
}

.cc-btn.cc-btn-close:hover {
  background-color: rgb(240, 240, 240);
}

.cc-btn.cc-btn-close:active {
  background-color: rgb(235, 214, 214);
}

.cc-btn.cc-btn-new {
  background-color: #028536;
}

.cc-btn.cc-btn-new:hover {
  background-color: #00a223;
}

.cc-btn.cc-btn-new:active {
  background-color: #00a960ee;
}

.cc-btn.cc-btn-update {
  background-color: #006bd0;
}

.cc-btn.cc-btn-update:hover {
  background-color: #0056a7;
}

.cc-btn.cc-btn-update:active {
  background-color: #015db3;
}

.cc-btn.cc-btn-delete {
  background-color: #d01500;
}

.cc-btn.cc-btn-delete:hover {
  background-color: #bb1300;
}

.cc-btn.cc-btn-delete:active {
  background-color: #a51100;
}
</style>
