<template>
  <clinica-detail />
  <horario-list />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClinicaDetail from "./clinica/ClinicaDetail.vue";
import HorarioList from "./horario/HorarioList.vue";

export default defineComponent({
  name: "Clinica",
  components: {
    ClinicaDetail,
    HorarioList,
  },
});
</script>
