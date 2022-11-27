<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"> </component>
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { agendaGuard } from "@/main/router/guards";

export default defineComponent({
  name: "Agenda",
  beforeRouteEnter: agendaGuard,
  beforeRouteUpdate: agendaGuard,
});
</script>
