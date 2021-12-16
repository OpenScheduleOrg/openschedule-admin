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

        <input
          type="text"
          id="cc-input-field-text"
          name="cc-input-field-text"
          :class="{ 'cc-input-text': true, 'cc-not-editable': not_editable }"
          v-model="text"
          autocomplete="off"
          :readonly="readonly"
          :maxlength="maxlength"
          @input="formatter"
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
  name: "InputDate",
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
    format: String,
  },
  emits: ["update:modelValue"],
  methods: {
    formatter(e) {
      const el = e.target;
      let value = e.target.value;
      const key = e.data;

      switch (this.format) {
        case "cpf":
          if (
            key &&
            key.match(/\D/) &&
            (value.length != 4 || (value.length == 4 && !key.match(/\./))) &&
            (value.length != 8 || (value.length == 8 && !key.match(/\./))) &&
            (value.length != 12 || (value.length == 12 && !key.match(/-/)))
          ) {
            el.value = el.value.slice(0, -1);
          } else if (value.length == 4) {
            let v = value[3];
            if (v != ".") {
              value = value.slice(0, -1) + ".";
              el.value = value + v;
            }
          } else if (value.length == 8) {
            let v = value[7];
            if (v != ".") {
              value = value.slice(0, -1) + ".";
              el.value = value + v;
            }
          } else if (value.length == 12) {
            let v = value[11];
            if (v != "-") {
              value = value.slice(0, -1) + "-";
              el.value = value + v;
            }
          }
          break;
        case "telefone":
          if (
            key &&
            key.match(/\D/) &&
            (value.length != 1 || (value.length == 1 && !key.match(/\(/))) &&
            (value.length != 4 || (value.length == 4 && !key.match(/\)/))) &&
            (value.length != 5 || (value.length == 5 && !key.match(/\s/))) &&
            (value.length != 7 || (value.length == 7 && !key.match(/\s/))) &&
            (value.length != 12 || (value.length == 12 && !key.match(/-/)))
          ) {
            el.value = el.value.slice(0, -1);
          } else if (value.length == 1) {
            let v = value[0];
            if (v != "(") {
              value = value.slice(0, -1) + "(";
              el.value = value + v;
            }
          } else if (value.length == 4) {
            let v = value[3];
            if (v != ")") {
              value = value.slice(0, -1) + ") 9 ";
              el.value = value + v;
            } else {
              value = value + " 9 ";
            }
          } else if (value.length == 5 && key) {
            let v = value[4];
            if (v != " ") {
              value = value.slice(0, -1) + " 9 ";
              el.value = value + v;
            } else {
              value = value + "9 ";
            }
          } else if (value.length == 6 && key) {
            let v = value[5];
            if (v != "9") {
              value = value.slice(0, -1) + "9 ";
              el.value = value + v;
            } else {
              value = value + " ";
            }
          } else if (value.length == 7 && key) {
            let v = value[6];
            if (v != " ") {
              value = value.slice(0, -1) + " ";
              el.value = value + v;
            }
          } else if (value.length == 12) {
            let v = value[11];
            if (v != "-") {
              value = value.slice(0, -1) + "-";
              el.value = value + v;
            }
          }
          break;
      }
    },
  },
  watch: {
    text(n) {
      this.$emit("update:modelValue", n);
    },
    modelValue(n) {
      this.text = n;
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

.cc-not-editable {
  pointer-events: none;
}
</style>
