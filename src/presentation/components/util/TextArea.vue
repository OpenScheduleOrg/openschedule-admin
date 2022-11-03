<template>
  <div
    :class="{
      'cc-form-group': true,
      'cc-input-is-valid': valid && !advise,
      'cc-input-is-invalid': advise,
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
        <label class="cc-field-name" for="input-field-text" v-if="field_name">{{
          field_name
        }}</label>

        <textarea
          id="cc-input-field-textarea"
          name="cc-input-field-textarea"
          :class="{
            'cc-input-textarea': true,
            'cc-not-editable': not_editable,
          }"
          v-model="text"
          autocomplete="off"
          :readonly="readonly"
          :maxlength="maxlength"
          :rows="num_rows || 5"
        ></textarea>
      </div>
    </div>
    <div class="cc-advise">
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
.cc-input-textarea {
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

.cc-input-not-empty #cc-input-field-textarea {
  color: rgb(36, 36, 36);
}

.cc-form-group .cc-input-field .cc-field-name {
  left: 4px;
  top: 22px;
}

.cc-form-group .cc-input-field:focus-within .cc-field-name,
.cc-form-group .cc-input-field.cc-input-not-empty .cc-field-name {
  left: 0;
  top: 0;
}
</style>
