<template>
  <modal @click="closeAll">
    <h1 class="modal-title">Nova consulta</h1>
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
        </Form>
      </div>
    </div>
    <div class="cc-cliente-wrapper">
      <h2 class="cc-form-title">Cliente</h2>
      <div class="form-container">
        <Form>
          <div class="cc-form-dynamic-row cc-form-group-col-2">
            <input-text :field_name="'Nome'" v-model="cliente.nome">
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
            >
            </input-text>
            <input-text
              :field_name="'Telefone'"
              v-model="cliente.telefone"
              :maxlength="16"
              :format="'telefone'"
            >
            </input-text>
            <date-picker
              :field_name="'Nascimento'"
              v-model="cliente.nascimento"
            >
            </date-picker>
          </div>
          <input-text :field_name="'Endereco'"> </input-text>
        </Form>
      </div>
    </div>
    <div class="cc-actions-wrapper">
      <button class="cc-btn cc-btn-close" @click="$emit('close_modal')">
        Fechar</button
      ><button class="cc-btn cc-btn-delete" v-if="consulta.id">Cancelar</button>
      <button class="cc-btn cc-btn-new" v-if="!consulta.id">
        Marcar Consulta
      </button>
      <button class="cc-btn cc-btn-update" v-if="consulta.id">Salvar</button>
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
} from "../util";

export default defineComponent({
  name: "ConsultaForm",
  props: ["his"],
  data() {
    const initial_iso_date =
      this.$store.state.calendar.current_date.toISODate();
    const initial_his = this.his;
    const hs_free_list = this.getHsFree(
      this.$store.state.calendar.current_date,
      initial_iso_date,
      initial_his
    );
    return {
      initial_iso_date,
      initial_his,
      consulta: {
        id: undefined,
        descricao: "",
        his: this.his,
        realizada: false,
      },
      cliente: {
        id: undefined,
        nascimento: new Date(),
        nome: "",
        sobrenome: "",
        cpf: "",
        telefone: "",
        endereco: "",
      },
      validate: {},
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
  },
  computed: {
    ...mapState("calendar", ["current_date"]),
  },
  methods: {
    closeAll(ev: Event) {
      return ev;
    },
    getHsFree(ncd: Date, initial_iso_date: string, initial_his: string) {
      const current_iso_date = ncd.toISODate();
      const { hs_free } = this.$store.getters["clinica/getDayDetails"](
        current_iso_date,
        ncd.getDay()
      );

      if (current_iso_date == initial_iso_date) {
        for (const hsf of hs_free) {
          if (hsf.start.his == initial_his) {
            hsf.selected = true;
            return hs_free;
          }
        }
      }

      if (hs_free[0]) hs_free[0].selected = true;
      return hs_free;
    },
  },
  watch: {
    current_date(ncd) {
      this.hs_free_list = this.getHsFree(
        ncd,
        this.initial_iso_date,
        this.initial_his
      );
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
