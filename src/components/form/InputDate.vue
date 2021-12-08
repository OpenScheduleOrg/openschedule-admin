<template>
  <div class="input-field">
    <label for="date-input"></label>
    <input
      type="text"
      id="date-input"
      name="dat-input"
      v-model="date"
      readonly
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "InputDate",
  props: { modelValue: Date },
  emits: ["update:modelValue"],
  data() {
    const dstr = this.modelValue.toISOString().split("T")[0];
    return { date: dstr };
  },
  methods: {
    setModelValue() {
      this.$emit("update:modelValue", new Date(this.date));
    },
  },
});
</script>
