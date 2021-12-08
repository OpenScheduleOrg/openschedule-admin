<template>
  <modal>
    <h1 class="modal-title">Nova consulta</h1>
    <div class="form-container">
      <h2>Consulta</h2>
      <Form>
        <input-text
          v-model="consulta.marcada"
          :field_name="'TTTT'"
        ></input-text>
      </Form>
    </div>
    {{ consulta.marcada }}
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../Modal.vue";
import { Form, InputText } from "../form";

export default defineComponent({
  name: "ConsultaForm",
  props: ["datetime"],
  data() {
    return {
      consulta: { descricao: "", marcada: "TTTT"},
      cliente: {},
      validate: {},
    };
  },
  components: {
    Modal,
    Form,
    InputText,
  },
});
</script>

<style scoped></style>
