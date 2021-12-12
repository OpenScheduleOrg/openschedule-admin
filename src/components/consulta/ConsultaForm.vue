<template>
  <modal>
    <h1 class="modal-title">Nova consulta</h1>
    <div class="form-container">
      <h2>Consulta</h2>
      <Form>
        <date-picker :field_name="'Data Marcada'"></date-picker>
      </Form>
    </div>
    {{ date }}
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../Modal.vue";
import { Form, DatePicker } from "../util";

export default defineComponent({
  name: "ConsultaForm",
  props: ["hs"],
  data() {
    const date = new Date(this.$store.state.calendar.current_date.valueOf());
    date.setSeconds(this.hs);
    return {
      consulta: {
        descricao: "",
        hour_in_seconds: this.hs,
      },
      date,
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
