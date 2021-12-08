<template>
  <div class="cc-form-group">
    <div class="cc-input-field">
      <input
        type="text"
        id="cc-input-field-text"
        name="cc-input-field-text"
        class="cc-input-text"
        :class="{ 'input-not-empty': modelValue }"
        :value="modelValue"
        @input="setValue"
        autocomplete="off"
      />
      <label class="cc-field-name" for="input-field-text">{{
        field_name
      }}</label>
    </div>
    <div class="cc-advise"><span>error</span></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "InputDate",
  props: { modelValue: String, field_name: String },
  emits: ["update:modelValue"],
  methods: {
    setValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
  },
});
</script>

<style scoped>
.cc-input-text {
  display: block;
  background-color: inherit;
}
</style>
