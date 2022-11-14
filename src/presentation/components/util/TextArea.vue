<template>
  <div
    :class="{
      'form-group': true,
      'input-is-valid': valid && !advise,
      'input-is-invalid': advise,
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
        <label class="field-name" for="input-field-text" v-if="field_name">{{
          field_name
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
      <font-awesome-icon v-if="advise" icon="exclamation-circle" />
      <span> {{ advise }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextArea",
  data() {
    const text = this.modelValue;
    return { text };
  },
  props: {
    modelValue: String,
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
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
  },
});
</script>

<style scoped>
.input-textarea {
  display: block;
  background-color: rgb(231, 231, 231);
  color: inherit;
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
