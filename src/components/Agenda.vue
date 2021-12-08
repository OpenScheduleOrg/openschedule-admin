<template>
  <router-view @new-consulta="setDatetime" />
  <consulta-form
    v-if="show_consulta_form"
    @new-consulta="setDatetime"
    @close_modal="show_consulta_form = false"
    :datetime="datetime"
  ></consulta-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { agendaGuard } from "@/router/guards";
import ConsultaForm from "./consulta/ConsultaForm.vue";

export default defineComponent({
  name: "Agenda",
  components: {
    ConsultaForm,
  },
  data(): {
    datetime: Date | undefined;
    show_consulta_form: boolean;
    show_consulta_detail: boolean;
  } {
    return {
      datetime: undefined,
      show_consulta_form: false,
      show_consulta_detail: false,
    };
  },
  methods: {
    setDatetime(datetime: Date) {
      this.datetime = datetime;
      this.show_consulta_form = true;
    },
  },
  beforeRouteEnter: agendaGuard,
  beforeRouteUpdate: agendaGuard,
});
</script>
