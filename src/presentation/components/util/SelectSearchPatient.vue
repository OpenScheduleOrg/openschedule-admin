<template>
  <div
    :class="{
      'form-group': true,
      'input-is-invalid': !!validation_message,
      'input-readonly': readonly,
    }"
  >
    <div class="field-container">
      <div
        :class="{
          'input-field': true,
          'input-not-empty': show_options || patient,
          'manual-focus': manual_focus,
        }"
      >
        <label class="field-name" for="input-field-text" v-if="label">{{
          label
        }}</label>
        <input
          type="text"
          ref="search_text"
          @focusin="show()"
          :class="{ 'horario-picker': true }"
          v-model="text_search"
          autocomplete="off"
        />
        <div
          :class="{
            'reset-icon-wrapper': true,
          }"
          v-if="patient"
        >
          <font-awesome-icon
            v-if="!readonly"
            class="reset-icon"
            :icon="['fa', 'times']"
            @click="reset()"
          />
        </div>
      </div>
      <div
        :class="{
          'list-dropdown': true,
          'show-dowpdown': show_options && !readonly,
        }"
      >
        <span class="empty-option" v-if="!options?.length">{{
          empty_message
        }}</span>
        <span
          v-for="pa in options"
          :key="pa.id"
          :class="{ 'is-selected': patient == pa }"
          @click="setSelected(pa)"
        >
          {{ pa.name }}
        </span>
      </div>
    </div>
    <div class="advise">
      <font-awesome-icon
        v-if="!!validation_message"
        icon="exclamation-circle"
      />
      <span> {{ validation_message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PatientModel } from "@/domain/models";
import { patientService } from "@/domain/services";

type ComponentData = {
  selected_label?: string;
  patient?: PatientModel;
  text_search: string;
  validation_message?: string;
  show_options: boolean;
  patients: PatientModel[];
};

export default defineComponent({
  name: "SelectSearchPatient",
  data(): ComponentData {
    return {
      show_options: false,
      patient: undefined,
      validation_message: undefined,
      text_search: "",
      patients: [],
    };
  },
  created() {
    patientService.load().then((patients) => {
      this.patients = patients;
      this.patient = this.patients.find((p) => p.id == this.modelValue);
      if (this.patient) this.text_search = this.patient.name;
    });
  },
  computed: {
    options(): PatientModel[] {
      return this.patients.filter((p) =>
        p.name.match(new RegExp(this.text_search, "i"))
      ) as any[];
    },
  },
  props: {
    modelValue: Number,
    name: String,
    label: String,
    empty_message: String,
    readonly: Boolean,
    manual_focus: Boolean,
    required: Boolean,
  },
  emits: ["update:modelValue", "updateValidation"],
  methods: {
    setSelected(selected_patient: PatientModel) {
      this.$emit("update:modelValue", selected_patient.id);
      this.patient = selected_patient;
      this.hide();
      this.validate();
    },
    show() {
      this.text_search = "";
      this.show_options = true;
    },
    hide() {
      this.text_search = this.patient?.name || "";
      this.show_options = false;
      this.validate();
    },
    reset() {
      this.patient = undefined;
      this.$emit("update:modelValue", undefined);
      this.text_search = "";
      this.hide();
      this.validate();
    },
    validate() {
      if (this.required && !this.patient)
        this.validation_message = "Paciente obrigatório";
      else this.validation_message = undefined;
      this.$emit(
        "updateValidation",
        this.name,
        !!this.patient || !this.required
      );
    },
  },
  watch: {
    modelValue(id: number) {
      this.patient = this.patients.find((p) => p.id == id);
      if (this.patient) this.text_search = this.patient.name;
    },
  },
});
</script>

<style scoped>
input {
  cursor: context-menu;
}

.horario-picker {
  display: block;
  background-color: inherit;
  padding: 12px 0 6px 0;
  color: inherit;
}
.input-not-empty .horario-picker {
  color: rgb(65, 65, 65);
}

.reset-icon-wrapper {
  position: absolute;
  top: 10px;
  transform: translateY(60%);
  right: 4px;
  font-size: 1.1em;
  width: auto;
  color: rgb(69, 69, 69);
}

.reset-icon-wrapper:hover {
  color: rgb(34, 34, 34);
}

.list-dropdown {
  max-height: 170px;
  position: absolute;
  width: 88%;
  color: rgb(24, 24, 24);
  font-size: 0.85em;
  padding: 4px;
  border-radius: 2px;
  top: -5em;
  background-color: var(--bg-light);
  box-shadow: 0 0 0.3em rgb(56, 56, 56);
  visibility: hidden;
  opacity: 0;
  overflow: hidden;
  transition: all 0.2s ease-out;
  z-index: 888;
}

.list-dropdown > span {
  cursor: pointer;
  display: block;
  text-align: center;
  margin: 3px 0;
  padding: 4px;
  border-radius: 1px;
  transition: all 0.4s;
}

.list-dropdown > span:not(.empty-option):hover {
  background-color: rgba(54, 54, 54, 0.25);
}

.list-dropdown > .empty-option {
  cursor: initial;
  color: rgba(54, 54, 54, 0.39);
  font-weight: bold;
}
.list-dropdown > .is-selected {
  background-color: rgba(5, 74, 201, 0.25);
}

.list-dropdown > .is-selected:hover {
  background-color: rgba(5, 74, 201, 0.453);
}

.show-dowpdown {
  visibility: visible;
  opacity: 1;
  overflow-y: auto;
  top: 4.1em;
}

.input-readonly,
.input-readonly * {
  cursor: default !important;
  pointer-events: none;
}
</style>
