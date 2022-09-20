<template>
  <router-view
    @new-consulta="setHis"
    @update-consulta="setConsulta"
    v-slot="{ Component }"
  >
    <transition name="fade" mode="out-in">
      <component :is="Component"> </component>
    </transition>
  </router-view>
  <transition name="fade-slide-modal" mode="out-in">
    <consulta-form
      v-if="show_consulta_form"
      @close_modal="(show_consulta_form = false), (consulta = undefined)"
      :his="his"
      :s_consulta="consulta"
      :s_cliente="cliente"
    ></consulta-form>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { agendaGuard } from "@/router/guards";
import ConsultaForm from "./consulta/ConsultaForm.vue";
import { Consulta, Cliente, APIResponse } from "@/interfaces";
import { getClientes } from "@/services/cliente";

export default defineComponent({
  name: "Agenda",
  components: {
    ConsultaForm,
  },
  data(): {
    his: number | undefined;
    show_consulta_form: boolean;
    consulta?: Consulta;
    cliente?: Cliente;
  } {
    return {
      his: undefined,
      show_consulta_form: false,
      consulta: undefined,
      cliente: undefined
    };
  },
  methods: {
    setHis(his: number) {
      this.his = his;
      this.show_consulta_form = true;
    },
    async setConsulta(c: Consulta) {
      const res = (await getClientes({}, c.cliente_id).catch((e) => {
        console.error(e);
        this.$emit("close_modal");
      })) as APIResponse;

      this.cliente  = res.data.cliente;
      this.consulta = c;
      this.show_consulta_form = true;
    },
  },
  beforeRouteEnter: agendaGuard,
  beforeRouteUpdate: agendaGuard,
});
</script>
