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
    <record v-if="showNewAppointmentModal" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import NavTop from "@/presentation/components/navigation/NavTop.vue";
import NavSide from "@/presentation/components/navigation/NavSide.vue";
import Record from "@/presentation/components/Record.vue";

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
    Record,
  },
  computed: mapState("record", {
    showNewAppointmentModal: "showModal",
  }),
  created(){
    this.$store.dispatch("record/updateActuationsOptions")
  },
  updated: setScrolled,
  mounted: setScrolled,
});
</script>

<style scoped>
#main.grid-container {
  grid-template:
    [header-left] "hd hd" 7.5vh [header-right]
    [main-left] "nav  main" 2fr / 370px 1fr [main-right];
  grid-template-rows: 8.6vmin minmax(0, 1fr);
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
  padding: 0.5rem 0.7rem 0.7rem 0.7rem;
  justify-content: space-between;
  overflow: auto;
}
main.grid-item {
  position: relative;
  flex-direction: column;
  grid-area: main;
  padding: 0.3rem 0;
}
</style>
