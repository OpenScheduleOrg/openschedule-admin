<template>
  <div
    :class="{
      'cc-form-group': true,
      'cc-input-is-valid': valid,
      'cc-input-is-invalid': invalid,
    }"
  >
    <div class="cc-field-container">
      <div
        :class="{
          'cc-input-field-check': true,
        }"
      >
        <label
          class="cc-field-name-checkbox"
          for="input-field-text"
          v-if="field_name"
          >{{ field_name }}</label
        >

        <input
          type="checkbox"
          id="cc-input-field-checkbox"
          name="cc-input-field-check-box"
          :class="{ 'cc-input-text-check': true }"
          v-model="result"
        />
      </div>
    </div>
    <div class="cc-advise">
      <font-awesome-icon v-if="advise" icon="exclamation-circle" />
      <span> {{ advise }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "InputCheck",
  data() {
    const result = this.modelValue;
    return { result };
  },
  props: {
    modelValue: Boolean,
    field_name: String,
    valid: Boolean,
    invalid: Boolean,
    advise: String,
    format: String,
  },
  emits: ["update:modelValue"],
  watch: {
    result(n) {
      this.$emit("update:modelValue", n);
    },
    modelValue(n) {
      this.result = n;
    },
  },
});
</script>

<style scoped>
.cc-input-text-check {
  padding: 12px 0 6px 0;
  cursor: pointer;
  margin: 4px;
}

.cc-not-editable {
  pointer-events: none;
}

.cc-input-field-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: black;
  font-size: 1.2em;
}

.cc-input-is-valid label {
  color: rgb(0, 158, 32);
}

.cc-input-is-invalid label {
  color: red;
}
</style>
