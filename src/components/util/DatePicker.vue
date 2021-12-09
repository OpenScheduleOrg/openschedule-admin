<template>
  <div class="cc-form-group">
    <div class="cc-date-picker" @click="showCalendar">
      <font-awesome-icon icon="calendar-alt" class="cc-calendar-icon" />
      <input-text
        v-model="data"
        @update:modelValue="setVModel"
        :field_name="'Data marcada'"
      ></input-text>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import InputText from "./InputText.vue";

export default defineComponent({
  name: "InputDate",
  data() {
    const data = this.modelValue.toLocaleDateString();
    return { data };
  },
  components: {
    InputText,
  },
  props: {
    modelValue: Date,
    field_name: String,
    valid: Boolean,
    readonly: Boolean,
    advise: String,
  },
  emits: ["update:modelValue"],
  methods: {
    setVModel(e) {
      const ds = e.split("/").map((v) => Number(v));

      const dt = new Date(ds[2], ds[1] - 1, ds[0]);

      if (dt == "Invalid Date") {
        this.data = "Invalid Date";
      } else this.$emit("update:modelValue", dt);
    },
    showCalendar(e) {
      console.log(e);
    },
  },
});
</script>

<style scoped>
.cc-date-picker {
  display: flex;
  flex-direction: center;
  align-items: center;
}

.cc-date-picker:focus-within,
.cc-date-picker:hover {
  color: var(--line-color-hover);
}

.cc-calendar-icon {
  font-size: 1.2rem;
  margin: 0 8px;
  transition: all 0.3s;
}
</style>
