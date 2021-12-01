<template>
  <cliente-list />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClienteList from "./cliente/ClienteList.vue";

export default defineComponent({
  name: "profile",
  components: {
    ClienteList,
  },
});
</script>
