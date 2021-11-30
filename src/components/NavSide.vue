<template>
  <div id="nav-calendar">
    <div id="month-year-nav">
      <span> {{ calendar_month }}</span>
      <div class="nav-month">
        <span class="prev-next">
          <font-awesome-icon icon="chevron-left" @click="setMonth(-1)" />
        </span>
        <span class="prev-next" @click="setMonth(1)">
          <font-awesome-icon icon="chevron-right" />
        </span>
      </div>
    </div>
    <div id="six-weeks">
      <div id="week-calendar">
        <span> D </span>
        <span> S </span>
        <span> T </span>
        <span> Q </span>
        <span> Q </span>
        <span> S </span>
        <span> S </span>
      </div>
      <div id="four-two">
        <router-link
          v-for="d in dates"
          :key="d.day + '/' + d.month + '/' + d.year"
          :class="{
            'is-selected': d.isSelected,
            'out-month': d.outMonth,
            'is-today': d.isToday,
          }"
          :to="{
            name: period,
            params: { day: d.day, month: d.month, year: d.year },
          }"
        >
          {{ d.day }}
        </router-link>
      </div>
    </div>
  </div>

  <nav></nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "NavSide",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      dates: "calendar/getSixWeeks",
      calendar_month: "calendar/getMonthOffset",
    }),
    ...mapState("calendar", ["period", "current_date"]),
  },
  methods: {
    ...mapActions({ setMonth: "calendar/setOffsetMonth" }),
  },
});
</script>

<style scoped>
#nav-calendar {
  background-color: #00000007;
  padding: 4px;
  border-radius: 5px;
}

#month-year-nav {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}
#month-year-nav > span {
  font-size: 1rem;
}

.prev-next {
  margin: 0 0.1rem;
  padding: 0.3rem;
  border-radius: 50%;
  text-align: center;
  color: rgba(0, 0, 0, 0.493);
  cursor: pointer;
  transition: background-color 0.2s;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently*/
}
.prev-next > * {
  height: 1rem;
  width: 1rem;
  margin-bottom: -1px;
}
.prev-next:hover {
  background-color: rgba(0, 0, 0, 0.048);
  color: rgba(0, 0, 0, 0.726);
}
.prev-next:active {
  background-color: rgba(0, 0, 0, 0.253);
}

#six-weeks {
  margin-top: 5px;
  padding: 0 10px;
}
#week-calendar {
  display: flex;
  text-align: center;
  font-size: 0.85rem;
}
#week-calendar > span {
  flex: 1;
  display: block;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.63);
}

#four-two {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  margin-top: 2px;
}
#four-two > a {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  font-size: 0.75em;
  border-radius: 50%;
  padding: 0.5em;
  margin: 2px 4px;
  color: black;
  transition: background-color 0.25s;
  font-weight: 700;
}

#four-two > a:hover {
  background-color: rgba(0, 0, 0, 0.055);
}

a.is-selected {
  transition: background-color 0.4s, color 0.43s !important;
  background-color: #2231d956 !important;
  color: var(--font-secundary) !important;
}

a.out-month {
  color: rgba(0, 0, 0, 0.596) !important;
}

a.is-today {
  background-color: var(--bg-blue) !important;
  color: rgb(255, 255, 255) !important;
}

a.is-selected.out-month {
  background-color: #2231d923 !important;
  color: var(--font-secundary) !important;
}

nav {
  flex: 7;
  margin-top: 8px;
  background-color: rgb(209, 252, 252);
}
</style>
