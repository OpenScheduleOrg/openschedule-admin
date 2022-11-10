<template>
  <div
    :class="{
      'cc-form-group': true,
      'cc-input-is-invalid': !!validation_message,
    }"
  >
    <div class="cc-field-container" @click="show_options ? hide() : show()">
      <div
        :class="{
          'cc-input-field': true,
          'cc-input-not-empty': show_options || selected,
          'cc-input-readonly': readonly,
          'cc-manual-focus': manual_focus,
        }"
      >
        <label class="cc-field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>
        <input
          type="text"
          :class="{ 'cc-horario-picker': true, 'cc-not-editable': true }"
          :value="selected?.label"
          autocomplete="off"
          :readonly="readonly"
        />
        <div
          :class="{
            'cc-drop-icon-wrapper': true,
            'cc-drop-open': show_options,
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
          'cc-show-dowpdown': show_options,
        }"
      >
        <span class="cc-empty-option" v-if="!options?.length">{{ empty_message }}</span>
        <span
          v-for="op in (options as OptionSelect[])"
          :key="op.value"
          :class="{ 'cc-is-selected': selected?.value == op.value }"
          @click="setSelected(op)"
        >
          {{ op.label }}
        </span>
      </div>
    </div>
    <div class="cc-advise">
      <font-awesome-icon
        v-if="!!validation_message"
        icon="exclamation-circle"
      />
      <span> {{ validation_message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export type OptionSelect = { value: string | number; label: string };

type ComponentData = {
  selected?: OptionSelect;
  validation_message?: string;
  show_options: boolean;
};

export default defineComponent({
  name: "Select",
  data(): ComponentData {
    return {
      show_options: false,
      selected: undefined,
      validation_message: undefined,
    };
  },
  props: {
    modelValue: Number,
    name: String,
    label: String,
    empty_message: String,
    readonly: Boolean,
    not_editable: Boolean,
    manual_focus: Boolean,
    options: Array,
    required: Boolean,
  },
  emits: ["update:modelValue", "updateValidation"],
  methods: {
    setSelected(option: OptionSelect) {
      this.$emit("update:modelValue", option.value);
      this.selected = option;
      this.validate();
    },
    show() {
      this.show_options = true;
    },
    hide() {
      this.show_options = false;
      this.validate();
    },
    validate() {
      if (this.required && !this.selected)
        this.validation_message = "Seleção obrigatória";
      else this.validation_message = undefined;
      this.$emit(
        "updateValidation",
        this.name,
        !!this.selected || !this.required
      );
    },
  },
  watch: {
    modelValue(v) {
      const options = this.options as OptionSelect[];
      this.selected = options.find((op) => op.value == v);
      this.validate();
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
  top: 10px;
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
  max-height: 170px;
  position: absolute;
  width: 88%;
  color: rgb(24, 24, 24);
  font-size: 0.85em;
  padding: 4px;
  border-radius: 2px;
  top: -5em;
  background-color: var(--bg-light);
  box-shadow: 0 0 0.3em rgb(56, 56, 56);
  visibility: hidden;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
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

.cc-list-dropdown > span:not(.cc-empty-option):hover {
  background-color: rgba(54, 54, 54, 0.25);
}

.cc-list-dropdown > .cc-empty-option{
  cursor: initial;
  color: rgba(54, 54, 54, 0.39);
  font-weight: bold;
}
.cc-list-dropdown > .cc-is-selected {
  background-color: rgba(5, 74, 201, 0.25);
}

.cc-list-dropdown > .cc-is-selected:hover {
  background-color: rgba(5, 74, 201, 0.453);
}

.cc-show-dowpdown {
  visibility: visible;
  opacity: 1;
  overflow-y: auto;
  top: 2em;
}
</style>
