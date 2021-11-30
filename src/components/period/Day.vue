<template>
  <h1>
    DIA: {{ $route.params }}
  </h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Day",
});
</script>
