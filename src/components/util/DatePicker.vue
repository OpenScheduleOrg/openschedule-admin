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
              <span class="noselect cc-prev-next" @click="setMonth(-1)">
                <font-awesome-icon icon="chevron-left"/>
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
  position: absolute;
  top: -4rem;
  left: 50%;
}
</style>
