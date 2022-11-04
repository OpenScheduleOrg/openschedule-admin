<template>
  <transition name="modal">
    <div ref="modal_mask" @mousedown="closeModal($event)" class="modal-mask">
      <div class="modal-container">
        <router-link id="close-modal" :to="{ name: 'clinics' }">
          <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
        </router-link>

        <h1 class="modal-title">Nova Clínica</h1>
        <div class="form-wrap">
          <Form>
            <input-text
              v-model="body.name"
              :name="'name'"
              :label="'Nome'"
              :validators="{ required: {} }"
              @updateValidation="updateValidation"
            />
            <div class="cc-form-dynamic-row cc-form-group-col-2">
              <input-text
                :name="'phone'"
                :label="'Telefone'"
                v-model="body.phone"
                :format="'phone'"
                :validators="{ required: {}, phone: {} }"
                @updateValidation="updateValidation"
              />
              <input-text
                v-model="body.cnpj"
                :name="'cnpj'"
                :label="'CNPJ'"
                :format="'cnpj'"
                :validators="{ required: {}, cnpj: {} }"
                @updateValidation="updateValidation"
              />
            </div>
            <input-text
              v-model="body.address"
              :name="'address'"
              :label="'Endereço'"
              :validators="{ required: {} }"
              @updateValidation="updateValidation"
            />
            <div class="cc-form-dynamic-row cc-form-group-col-2">
              <input-text
                v-model="body.latitude"
                :name="'latitude'"
                :label="'Latitude'"
              />
              <input-text
                v-model="body.longitude"
                :name="'longitude'"
                :label="'Longitude'"
              />
            </div>
          </Form>
        </div>
        <div class="operations-wrap">
          <button
            @click="save()"
            :class="{
              btn: true,
              'btn-update': !isLoading && isFormValid && !!clinic_id,
              'btn-new': !isLoading && isFormValid && !!!clinic_id,
            }"
            :disabled="!isFormValid || isLoading"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Form, InputText } from "../util";
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import hash from "object-hash";

import { ClinicBody } from "@/domain/params";
import { clinicService } from "@/domain/services";

type ComponentData = {
  clinic_id?: number;
  isLoading: boolean;
  field_valid: { [field: string]: boolean };
  body: ClinicBody;
  body_hash?: string;
};

export default defineComponent({
  name: "ClinicForm",
  components: { Form, InputText },
  data(): ComponentData {
    const clinic_id = Number(this.$route.params.clinic_id);
    return {
      clinic_id,
      isLoading: false,
      field_valid: {
        name: !!clinic_id,
        phone: !!clinic_id,
        cnpj: !!clinic_id,
        address: !!clinic_id,
      },
      body: { name: "", phone: "", cnpj: "", address: "" },
    };
  },
  created() {
    if (this.clinic_id) this.loadClinic(this.clinic_id);
  },
  computed: {
    isFormValid() {
      for (let field_name in this.field_valid)
        if (!this.field_valid[field_name]) return false;
      return true;
    },
  },
  methods: {
    loadClinic(clinic_id: number) {
      this.isLoading = true;
      clinicService
        .getById(clinic_id)
        .then((clinic) => {
          this.isLoading = false;
          this.body = {
            name: clinic.name,
            phone: clinic.phone.maskPhone(),
            cnpj: clinic.cnpj.maskCnpj(),
            address: clinic.address,
          };
          this.body_hash = hash(this.body);
        })
        .catch(() => {
          this.$router.push("/clinics");
        });
    },
    save() {
      this.isLoading = true;
      const payload = {
        ...this.body,
        phone: this.body.phone.removeMask(),
        cnpj: this.body.cnpj.removeMask(),
      };

      if (this.clinic_id && this.body_hash != hash(this.body)) {
        return clinicService
          .update(this.clinic_id, payload)
          .then(() => {
            this.reloadClinics();
            this.$router.push("/clinics");
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else if (!this.clinic_id)
        return clinicService
          .create(payload)
          .then(() => {
            this.reloadClinics();
            this.$router.push("/clinics");
          })
          .catch(() => {
            this.isLoading = false;
          });
      this.$router.push("/clinics");
    },
    closeModal(e: Event) {
      if (
        e.target == this.$refs.modal_mask ||
        e.target == this.$refs.close_modal
      )
        this.$router.push("/clinics");
    },
    updateValidation(field: string, valid: boolean) {
      this.field_valid[field] = valid;
    },
    ...mapActions({ reloadClinics: "clinics/load" }),
  },
});
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  transition: opacity 0.5s ease;
  align-items: center;
  justify-content: center;
}

.modal-container {
  position: relative;
  min-width: 27vw;
  background-color: var(--bg-light);
  border-radius: 0.3rem;
  padding: 0.8em;
}

#close-modal {
  display: block;
  position: absolute;
  cursor: pointer;
  right: 2px;
  top: -4px;
  color: rgba(31, 31, 31, 0.35);
  font-size: 1.3rem;
}

#close-modal:hover {
  transition: color 0.3s;
  color: rgba(31, 31, 31, 0.55);
}

.modal-title {
  font-size: 1.6rem;
  padding: 6px;
  color: var(--font-main);
  border-bottom: 1px solid rgb(174, 174, 174);
  text-align: center;
}

.form-wrap {
  margin: 1rem;
  background-color: rgba(201, 201, 201, 0.261);
  padding: 1rem;
  border-radius: 0.5rem;
  width: 40vw;
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
