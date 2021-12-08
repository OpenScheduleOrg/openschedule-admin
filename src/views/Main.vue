<template>
  <div id="main" class="grid-container">
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
      const el_weeks_days = el.querySelector(".week-row") as Element;
      const el_scrolled = el.querySelector(".week-hours-area") as Element;

      const gb =
        el_weeks_days.getBoundingClientRect().top +
        el_weeks_days.getBoundingClientRect().height;

      if (gb > el_scrolled.getBoundingClientRect().top) {
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

<style scoped>
#main.grid-container {
  grid-template:
    [header-left] "hd hd" 11vh [header-right]
    [main-left] "nav  main" 1fr / 22vw 1fr [main-right];
  grid-template-rows: 11vh minmax(0, 1fr);
  grid-gap: 0.15rem;
  height: 100vh;
  width: 100vw;
}
header.grid-item {
  background-color: var(--bg-header);
  grid-area: hd;
  justify-content: space-between;
  padding: 3px 0.5rem;
  color: var(--font-light);
}
aside.grid-item {
  grid-area: nav;
  flex-direction: column;
  padding: 0.7rem;
  justify-content: space-between;
}
main.grid-item {
  flex-direction: column;
  grid-area: main;
  position: relative;
  padding: 0.3rem 0;
}
</style>
