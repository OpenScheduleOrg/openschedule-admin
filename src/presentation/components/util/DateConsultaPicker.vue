<template>
  <div class="form-group">
    <div class="date-picker">
      <div class="field-container" @click="show_calendar = !show_calendar">
        <font-awesome-icon icon="calendar-alt" class="field-icon" />
        <text-field
          :modelValue="current_date.toLocaleDateString()"
          :field_name="field_name"
          :maxlength="10"
          :not_editable="true"
          :manual_focus="show_calendar"
        ></text-field>
      </div>
      <div
        :class="{
          'calendar-picker': true,
          'show-calendar-picker': show_calendar,
        }"
      >
        <div class="calendar-header">
          <div class="calendar-detail">
            <span class="calendar-year"> {{ dpa.current_year }}</span>
            <span class="calendar-wd-month">
              {{ dpa.current_week_day }}, {{ dpa.current_month }}</span
            >
            <span class="calendar-day"> {{ dpa.current_day }}</span>
          </div>
        </div>
        <div class="calendar-main">
          <div class="calendar-nav">
            <span class="calendar-month-year">
              {{ dpa.offset_month }} de {{ dpa.offset_year }}</span
            >
            <div class="nav-month">
              <span class="noselect prev-next" @click="setMonth(-1)">
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span
                class="noselect go-today"
                @click="setNewCurrentDate({ name: period })"
                >Hoje</span
              >
              <span class="noselect prev-next" @click="setMonth(1)">
                <font-awesome-icon icon="chevron-right" />
              </span>
            </div>
          </div>
          <div class="six-weeks">
            <div class="week-days">
              <span> D </span>
              <span> S </span>
              <span> T </span>
              <span> Q </span>
              <span> Q </span>
              <span> S </span>
              <span> S </span>
            </div>
            <div class="four-two">
              <span
                class="noselect select-date"
                v-for="d in dpa.six_weeks"
                :key="d.day + '/' + d.month + '/' + d.year"
                :class="{
                  'is-selected': d.isSelected,
                  'out-month': d.outMonth,
                  'is-today': d.isToday,
                  'is-invalid-day': !d.valid_day,
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

<script lang="ts">
import { defineComponent } from "vue";
import TextField from "./TextField.vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "DateConsultaPicker",
  data() {
    return { show_calendar: false };
  },
  components: {
    TextField,
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
    setNewCurrentDate(route: any) {
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
.field-container {
  cursor: pointer;
}

.date-picker {
  position: relative;
}

.field-icon {
  margin-bottom: 18px;
}

.date-picker:focus-within,
.date-picker:hover {
  color: var(--line-color-hover);
}

.calendar-picker {
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.2s;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-20%);
  z-index: 88;
}

.calendar-picker.show-calendar-picker {
  visibility: visible;
  opacity: 1;
  left: 40px;
  transform: translateY(0);
}
</style>
