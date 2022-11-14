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
          'input-not-empty': value !== undefined,
          'input-readonly': readonly,
          'manual-focus': manual_focus,
        }"
      >
        <label class="field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>

        <input
          :type="'number'"
          :class="{ 'text-field': true, 'not-editable': not_editable }"
          v-model="value"
          autocomplete="off"
          :readonly="readonly"
          :max="maxlength"
          :min="minlength"
          @keyup="validate"
          @focusout="validate"
        />
      </div>
    </div>
    <div class="advise">
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
import validators from "@/utils/validators";

type ComponentData = {
  value?: number;
  validation_message?: string;
};

export default defineComponent({
  name: "NumberField",
  data(): ComponentData {
    const value = this.modelValue;
    return { value, validation_message: undefined };
  },
  methods: {
    validate() {
      this.validation_message = undefined;

      for (let name in this.$props.validators) {
        this.validation_message = validators[name](
          this.value,
          this.$props.validators[name]
        );
        if (this.validation_message)
          this.$emit("updateValidation", this.name, false);
      }
      this.$emit("updateValidation", this.name, true);
    },
  },
  props: {
    modelValue: Number,
    name: String,
    label: String,
    readonly: Boolean,
    maxlength: Number,
    minlength: Number,
    not_editable: Boolean,
    manual_focus: Boolean,
    format: String,
    validators: Object,
    validation: Object,
  },
  emits: ["update:modelValue", "updateValidation"],
  watch: {
    value(n) {
      this.$emit("update:modelValue", n);
      this.validate();
    },
    modelValue(n) {
      this.value = n;
    },
    validation(value) {
      this.validation_message = value.message;
    },
  },
});
</script>

<style scoped>
.text-field {
  display: block;
  background-color: inherit;
  padding: 12px 0 6px 0;
  color: inherit;
}
.input-not-empty .text-field {
  color: rgb(65, 65, 65);
}

.not-editable {
  pointer-events: none;
}
</style>
