<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { agendaGuard } from "@/router/guards"

export default defineComponent({
  name: "Agenda",
  beforeRouteUpdate: agendaGuard,
});
</script>
