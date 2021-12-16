<template>
  <div class="cc-form-group">
    <div class="cc-date-picker">
      <div class="cc-field-container" @click="show_calendar = !show_calendar">
        <font-awesome-icon icon="calendar-alt" class="cc-field-icon" />
        <input-text
          :modelValue="current_date.toLocaleDateString()"
          :field_name="field_name"
          :maxlength="10"
          :not_editable="true"
          :manual_focus="show_calendar"
        ></input-text>
      </div>
      <div
        :class="{
          'cc-calendar-picker': true,
          'cc-show-calendar-picker': show_calendar,
        }"
      >
        <div class="cc-calendar-header">
          <div class="cc-calendar-detail">
            <span class="cc-calendar-year"> {{ dpa.current_year }}</span>
            <span class="cc-calendar-wd-month">
              {{ dpa.current_week_day }}, {{ dpa.current_month }}</span
            >
            <span class="cc-calendar-day"> {{ dpa.current_day }}</span>
          </div>
        </div>
        <div class="cc-calendar-main">
          <div class="cc-calendar-nav">
            <span class="cc-calendar-month-year">
              {{ dpa.offset_month }} de {{ dpa.offset_year }}</span
            >
            <div class="cc-nav-month">
              <span class="noselect cc-prev-next" @click="setMonth(-1)">
                <font-awesome-icon icon="chevron-left" />
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
                v-for="d in dpa.six_weeks"
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
import { mapState, mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "DateConsultaPicker",
  data() {
    return { show_calendar: false };
  },
  components: {
    InputText,
  },
  computed: {
    ...mapGetters({
      dpa: "calendar/getDatePickerSixWeeks",
    }),
    ...mapState("calendar", ["period", "current_date"]),
  },
  props: {
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
  },
  emits: ["update:modelValue"],
  methods: {
    setNewCurrentDate(route) {
      this.$router.push(route);
      this.show_calendar = false;
    },
    ...mapActions({
      setMonth: "calendar/setOffsetMonthPicker",
      setCurrentDate: "calendar/setCurrentDate",
    }),
  },
});
</script>

<style scoped>
.cc-field-container {
  cursor: pointer;
}

.cc-date-picker {
  position: relative;
}

.cc-field-icon {
  margin-bottom: 18px;
}

.cc-date-picker:focus-within,
.cc-date-picker:hover {
  color: var(--line-color-hover);
}

.cc-calendar-picker {
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.2s;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-20%);
  z-index: 88;
}

.cc-calendar-picker.cc-show-calendar-picker {
  visibility: visible;
  opacity: 1;
  left: 40px;
  transform: translateY(0);
}
</style>
