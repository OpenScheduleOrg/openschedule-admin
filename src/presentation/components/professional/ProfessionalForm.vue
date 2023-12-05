<template>
  <transition name="modal">
    <div ref="modal_mask" @mousedown="closeModal($event)" class="modal-mask">
      <div class="modal-container">
        <router-link id="close-modal" :to="{ name: 'professionals' }">
          <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
        </router-link>

        <h1 class="modal-title">
          {{ !professional_id ? "Cadastro " : "" }}Profissional
        </h1>
        <div class="form-wrap">
          <Form>
            <div class="form-dynamic-row form-group-col-1">
              <text-field
                v-model="body.name"
                :name="'name'"
                :label="'Nome'"
                :validators="{ required: {} }"
                @updateValidation="updateValidation"
              />
              <!--
              <text-field
                v-model="body.reg_number"
                :name="'reg_number'"
                :label="'Número registro'"
              />
             -->
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <text-field
                :name="'phone'"
                :label="'Telefone'"
                v-model="body.phone"
                :format="'phone'"
                :validators="{ required: {}, phone: {} }"
                @updateValidation="updateValidation"
              />
              <text-field
                v-model="body.email"
                :name="'email'"
                :label="'E-mail'"
                :validators="{ required: {}, email: {} }"
                @updateValidation="updateValidation"
              />
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <text-field
                :name="'username'"
                :label="'Login'"
                v-model="body.username"
                :format="'username'"
                :validators="{ required: {} }"
                @updateValidation="updateValidation"
              />
              <password-field
                :name="'password'"
                :label="'Senha'"
                v-model="body.password"
                @updateValidation="updateValidation"
              />
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <select-option
                :name="'specialty'"
                :label="'Selecione a especialidade'"
                :required="true"
                :options="select_options.specialties"
                :empty_message="'Cadastre uma especialidade'"
                v-model="acting_body.specialty_id"
                @updateValidation="updateValidation"
              />
              <select-option
                :name="'clinic'"
                :label="'Seleciona estabelecimento'"
                :required="true"
                :options="select_options.clinics"
                :empty_message="'Cadastre uma clínica'"
                v-model="acting_body.clinic_id"
                @updateValidation="updateValidation"
              />
            </div>
          </Form>
        </div>
        <div class="operations-wrap">
          <button
            @click="save()"
            :class="{
              btn: true,
              'btn-update': !isLoading && isFormValid && !!professional_id,
              'btn-new': !isLoading && isFormValid && !!!professional_id,
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
import { Form, TextField, PasswordField, SelectOption } from "../util";
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import hash from "object-hash";

import { ProfessionalBody, ActingBody } from "@/domain/params";
import {
  actingService,
  clinicService,
  professionalService,
  specialtyService,
} from "@/domain/services";
import { OptionSelect } from "@/presentation/models";

type ComponentData = {
  professional_id?: number;
  acting_id?: number;
  isLoading: boolean;
  field_valid: { [field: string]: boolean };
  body: ProfessionalBody;
  acting_body: ActingBody;
  body_hash?: string;
  acting_body_hash?: string;
  select_options: {
    clinics: OptionSelect[];
    specialties: OptionSelect[];
  };
};

export default defineComponent({
  name: "ProfessionalForm",
  components: { Form, TextField, PasswordField, SelectOption },
  data(): ComponentData {
    const professional_id = Number(this.$route.params.professional_id);
    return {
      professional_id,
      isLoading: false,
      field_valid: {
        name: !!professional_id,
        phone: !!professional_id,
        email: !!professional_id,
        username: !!professional_id,
        password: !!professional_id,
        clinic: !!professional_id,
        specialty: !!professional_id,
      },
      body: {
        name: "",
        phone: "",
        username: "",
        email: "",
        password: "",
      },
      acting_body: {
        professional_id: 0,
        clinic_id: 0,
        specialty_id: 0,
      },
      select_options: {
        clinics: [],
        specialties: [],
      },
    };
  },
  async created() {
    await this.populateSelects();
    if (this.professional_id) await this.loadProfessional(this.professional_id);
  },
  computed: {
    isFormValid() {
      for (let field_name in this.field_valid)
        if (!this.field_valid[field_name]) return false;
      return true;
    },
  },
  methods: {
    loadProfessional(professional_id: number) {
      this.isLoading = true;
      return professionalService
        .getById(professional_id)
        .then((professional) => {
          this.isLoading = false;
          this.body = {
            name: professional.name,
            phone: professional.phone.maskPhone(),
            email: professional.email,
            username: professional.username,
            password: "",
            reg_number: professional.reg_number,
          };
          const acting = professional.actuations?.[0];
          this.acting_id = acting?.id;
          this.acting_body = {
            specialty_id: acting?.specialty_id || 0,
            clinic_id: acting?.clinic_id || 0,
            professional_id: professional.id,
          };

          this.body_hash = hash(this.body);
          this.acting_body_hash = hash(this.acting_body);
        })
        .catch(() => {
          this.$router.push("/professionals");
        });
    },
    async saveActing(professional_id?: number) {
      const payload = { ...this.acting_body };

      if (this.acting_id && this.acting_body_hash != hash(this.acting_body))
        return actingService
          .update(this.acting_id, payload)
          .then(() => {
            this.reloadProfessionals();
            this.$router.push("/professionals");
          })
          .catch(() => {
            this.isLoading = false;
          });
      else if (!this.acting_id && professional_id) {
        payload.professional_id = professional_id;
        return actingService
          .create(payload)
          .then(async () => {
            this.reloadProfessionals();
            this.$router.push("/professionals");
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
      this.$router.push("/professionals");
    },
    save() {
      this.isLoading = true;
      const payload = {
        ...this.body,
        phone: this.body.phone.removeMask(),
      };

      if (!payload.password) delete payload.password;

      if (this.professional_id && this.body_hash != hash(this.body)) {
        return professionalService
          .update(this.professional_id, payload)
          .then(() => {
            this.saveActing();
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else if (!this.professional_id)
        return professionalService
          .create(payload)
          .then((professional) => {
            this.saveActing(professional.id);
          })
          .catch(() => {
            this.isLoading = false;
          });
      this.saveActing();
    },
    closeModal(e: Event) {
      if (
        e.target == this.$refs.modal_mask ||
        e.target == this.$refs.close_modal
      )
        this.$router.push("/professionals");
    },
    updateValidation(field: string, valid: boolean) {
      this.field_valid[field] = valid;
    },
    async populateSelects() {
      await clinicService.load().then((clinics) => {
        this.select_options.clinics = clinics.map((c) => ({
          value: c.id,
          label: c.name,
        }));
      });

      await specialtyService.load().then((specialties) => {
        this.select_options.specialties = specialties.map((s) => ({
          value: s.id,
          label: s.description,
        }));
      });
    },
    ...mapActions({ reloadProfessionals: "professionals/load" }),
  },
});
</script>

<style scoped>
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
