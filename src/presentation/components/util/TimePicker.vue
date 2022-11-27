<template>
  <div
    :class="{
      'form-group': true,
      'input-is-invalid': validation_message,
    }"
  >
    <div class="field-container">
      <div
        :class="{
          'input-field': true,
          'input-not-empty': show || hours >= 0,
          'input-disabled': disabled,
        }"
        @click="toggle()"
      >
        <label class="field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>
        <input
          type="text"
          name="input-field-text"
          :class="{
            'show-time': true,
            'not-complete': !(hours >= 0 && minutes >= 0),
          }"
          :value="
            show || hours >= 0 || minutes >= 0
              ? (hours >= 0 ? String(hours).padStart(2, '0') : 'hh') +
                ':' +
                (minutes >= 0 ? String(minutes).padStart(2, '0') : 'mm')
              : ''
          "
          autocomplete="off"
          readonly="true"
          tabindex="-1"
        />
        <div
          :class="{
            'drop-icon-wrapper': true,
          }"
        >
          <font-awesome-icon class="drop-icon" :icon="['fa', 'clock']" />
        </div>
      </div>
      <div
        :class="{
          'dropdown-wrap': true,
          'show-dowpdown': show,
        }"
      >
        <div class="list-dropdown">
          <span
            v-for="(minutes, hour) in clock"
            :key="hour"
            :class="{
              'is-selected': hour == hours,
              'not-pickable': !minutes.find((p) => p),
            }"
            @click="setHours(hour)"
          >
            {{ String(hour).padStart(2, "0") }}
          </span>
        </div>
        <div class="list-dropdown">
          <span
            v-for="(pickable, minute) in clock[hours]"
            :key="minute"
            :class="{
              'is-selected': minute == minutes,
              'not-pickable': !pickable,
            }"
            @click="setMinutes(minute)"
          >
            {{ String(minute).padStart(2, "0") }}
          </span>
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

type ComponentData = {
  show: boolean;
  hours: number;
  minutes: number;
  validation_message?: string;
  clock: boolean[][];
};
const default_clock: boolean[][] = [];

for (let i = -1; i < 24; i++) {
  default_clock[i] = [];
  for (let j = 0; j < 60; j++) default_clock[i][j] = i !== -1;
}

export default defineComponent({
  name: "TimePicker",
  data(): ComponentData {
    const clock = (this.$props.custom_clock as boolean[][]) || default_clock;
    clock[-1] = default_clock[-1];

    return {
      show: false,
      validation_message: undefined,
      clock,
      hours: this.modelValue !== undefined ? (this.modelValue / 60) >> 0 : -1,
      minutes: this.modelValue !== undefined ? this.modelValue % 60 : -1,
    };
  },
  props: {
    modelValue: Number,
    name: String,
    label: String,
    validation: Object,
    required: Boolean,
    disabled: Boolean,
    custom_clock: Array,
  },
  emits: ["update:modelValue", "updateValidation"],
  methods: {
    toggle() {
      this.show = !this.show && !this.disabled;
      if (this.show == false) this.validate();
      if (this.show == false && this.minutes < 0) {
        this.hours = -1;
        this.minutes = -1;
        this.$emit("update:modelValue", -1);
      }
    },
    setHours(hours: number) {
      this.hours = hours;
      this.minutes = -1;
      this.validate();
    },
    setMinutes(minutes: number) {
      this.minutes = minutes;
      this.show = false;
      this.$emit("update:modelValue", this.hours * 60 + this.minutes);
      this.validate();
    },
    validate() {
      if (this.required && this.hours < 0 && this.minutes < 0)
        this.validation_message = "Campo obrigatória";
      else this.validation_message = undefined;
      this.$emit("updateValidation", this.name, !this.validation_message);
    },
  },
  watch: {
    modelValue(t) {
      if (t == null  || t == undefined || t < 0) {
        this.hours = -1;
        this.minutes = -1;
      } else {
        this.hours = (t / 60) >> 0;
        this.minutes = t % 60;
      }
      this.validate();
    },
    validation(value) {
      this.validation_message = value.message;
    },
    disabled(d) {
      if (d) {
        this.hours = -1;
        this.minutes = -1;
      }
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

.dropdown-wrap {
  display: flex;
  position: absolute;
  width: 70%;
  color: rgb(24, 24, 24);
  font-size: 0.85em;
  padding: 2px;
  border-radius: 2px;
  top: 4em;
  background-color: var(--bg-light);
  box-shadow: 0 0 0.3em rgb(56, 56, 56);
  visibility: hidden;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s;
  z-index: 888;
}

.show-dowpdown {
  max-height: 140px;
  visibility: visible;
  opacity: 1;
}

.list-dropdown {
  flex: 1;
  overflow-y: auto;
}

.list-dropdown > span {
  display: block;
  text-align: center;
  font-size: 1.3em;
  margin: 3px 0;
  padding: 4px;
  border-radius: 1px;
  transition: all 0.4s;
  cursor: pointer;
}

.list-dropdown > span:hover:not(.not-pickable) {
  background-color: rgba(54, 54, 54, 0.25);
}

.list-dropdown > .is-selected {
  background-color: rgba(5, 74, 201, 0.25);
}

.list-dropdown > .is-selected:hover {
  background-color: rgba(5, 74, 201, 0.453);
}

.not-complete {
  color: rgba(0, 0, 0, 0.471) !important;
}

.not-pickable {
  cursor: default !important;
  color: rgba(0, 0, 0, 0.471) !important;
  pointer-events: none;
}

.input-disabled {
  pointer-events: none;
}

.input-disabled .drop-icon-wrapper {
  color: rgba(85, 85, 85, 0.363);
}
</style>
