<template>
  <div class="cc-form-group">
    <div class="cc-date-picker">
      <div class="cc-field-container" @click="show_calendar = !show_calendar">
        <font-awesome-icon icon="calendar-alt" class="cc-field-icon" />
        <input-text
          :modelValue="date_text"
          ref="inpud-"
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
            <span class="cc-calendar-year">
              {{ current_date.getFullYear() }}</span
            >
            <span class="cc-calendar-wd-month">
              {{ current_wd_text }}, {{ current_month_text }}</span
            >
            <span class="cc-calendar-day"> {{ current_date.getDate() }}</span>
          </div>
        </div>

        <div class="cc-calendar-main" v-if="show_years">
          <div class="cc-calendar-nav cc-calendar-show-years">
            <span class="cc-calendar-month-year">
              {{ decade_start }} -
              {{ decade_end }}
            </span>
            <div class="cc-nav-month">
              <span
                class="noselect cc-prev-next"
                @click="
                  (decade_end = decade_start - 1),
                    (decade_start -= 10),
                    getTenYears()
                "
              >
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span
                class="noselect cc-prev-next"
                @click="
                  (decade_start = decade_end), (decade_end += 10), getTenYears()
                "
              >
                <font-awesome-icon icon="chevron-right" />
              </span>
            </div>
          </div>
          <div class="cc-ten-years">
            <span
              class="noselect cc-select-date"
              v-for="y in ten_years"
              :key="y"
              :class="{
                'is-selected': offset_date.getFullYear() == y,
              }"
              @click="setDateOffsetYear(y)"
            >
              {{ y }}
            </span>
          </div>
        </div>

        <div class="cc-calendar-main" v-else-if="show_months">
          <div class="cc-calendar-nav cc-calendar-show-months">
            <span
              class="cc-calendar-month-year"
              @click="getTenYears(), (show_years = true)"
            >
              {{ offset_date.getFullYear() }}
            </span>
            <div class="cc-nav-month">
              <span
                class="noselect cc-prev-next"
                @click="setOffsetDateYear(-1)"
              >
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span class="noselect cc-prev-next" @click="setOffsetDateYear(1)">
                <font-awesome-icon icon="chevron-right" />
              </span>
            </div>
          </div>
          <div class="cc-twelve-months">
            <span
              class="noselect cc-select-date"
              v-for="m in months"
              :key="m.i"
              :class="{
                'is-selected': offset_date.getMonth() == m.i,
              }"
              @click="setDateOffsetMonth(m.i)"
            >
              {{ m.nome }}
            </span>
          </div>
        </div>

        <div class="cc-calendar-main" v-else>
          <div class="cc-calendar-nav">
            <span class="cc-calendar-month-year" @click="show_months = true">
              {{ offset_month_year }}
            </span>
            <div class="cc-nav-month">
              <span
                class="noselect cc-prev-next"
                @click="setOffsetDateMonth(-1)"
              >
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span
                class="noselect cc-go-today"
                @click="setNewCurrentDate(new Date())"
                >Hoje</span
              >
              <span
                class="noselect cc-prev-next"
                @click="setOffsetDateMonth(1)"
              >
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
                v-for="d in four_two"
                :key="d.day + '/' + d.month + '/' + d.year"
                :class="{
                  'is-selected': d.isSelected,
                  'out-month': d.outMonth,
                  'is-today': d.isToday,
                }"
                @click="setNewCurrentDate(d.date)"
              >
                {{ d.date.getDate() }}
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

export default defineComponent({
  name: "DatePicker",
  data() {
    const current_date = this.modelValue || new Date();
    const current_month_text = Month[current_date.getMonth()][1];
    const current_wd_text = Week[current_date.getDay()][1];
    const offset_date = new Date(
      current_date.getFullYear(),
      current_date.getMonth()
    );
    const four_two = this.getSixWeeks(offset_date, current_date);
    const offset_month_year =
      Month[offset_date.getMonth()][0] + " de " + offset_date.getFullYear();

    const months = [];

    for (let i = 0; i < Month.length; i++)
      months.push({ nome: Month[i][0], i });
    const decade_start = 0;
    const decade_end = 0;

    return {
      current_date,
      current_month_text,
      current_wd_text,
      four_two,
      offset_date,
      offset_month_year,
      show_calendar: false,
      show_months: false,
      show_years: false,
      months,
      ten_years: [],
      decade_start,
      decade_end,
    };
  },
  components: {
    InputText,
  },
  props: {
    modelValue: Date,
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
  },
  watch: {
    modelValue(n) {
      if (n) this.setNewCurrentDate(n);
    },
  },
  emits: ["update:modelValue"],
  computed: {
    date_text() {
      if (!this.modelValue) return "Campo vazio";
      return this.current_date.toLocaleDateString();
    },
  },
  methods: {
    getSixWeeks(offset_date, current_date) {
      const days = [];
      const today = new Date();

      let d = offset_date.addDays(-offset_date.getDay() - 1);
      for (let i = 0; i < 42; i++) {
        d = d.addDays(1);
        days[i] = {
          date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
          outMonth: d.getMonth() != offset_date.getMonth(),
          isToday:
            today.getDate() == d.getDate() &&
            today.getMonth() == d.getMonth() &&
            today.getFullYear() == d.getFullYear(),
          isSelected:
            current_date.getDate() == d.getDate() &&
            current_date.getMonth() == d.getMonth() &&
            current_date.getFullYear() == d.getFullYear(),
        };
      }

      return days;
    },
    setNewCurrentDate(new_date) {
      this.current_date = new_date;
      this.current_month_text = Month[new_date.getMonth()][1];
      this.current_wd_text = Week[new_date.getDay()][1];
      this.offset_date = new Date(new_date.getFullYear(), new_date.getMonth());
      this.four_two = this.getSixWeeks(this.offset_date, new_date);
      this.offset_month_year =
        Month[this.offset_date.getMonth()][0] +
        " de " +
        this.offset_date.getFullYear();

      this.show_calendar = false;

      this.$emit("update:modelValue", new_date);
    },
    setOffsetDateMonth(offset) {
      this.offset_date.setMonth(this.offset_date.getMonth() + offset);
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
      this.offset_month_year =
        Month[this.offset_date.getMonth()][0] +
        " de " +
        this.offset_date.getFullYear();
    },
    setOffsetDateYear(offset) {
      this.offset_date = new Date(
        this.offset_date.getFullYear() + offset,
        this.offset_date.getMonth()
      );
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
    },
    setDateOffsetMonth(m) {
      this.offset_date.setMonth(m);
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
      this.offset_month_year =
        Month[this.offset_date.getMonth()][0] +
        " de " +
        this.offset_date.getFullYear();

      this.show_months = false;
    },
    setDateOffsetYear(y) {
      this.offset_date.setFullYear(y);
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
      this.getTenYears();

      this.show_years = false;
    },
    getTenYears() {
      let decade_start = 0;
      let decade_end = 0;
      if (!this.show_years) {
        decade_end = new Date().getFullYear();
        decade_start = decade_end - 10;
        const offset_year = this.offset_date.getFullYear();
        while (offset_year <= decade_start || offset_year > decade_end) {
          if (offset_year <= decade_start) {
            decade_end = decade_start;
            decade_start -= 10;
          }
          if (offset_year > decade_end) {
            decade_start = decade_end;
            decade_end += 10;
          }
        }
        this.decade_start = decade_start + 1;
        this.decade_end = decade_end;
      } else {
        decade_start = this.decade_start;
        decade_end = this.decade_end;
      }

      const years = [];
      for (++decade_start; decade_start <= decade_end; decade_start++) {
        years.push(decade_start);
      }

      this.ten_years = years;
    },
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
  z-index: 88;
}

.cc-calendar-picker.cc-show-calendar-picker {
  visibility: visible;
  opacity: 1;
  left: 30px;
  transform: translateY(0);
  transform: translateY(-88%);
}

.cc-calendar-main {
  height: 250px;
  width: 230px;
}

.cc-calendar-nav {
  height: 13%;
}
.cc-calendar-nav.cc-calendar-show-months,
.cc-calendar-nav.cc-calendar-show-years {
  border-radius: 3px;
  background-color: rgb(240, 240, 240);
  margin: 0 -4px;
  margin-bottom: 3px;
}
.cc-calendar-nav.cc-calendar-show-months > *:first-child,
.cc-calendar-nav.cc-calendar-show-years > *:first-child {
  margin-left: 30px;
}
.cc-calendar-nav.cc-calendar-show-months > *:last-child,
.cc-calendar-nav.cc-calendar-show-years > *:last-child {
  margin-right: 30px;
}

.cc-calendar-main span {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
}

.cc-twelve-months,
.cc-ten-years {
  display: grid;
  height: 87%;
  gap: 2px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
}

.cc-ten-years > *:last-child {
  grid-column: 2;
}

.cc-twelve-months span:hover,
.cc-ten-years span:hover {
  background-color: rgba(0, 0, 0, 0.212);
}
</style>
