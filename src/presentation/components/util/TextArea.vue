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
          'input-not-empty': text,
          'input-readonly': readonly,
          'manual-focus': manual_focus,
        }"
      >
        <label class="field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>
        <textarea
          :class="{
            'input-textarea': true,
            'not-editable': not_editable,
          }"
          v-model="text"
          autocomplete="off"
          :readonly="readonly"
          :maxlength="maxlength"
          :rows="num_rows || 5"
        ></textarea>
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

export default defineComponent({
  name: "TextArea",
  data() {
    const text = this.modelValue;
    return { text, validation_message: undefined };
  },
  props: {
    modelValue: String,
    label: String,
    valid: Boolean,
    readonly: Boolean,
    maxlength: Number,
    not_editable: Boolean,
    manual_focus: Boolean,
    num_rows: Number,
  },
  emits: ["update:modelValue"],
  watch: {
    text(n) {
      this.$emit("update:modelValue", n);
    },
    modelValue(text: string) {
      this.text = text;
    },
  },
});
</script>

<style scoped>
.input-textarea {
  display: block;
  background-color: rgb(231, 231, 231);
  margin-top: 12px;
  padding: 4px;
  font-family: Oxygen, Roboto, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
  resize: vertical;
  text-align: justify;
}

.input-not-empty #input-field-textarea {
  color: rgb(36, 36, 36);
}

.form-group .input-field .field-name {
  left: 4px;
  top: 22px;
}

.form-group .input-field:focus-within .field-name,
.form-group .input-field.input-not-empty .field-name {
  left: 0;
  top: 0;
}
</style>
