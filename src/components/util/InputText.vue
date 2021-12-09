<template>
  <div
    :class="{
      'cc-form-group': true,
      'cc-input-is-valid': valid && !advise,
      'cc-input-is-invalid': advise,
    }"
  >
    <div
      :class="{
        'cc-input-field': true,
        'cc-input-not-empty': modelValue,
        'cc-input-readonly': readonly,
      }"
    >
      <label class="cc-field-name" for="input-field-text" v-if="field_name">{{
        field_name
      }}</label>
      <input
        type="text"
        id="cc-input-field-text"
        name="cc-input-field-text"
        class="cc-input-text"
        :value="modelValue"
        @input="setValue"
        autocomplete="off"
        :readonly="readonly"
      />
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
  name: "InputDate",
  props: {
    modelValue: String,
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
  },
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
  padding: 12px 0 6px 0;
  color: inherit;
}
.cc-input-not-empty .cc-input-text {
  color: rgb(65, 65, 65);
}
</style>
