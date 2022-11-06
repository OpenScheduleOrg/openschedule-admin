<template>
  <div
    :class="{
      'cc-form-group': true,
      'cc-input-is-invalid': !!validation_message,
    }"
  >
    <div class="cc-field-container">
      <div
        :class="{
          'cc-input-field': true,
          'cc-input-not-empty': text,
          'cc-input-readonly': readonly,
          'cc-manual-focus': manual_focus,
        }"
      >
        <label class="cc-field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>

        <input
          :type="'text'"
          id="cc-input-field-text"
          name="cc-input-field-text"
          :class="{ 'cc-text-field': true, 'cc-not-editable': not_editable }"
          v-model="text"
          autocomplete="off"
          :readonly="readonly"
          :maxlength="maxlength"
          @input="formatInput"
          @keyup="validate"
          @focusout="validate"
        />
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
import formatters from "@/utils/formatters";
import validators from "@/utils/validators";

type ComponentData = {
  text?: string;
  validation_message?: string;
};

export default defineComponent({
  name: "TextField",
  data(): ComponentData {
    const text = this.modelValue;
    return { text, validation_message: undefined };
  },
  methods: {
    formatInput(e: Event) {
      const formatter = formatters[this.$props.format as string];
      if (formatter) formatter(e);
      this.text = (e.target as HTMLInputElement).value;
    },
    validate() {
      this.validation_message = undefined;

      for (let name in this.$props.validators) {
        const message = validators[name](
          this.text,
          this.$props.validators[name]
        );
        if (message) {
          this.$emit("updateValidation", this.$props.name, false);
          return (this.validation_message = message as string);
        }
      }
      this.$emit("updateValidation", this.$props.name, true);
    },
  },
  props: {
    modelValue: String,
    name: String,
    label: String,
    readonly: Boolean,
    maxlength: Number,
    not_editable: Boolean,
    manual_focus: Boolean,
    format: String,
    validators: Object,
    validation: Object,
  },
  emits: ["update:modelValue", "updateValidation"],
  watch: {
    text(n) {
      this.$emit("update:modelValue", n);
    },
    modelValue(n) {
      this.text = n;
    },
    validation(value) {
      this.validation_message = value.message;
    },
  },
});
</script>

<style scoped>
.cc-text-field {
  display: block;
  background-color: inherit;
  padding: 12px 0 6px 0;
  color: inherit;
}
.cc-input-not-empty .cc-text-field {
  color: rgb(65, 65, 65);
}

.cc-not-editable {
  pointer-events: none;
}
</style>
