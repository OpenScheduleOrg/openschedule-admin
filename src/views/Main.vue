<template>
  <div class="grid-container">
    <header class="grid-item">
      <NavTop />
    </header>
    <aside class="grid-item">
      <NavSide />
    </aside>
    <main class="grid-item">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NavTop from "@/components/NavTop.vue";
import NavSide from "@/components/NavSide.vue";

export default defineComponent({
  name: "Main",
  components: {
    NavTop,
    NavSide,
  },
});
</script>
