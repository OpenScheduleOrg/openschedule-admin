<template>
  <div class="some-padding">
    <h1 class="form-title">{{ !patient_id ? "Cadastro " : "" }}Paciente</h1>
    <Form class="form-wrap">
      <div class="form-dynamic-row form-group-col-1">
        <text-field
          v-model="body.name"
          :name="'name'"
          :label="'Nome'"
          :validators="{ required: {} }"
          @updateValidation="updateValidation"
        />
      </div>
      <div class="form-dynamic-row form-group-col-3">
        <date-picker
          :name="'scheduled_day'"
          :label="'Data de nascimento'"
          v-model="body.birthdate"
          @updateValidation="updateValidation"
        ></date-picker>
        <text-field
          :name="'phone'"
          :label="'Telefone'"
          v-model="body.phone"
          :format="'phone'"
          :validators="{ required: {}, phone: {} }"
          @updateValidation="updateValidation"
        />
        <text-field
          v-model="body.cpf"
          :name="'cpf'"
          :label="'CPF'"
          :format="'cpf'"
          :validators="{ required: {}, cpf: {} }"
          @updateValidation="updateValidation"
        />
      </div>
      <div class="form-dynamic-row form-group-col-1">
        <text-field
          v-model="body.registration"
          :name="'matricula'"
          :label="'Matrícula'"
          :format="'matricula'"
          :validators="{ required: {}, registration: {} }"
          @updateValidation="updateValidation"
        />
      </div>
      <div class="form-dynamic-row form-group-col-1">
        <text-field
          v-model="body.address"
          :name="'address'"
          :label="'Endereço'"
          :validators="{}"
          @updateValidation="updateValidation"
        />
      </div>
    </Form>
    <div class="operations-wrap">
      <button
        :class="{
          btn: true,
          'btn-update': !isLoading && isFormValid && !!patient_id,
          'btn-new': !isLoading && isFormValid && !!!patient_id,
        }"
        :disabled="!isFormValid || isLoading"
        @click="save()"
      >
        Salvar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Form, DatePicker, TextField } from "../util";
import { defineComponent } from "vue";

import { PatientBody } from "@/domain/params";
import { mapActions, mapState } from "vuex";
import { patientService } from "@/domain/services";
import hash from "object-hash";

type ComponentData = {
  isLoading: boolean;
  field_valid: { [field: string]: boolean };
  body: PatientBody;
};

export default defineComponent({
  name: "PatientForm",
  components: {
    Form,
    DatePicker,
    TextField,
  },
  data(): ComponentData {
    const patient_id = this.$store.state.record.patient_id;
    const body = { ...this.$store.state.record.patient };

    return {
      isLoading: false,
      field_valid: {
        name: !!patient_id,
        phone: !!patient_id,
        cpf: !!patient_id,
      },
      body,
    };
  },
  async created() {
    if (this.patient_id && !this.hash_patient)
      patientService.getById(this.patient_id).then((patient) => {
        this.body.name = patient.name;
        this.body.phone = patient.phone.maskPhone();
        this.body.birthdate = patient.birthdate;
        this.body.address = patient.address;
        this.body.registration = patient.registration;
        this.body.cpf = patient.cpf.maskCpf();

        this.setHashPatient(hash(this.body));
      });
  },
  computed: {
    isFormValid() {
      for (let field_name in this.field_valid)
        if (!this.field_valid[field_name]) return false;
      return true;
    },
    ...mapState("record", ["patient", "patient_id", "hash_patient"]),
    ...mapState("agenda", ["professional_id"]),
  },
  methods: {
    ...mapActions({
      loadSchedules: "schedules/load",
      resetCloseNewAppointment: "record/resetCloseNewAppointment",
      setRecordPatientId: "record/setRecordPatientId",
      setRecordPatient: "record/setRecordPatient",
      setHashPatient: "record/setHashPatient",
    }),
    updateValidation(field: string, valid: boolean) {
      this.field_valid[field] = valid;
    },
    save() {
      this.isLoading = true;
      const payload = { ...this.body };

      if (this.patient_id && this.hash_patient != hash(this.body))
        return patientService.update(this.patient_id, payload as PatientBody).then(() => {
          this.isLoading = false;
        });
      else if (!this.patient_id)
        return patientService.create(this.body as PatientBody).then((patient) => {
          this.setRecordPatientId(patient.id);
          this.isLoading = false;
        });
      this.isLoading = false;
    },
  },
  beforeUnmount() {
    this.setRecordPatient(this.body);
  },
});
</script>

<style scoped>
.form-wrap {
  background-color: rgba(201, 201, 201, 0.261);
  border-radius: 0.5rem;
  padding: 1em;
}

.operations-wrap {
  margin-top: 1rem;
  margin-bottom: 0.3rem;
}

.form-title {
  font-size: 1.5em;
  padding-bottom: 6px;
  color: var(--font-main);
  border-bottom: 1px solid rgb(174, 174, 174);
  text-align: center;
  margin-bottom: 0.4em;
}

.some-padding {
  padding: 1em;
}

.operations-wrap {
  margin-top: 1rem;
  margin-bottom: 0.3rem;
}

.operations-wrap .btn {
  font-size: 1rem;
  margin: 0 auto;
  width: 200px;
}
</style>
