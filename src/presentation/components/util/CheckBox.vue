<template>
  <div
    :class="{
      'form-group': true,
      'input-is-valid': valid,
      'input-is-invalid': invalid,
    }"
  >
    <div class="field-container">
      <div
        :class="{
          'input-field-check': true,
        }"
      >
        <label
          class="field-name-checkbox"
          for="input-field-text"
          v-if="field_name"
          >{{ field_name }}</label
        >

        <input
          type="checkbox"
          name="input-field-check-box"
          :class="{ 'text-field-check': true }"
          v-model="result"
        />
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
  name: "CheckBox",
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
.text-field-check {
  padding: 12px 0 6px 0;
  cursor: pointer;
  margin: 4px;
}

.not-editable {
  pointer-events: none;
}

.input-field-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: black;
  font-size: 1.2em;
}

.input-is-valid label {
  color: rgb(0, 158, 32);
}

.input-is-invalid label {
  color: red;
}
</style>
