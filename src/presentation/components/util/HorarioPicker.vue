<template>
  <div
    :class="{
      'cc-form-group': true,
      'cc-input-is-valid': valid && !advise,
      'cc-input-is-invalid': advise,
    }"
  >
    <div
      class="cc-field-container"
      @click="show_list_dropdown = !show_list_dropdown"
    >
      <font-awesome-icon class="cc-field-icon" :icon="['fa', 'clock']" />
      <div
        :class="{
          'cc-input-field': true,
          'cc-input-not-empty': true,
          'cc-input-readonly': readonly,
          'cc-manual-focus': manual_focus,
        }"
      >
        <label class="cc-field-name" for="input-field-text" v-if="field_name">{{
          field_name
        }}</label>
        <input
          type="text"
          id="cc-input-field-text"
          name="cc-input-field-text"
          :class="{ 'cc-horario-picker': true, 'cc-not-editable': true }"
          :value="selected_hrr"
          autocomplete="off"
          :readonly="readonly"
        />

        <div
          :class="{
            'cc-drop-icon-wrapper': true,
            'cc-drop-open': show_list_dropdown,
          }"
        >
          <font-awesome-icon
            class="cc-drop-icon"
            :icon="['fa', 'caret-down']"
          />
        </div>
      </div>
      <div
        :class="{
          'cc-list-dropdown': true,
          'cc-show-dowpdown': show_list_dropdown,
        }"
      >
        <span
          v-for="hr in schedules"
          :key="hr.start.his"
          :class="{ 'cc-is-selected': hr.selected }"
          @click="setHis(hr.start.his)"
        >
          {{ hr.start.hhmm }} - {{ hr.end.hhmm }}
        </span>
      </div>
    </div>
    <div class="cc-advise">
      <font-awesome-icon v-if="advise" icon="exclamation-circle" />
      <span> {{ advise }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { DayDetail } from "@/store/models";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HorarioPicker",
  data() {
    let selected_hrr = "";
    const schedules = this.$props.list as DayDetail[]
    for (let hsf of  schedules ) {
      if (hsf.selected) {
        selected_hrr = hsf.start.hhmm + " - " + hsf.end.hhmm;
      }
    }
    return { selected_hrr, show_list_dropdown: false, schedules };
  },
  props: {
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
    not_editable: Boolean,
    manual_focus: Boolean,
    list: Array,
  },
  watch: {
    list() {
      this.setSelected();
    },
  },
  emits: ["update:modelValue"],
  methods: {
    setHis(his: number) {
      this.$emit("update:modelValue", his);
      for (const hrf of this.list as DayDetail[]) {
        if (hrf.selected) hrf.selected = false;
        if (hrf.start.his == his) hrf.selected = true;
      }
      this.setSelected();
    },
    setSelected() {
      for (const hsf of this.list as DayDetail[]) {
        if (hsf.selected) {
          this.selected_hrr = hsf.start.hhmm + " - " + hsf.end.hhmm;
        }
      }
    },
  },
});
</script>

<style scoped>
.cc-form-group {
  cursor: pointer;
}

.cc-horario-picker {
  display: block;
  background-color: inherit;
  padding: 12px 0 6px 0;
  color: inherit;
}
.cc-input-not-empty .cc-horario-picker {
  color: rgb(65, 65, 65);
}

.cc-drop-icon-wrapper {
  position: absolute;
  top: 0;
  transform: translateY(60%);
  right: 4px;
  font-size: 1.1em;
  width: auto;
  transition: all 0.3s;
}

.cc-drop-icon-wrapper.cc-drop-open {
  transform: translateY(60%) rotate(180deg);
}

.cc-list-dropdown {
  position: absolute;
  width: 86%;
  color: rgb(24, 24, 24);
  font-size: 0.85em;
  padding: 4px;
  border-radius: 2px;
  top: 1.3em;
  left: 14%;
  background-color: var(--bg-light);
  box-shadow: 0 0 0.3em rgb(56, 56, 56);
  visibility: hidden;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s;
  z-index: 888;
}

.cc-list-dropdown > span {
  display: block;
  text-align: center;
  margin: 3px 0;
  padding: 4px;
  border-radius: 1px;
  transition: all 0.4s;
}

.cc-list-dropdown > span:hover {
  background-color: rgba(54, 54, 54, 0.25);
}
.cc-list-dropdown > .cc-is-selected {
  background-color: rgba(5, 74, 201, 0.25);
}

.cc-list-dropdown > .cc-is-selected:hover {
  background-color: rgba(5, 74, 201, 0.453);
}

.cc-show-dowpdown {
  max-height: 200px;
  visibility: visible;
  opacity: 1;
  overflow-y: auto;
}
</style>
