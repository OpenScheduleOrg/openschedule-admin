<template>
  <funcionario-list />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FuncionarioList from "./funcionario/FuncionarioList.vue";

export default defineComponent({
  name: "profile",
  components: {
    FuncionarioList,
  },
});
</script>
