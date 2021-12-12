<template>
  <div class="cc-form-group">
    <div class="cc-date-picker" @click="showCalendar">
      <font-awesome-icon icon="calendar-alt" class="cc-calendar-icon" />
      <input-text
        v-model="date"
        @update:modelValue="setVModel"
        :field_name="field_name"
      ></input-text>
      <div class="cc-calendar-picker">
        <div class="cc-calendar-header">
          <div class="cc-calendar-detail">
            <span class="cc-calendar-year"> {{ year }}</span>
            <span class="cc-calendar-wd-month">
              {{ week_day[1] }}, {{ month[1] }}</span
            >
            <span class="cc-calendar-day"> {{ day }}</span>
          </div>
        </div>
        <div class="cc-calendar-main">
          <div class="cc-calendar-nav">
            <span class="cc-calendar-month-year">
              {{ month[0] }} de {{ year }}</span
            >
            <div class="cc-nav-month">
              <span class="noselect cc-prev-next">
                <font-awesome-icon icon="chevron-left" @click="setMonth(-1)" />
              </span>
              <span
                class="noselect cc-go-today"
                @click="setNewCurrentDate({ name: period })"
                >Hoje</span
              >
              <span class="noselect cc-prev-next" @click="setMonth(1)">
                <font-awesome-icon icon="chevron-right" />
              </span>
            </div>
          </div>
          <div class="cc-six-weeks">
            <div class="cc-week-days">
              <span> D </span>
              <span> S </span>
              <span> T </span>
              <span> Q </span>
              <span> Q </span>
              <span> S </span>
              <span> S </span>
            </div>
            <div class="cc-four-two">
              <span
                class="noselect cc-select-date"
                v-for="d in six_weeks"
                :key="d.day + '/' + d.month + '/' + d.year"
                :class="{
                  'is-selected': d.isSelected,
                  'out-month': d.outMonth,
                  'is-today': d.isToday,
                  'is-invalid-day': !d.hs_free.length,
                }"
                @click="
                  setNewCurrentDate({
                    name: period,
                    params: { day: d.day, month: d.month + 1, year: d.year },
                  })
                "
              >
                {{ d.day }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import InputText from "./InputText.vue";
import { Month, Week } from "@/constants";
import { mapState, mapGetters } from "vuex";

export default defineComponent({
  name: "InputDate",
  data() {
    const current_date = this.$store.state.calendar.current_date;

    const date = current_date.toLocaleDateString();
    const year = current_date.getFullYear();
    const month = Month[current_date.getMonth()];
    const day = current_date.getDate();
    const week_day = Week[current_date.getDay()];

    const six_weeks =
      this.$store.getters["calendar/getDatePickerSixWeeks"](current_date);
    return {
      date,
      day,
      month,
      year,
      week_day,
      six_weeks,
      offset: 0,
    };
  },
  components: {
    InputText,
  },
  computed: {
    ...mapGetters({
      getSixWeeks: "calendar/getDatePickerSixWeeks",
    }),
    ...mapState("calendar", ["period", "current_date"]),
  },
  props: {
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
  },
  watch: {
    current_date() {
      const current_date = this.$store.state.calendar.current_date;

      this.date = current_date.toLocaleDateString();
      this.year = current_date.getFullYear();
      this.month = Month[current_date.getMonth()];
      this.day = current_date.getDate();
      this.week_day = Week[current_date.getDay()];

      this.six_weeks = this.getSixWeeks(current_date);
      this.offset = 0;
    },
  },

  emits: ["update:modelValue"],
  methods: {
    setVModel(e) {
      const ds = e.split("/").map((v) => Number(v));

      const dt = new Date(ds[2], ds[1] - 1, ds[0]);

      if (dt == "Invalid Date") {
        this.data = "Invalid Date";
      } else this.$emit("update:modelValue", dt);
    },
    showCalendar(e) {
      console.log(e);
    },
    setNewCurrentDate(route) {
      this.$router.push(route);
    },
    setMonth(o) {
      const date = new Date(this.current_date.valueOf());
      this.offset = this.offset + o;

      date.setMonth(date.getMonth() + this.offset);

      this.six_weeks = this.getSixWeeks(date);
      this.year = date.getFullYear();
      this.month = Month[date.getMonth()];
    },
  },
});
</script>

<style scoped>
.cc-date-picker {
  position: relative;
  display: flex;
  flex-direction: center;
  align-items: center;
}

.cc-date-picker:focus-within,
.cc-date-picker:hover {
  color: var(--line-color-hover);
}

.cc-calendar-icon {
  font-size: 1.2rem;
  margin: 0 8px;
  transition: all 0.3s;
}

.cc-calendar-picker {
  background-color: rgb(255, 255, 255);
  color: rgb(50, 50, 50);
  position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  top: -4rem;
  left: 50%;
  border-radius: 4px;
}

.cc-calendar-header,
.cc-calendar-main {
  padding: 0.4rem;
}

.cc-calendar-header {
  background-color: var(--bg-blue);
  border-radius: 4px;
  padding-bottom: 4px;
}

.cc-calendar-main {
  padding-top: 4px;
}

.cc-calendar-detail {
  display: grid;
  height: 5em;
  color: white;
  grid-template-areas: "year day day day" "wdm day day day" "wdm day day day" "wdm day day day" "wdm day day day" "wdm day day day";
}

.cc-calendar-detail > * {
  display: flex;
}

.cc-calendar-detail .cc-calendar-year {
  grid-area: year;
}
.cc-calendar-detail .cc-calendar-wd-month {
  grid-area: wdm;
  font-size: 2em;
  align-items: center;
}
.cc-calendar-detail .cc-calendar-day {
  grid-area: day;
  align-items: center;
  justify-content: center;
  font-size: 3.5em;
}

.cc-calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  padding: 4px 0;
}

.cc-calendar-nav .cc-calendar-month-year {
  font-weight: bold;
}

.cc-nav-month {
  display: flex;
  width: 70px;
  align-items: center;
  justify-content: space-around;
  font-size: 0.9em;
}

.cc-nav-month > * {
  display: flex;
  justify-content: center;
  align-items: center;
}
.cc-prev-next {
  height: 1.3rem;
  width: 1.3rem;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cc-nav-month .cc-go-today {
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 1px;
  transition: background-color 0.2s;
}

.cc-prev-next:hover,
.cc-go-today:hover {
  background-color: rgba(0, 0, 0, 0.048);
  color: rgba(0, 0, 0, 0.726);
}

.cc-prev-next:active,
.cc-go-today:active {
  background-color: rgba(0, 0, 0, 0.253);
}

.cc-six-weeks {
  display: flex;
  flex-direction: column;
}

.cc-week-days,
.cc-four-two {
  display: grid;
  grid-template-columns: repeat(7, 26px);
  gap: 2px;
  font-size: 0.9em;
  font-weight: bold;
  margin: 2px 0;
}

.cc-week-days {
  border-top: 1px solid rgba(54, 54, 54, 0.349);
  border-bottom: 1px solid rgba(54, 54, 54, 0.349);
}

.cc-week-days,
.cc-four-two {
  grid-auto-rows: 26px;
}

.cc-week-days > span,
.cc-four-two > .cc-select-date {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.cc-four-two > .cc-select-date {
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.5s;
}

.cc-four-two > .cc-select-date:hover {
  background-color: rgba(0, 0, 0, 0.212);
}
.cc-four-two > .cc-select-date:active {
  background-color: rgba(0, 0, 0, 0.512);
}

.cc-select-date.is-selected {
  pointer-events: none;
}

.cc-select-date.is-today:not(.is-selected):hover {
  transition: all 0.4s;
  background-color: rgb(1, 73, 207) !important;
}

.cc-select-date.out-month {
  color: rgba(0, 0, 0, 0.596);
}

.cc-select-date.is-invalid-day {
  pointer-events: none;
  cursor: initial;
  color: rgba(0, 0, 0, 0.3);
}

.cc-select-date.is-selected.out-month {
  background-color: #2231d923 !important;
  color: var(--font-secundary) !important;
}

.cc-select-date.is-today.out-month {
  transition: background-color 0.3s;
  background-color: #006fd6d3 !important;
  color: rgb(241, 240, 240) !important;
}
</style>
