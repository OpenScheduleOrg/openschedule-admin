<template>
  <modal>
    <h1 class="modal-title">Nova consulta</h1>
    <div class="form-container">
      <h2>Consulta</h2>
      <Form>
        <date-picker
          v-model="consulta.marcada"
          :field_name="'Teste'"
          :valid="false"
        ></date-picker>
      </Form>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../Modal.vue";
import { Form, DatePicker } from "../util";

export default defineComponent({
  name: "ConsultaForm",
  props: ["datetime"],
  data() {
    return {
      consulta: { descricao: "", marcada: this.datetime },
      cliente: {},
      validate: {},
    };
  },
  components: {
    Modal,
    Form,
    DatePicker,
  },
});
</script>

<style scoped></style>
