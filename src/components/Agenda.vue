<template>
  <router-view @new-consulta="setHis" v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"> </component>
    </transition>
  </router-view>
  <consulta-form
    v-if="show_consulta_form"
    @close_modal="show_consulta_form = false"
    :his="his"
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
    his: number | undefined;
    show_consulta_form: boolean;
    show_consulta_detail: boolean;
  } {
    return {
      his: undefined,
      show_consulta_form: false,
      show_consulta_detail: false,
    };
  },
  methods: {
    setHis(his: number) {
      this.his = his;
      this.show_consulta_form = true;
    },
  },
  beforeRouteEnter: agendaGuard,
  beforeRouteUpdate: agendaGuard,
});
</script>
