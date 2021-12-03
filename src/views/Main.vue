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

function setScrolled() {
  const els_scrolled = document.getElementsByClassName("scrolled");

  for (let el of els_scrolled) {
    el.addEventListener("scroll", () => {
      if (el.scrollTop) {
        el.classList.add("isScrolled");
      } else el.classList.remove("isScrolled");
    });
  }
}

export default defineComponent({
  name: "Main",
  components: {
    NavTop,
    NavSide,
  },
  updated: setScrolled,
  mounted: setScrolled,
});
</script>
