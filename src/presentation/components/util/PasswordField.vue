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
          'input-not-empty': text,
          'manual-focus': manual_focus,
        }"
      >
        <label class="field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>

        <input
          :type="'password'"
          :class="{ 'text-field': true }"
          v-model="text"
          autocomplete="new-password"
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
  text?: string;
  validation_message?: string;
};

export default defineComponent({
  name: "PasswordField",
  data(): ComponentData {
    return { text: "", validation_message: undefined };
  },
  methods: {
    validate() {
      this.validation_message = undefined;
      const vals = { required: {}, password: {} } as {[validator: string]: any};

      if (!this.required) {
        delete vals["required"]
        if(this.text?.length == 0 || this.text == undefined){
          this.text = undefined;
          this.$emit("updateValidation", this.name, true);
          return;
        }
      }

      for (let name in vals) {
        const message = validators[name](this.text, validators[name]);
        if (message) {
          this.$emit("updateValidation", this.$props.name, false);
          return (this.validation_message = message as string);
        }
      }
      this.$emit("updateValidation", this.name, true);
    },
  },
  props: {
    modelValue: String,
    name: String,
    label: String,
    manual_focus: Boolean,
    format: String,
    validation: Object,
    required: Boolean,
  },
  emits: ["update:modelValue", "updateValidation"],
  watch: {
    text(n) {
      this.$emit("update:modelValue", n);
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
