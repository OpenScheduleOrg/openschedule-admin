<template>
  <div
    :class="{
      'form-group': true,
      'input-is-invalid': !!validation_message,
    }"
  >
    <div class="field-container">
      <div
        :class="{
          'input-field': true,
          'input-not-empty': visible || date_text,
          'input-disabled': disabled,
        }"
        @click="visible ? hide() : show()"
      >
        <label class="field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>
        <input
          type="text"
          ref="input_text"
          name="input-field-text"
          :class="{
            'show-time': true,
          }"
          :value="date_text"
          autocomplete="off"
          readonly="true"
          tabindex="-1"
        />
        <div
          :class="{
            'drop-icon-wrapper': true,
          }"
        >
          <font-awesome-icon class="drop-icon" :icon="['fa', 'calendar-alt']" />
        </div>
      </div>
      <div
        :class="{
          'calendar-picker': true,
          'show-calendar-picker': visible,
        }"
      >
        <div class="calendar-header">
          <div class="calendar-detail">
            <span class="calendar-year"> {{ current_date.getFullYear() }}</span>
            <span class="calendar-wd-month">
              {{ current_wd_text }}, {{ current_month_text }}</span
            >
            <span class="calendar-day"> {{ current_date.getDate() }}</span>
          </div>
        </div>
        <div class="calendar-main" v-if="show_years">
          <div class="calendar-nav calendar-show-years">
            <span class="calendar-month-year">
              {{ decade_start }} -
              {{ decade_end }}
            </span>
            <div class="nav-month">
              <span
                class="noselect prev-next"
                @click="
                  (decade_end = decade_start - 1),
                    (decade_start -= 10),
                    getTenYears()
                "
              >
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span
                class="noselect prev-next"
                @click="
                  (decade_start = decade_end), (decade_end += 10), getTenYears()
                "
              >
                <font-awesome-icon icon="chevron-right" />
              </span>
            </div>
          </div>
          <div class="ten-years">
            <span
              class="noselect select-date"
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

        <div class="calendar-main" v-else-if="show_months">
          <div class="calendar-nav calendar-show-months">
            <span
              class="calendar-month-year"
              @click="getTenYears(), (show_years = true)"
            >
              {{ offset_date.getFullYear() }}
            </span>
            <div class="nav-month">
              <span class="noselect prev-next" @click="setOffsetDateYear(-1)">
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span class="noselect prev-next" @click="setOffsetDateYear(1)">
                <font-awesome-icon icon="chevron-right" />
              </span>
            </div>
          </div>
          <div class="twelve-months">
            <span
              class="noselect select-date"
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

        <div class="calendar-main" v-else>
          <div class="calendar-nav">
            <span class="calendar-month-year" @click="show_months = true">
              {{ offset_month_year }}
            </span>
            <div class="nav-month">
              <span class="noselect prev-next" @click="setOffsetDateMonth(-1)">
                <font-awesome-icon icon="chevron-left" />
              </span>
              <span
                class="noselect go-today"
                @click="setNewCurrentDate(new Date())"
                >Hoje</span
              >
              <span class="noselect prev-next" @click="setOffsetDateMonth(1)">
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
    <div class="advise">
      <font-awesome-icon v-if="validation_message" icon="exclamation-circle" />
      <span> {{ validation_message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Month, WeekDayShort } from "@/common/constants";

import { addDays } from "date-fns";

export default defineComponent({
  name: "DatePicker",
  data() {
    const current_date = this.modelValue || new Date();
    const current_month_text = Month[current_date.getMonth()][1];
    const current_wd_text = WeekDayShort[current_date.getDay()];
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
      visible: false,
      show_months: false,
      show_years: false,
      months,
      ten_years: [] as number[],
      decade_start,
      decade_end,
      validation_message: undefined as string | undefined,
    };
  },
  props: {
    modelValue: Date,
    name: String,
    label: String,
    validation: Object,
    required: Boolean,
    disabled: Boolean,
  },
  watch: {
    modelValue(n) {
      if (n) this.setNewCurrentDate(n);
    },
  },
  emits: ["update:modelValue", "updateValidation"],
  computed: {
    date_text() {
      if (!this.modelValue) return "";
      return this.current_date.toLocaleDateString();
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.validate();
    },
    validate() {
      if (this.required && !this.date_text)
        this.validation_message = "Seleção obrigatória";
      else this.validation_message = undefined;
      this.$emit(
        "updateValidation",
        this.name,
        !!this.date_text || !this.required
      );
    },
    getSixWeeks(offset_date: any, current_date: any) {
      const days = [];
      const today = new Date();

      let d = addDays(offset_date, -offset_date.getDay() - 1);
      for (let i = 0; i < 42; i++) {
        d = addDays(d, 1);
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
    setNewCurrentDate(new_date: Date) {
      this.current_date = new_date;
      this.current_month_text = Month[new_date.getMonth()][1];
      this.current_wd_text = WeekDayShort[new_date.getDay()];
      this.offset_date = new Date(new_date.getFullYear(), new_date.getMonth());
      this.four_two = this.getSixWeeks(this.offset_date, new_date);
      this.offset_month_year =
        Month[this.offset_date.getMonth()][0] +
        " de " +
        this.offset_date.getFullYear();

      this.hide();
      this.$emit("update:modelValue", new_date);
    },
    setOffsetDateMonth(offset: number) {
      this.offset_date.setMonth(this.offset_date.getMonth() + offset);
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
      this.offset_month_year =
        Month[this.offset_date.getMonth()][0] +
        " de " +
        this.offset_date.getFullYear();
    },
    setOffsetDateYear(offset: number) {
      this.offset_date = new Date(
        this.offset_date.getFullYear() + offset,
        this.offset_date.getMonth()
      );
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
    },
    setDateOffsetMonth(m: number) {
      this.offset_date.setMonth(m);
      this.four_two = this.getSixWeeks(this.offset_date, this.current_date);
      this.offset_month_year =
        Month[this.offset_date.getMonth()][0] +
        " de " +
        this.offset_date.getFullYear();

      this.show_months = false;
    },
    setDateOffsetYear(y: number) {
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
.field-container {
  cursor: initial;
}

.input-field {
  cursor: pointer;
}

.show-time {
  display: block;
  background-color: inherit;
  padding: 12px 0 6px 0;
  cursor: inherit;
}

.drop-icon-wrapper {
  position: absolute;
  top: 10px;
  transform: translateY(60%);
  right: 4px;
  font-size: 1.1em;
  width: auto;
}

.field-icon {
  margin-bottom: 18px;
}

.calendar-picker {
  position: absolute;
  top: -8em;
  left: 0;
  transition: all 0.2s;
  visibility: hidden;
  opacity: 0;
  z-index: 88;
}

.calendar-picker.show-calendar-picker {
  visibility: visible;
  opacity: 1;
  top: 99%;
}

.calendar-main {
  height: 250px;
  width: 230px;
}

.calendar-nav {
  height: 13%;
}
.calendar-nav.calendar-show-months,
.calendar-nav.calendar-show-years {
  border-radius: 3px;
  background-color: rgb(240, 240, 240);
  margin: 0 -4px;
  margin-bottom: 3px;
}
.calendar-nav.calendar-show-months > *:first-child,
.calendar-nav.calendar-show-years > *:first-child {
  margin-left: 30px;
}
.calendar-nav.calendar-show-months > *:last-child,
.calendar-nav.calendar-show-years > *:last-child {
  margin-right: 30px;
}

.calendar-main span {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
}

.twelve-months,
.ten-years {
  display: grid;
  height: 87%;
  gap: 2px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
}

.ten-years > *:last-child {
  grid-column: 2;
}

.twelve-months span:hover,
.ten-years span:hover {
  background-color: rgba(0, 0, 0, 0.212);
}

.drop-icon-wrapper {
  position: absolute;
  top: 10px;
  transform: translateY(60%);
  right: 4px;
  font-size: 1.1em;
  width: auto;
}

.input-disabled .drop-icon-wrapper {
  color: rgba(85, 85, 85, 0.363);
}
</style>
