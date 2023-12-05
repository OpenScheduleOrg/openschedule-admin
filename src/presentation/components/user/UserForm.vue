<template>
  <transition name="modal">
    <div ref="modal_mask" @mousedown="closeModal($event)" class="modal-mask">
      <div class="modal-container">
        <router-link id="close-modal" :to="{ name: 'users' }">
          <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
        </router-link>

        <h1 class="modal-title">
          {{ !user_id ? "Cadastro " : "" }}Profissional
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
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <text-field
                v-model="body.email"
                :name="'email'"
                :label="'E-mail'"
                :validators="{ required: {}, email: {} }"
                @updateValidation="updateValidation"
              />
              <select-option
                :name="'clinic'"
                :label="'Seleciona estabelecimento'"
                :required="true"
                :options="select_options.clinics"
                :empty_message="'Cadastre uma clínica'"
                v-model="body.clinic_id"
                @updateValidation="updateValidation"
              />
            </div>
            <div class="form-dynamic-row form-group-col-2">
              <text-field
                :name="'username'"
                :label="'Nome de usuário'"
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

          </Form>
        </div>
        <div class="operations-wrap">
          <button
            @click="save()"
            :class="{
              btn: true,
              'btn-update': !isLoading && isFormValid && !!user_id,
              'btn-new': !isLoading && isFormValid && !!!user_id,
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

import { UserBody } from "@/domain/params";
import {
  clinicService,
  userService
} from "@/domain/services";
import { OptionSelect } from "@/presentation/models";

type ComponentData = {
  user_id?: number;
  acting_id?: number;
  isLoading: boolean;
  field_valid: { [field: string]: boolean };
  body: UserBody;
  body_hash?: string;
  acting_body_hash?: string;
  select_options: {
    clinics: OptionSelect[];
  };
};

export default defineComponent({
  name: "UserForm",
  components: { Form, TextField, PasswordField, SelectOption },
  data(): ComponentData {
    const user_id = Number(this.$route.params.user_id);
    return {
      user_id,
      isLoading: false,
      field_valid: {
        name: !!user_id,
        email: !!user_id,
        username: !!user_id,
        clinic: !!user_id,
      },
      body: {
        name: "",
        username: "",
        email: "",
        clinic_id: 0
      },
      select_options: {
        clinics: [],
      },
    };
  },
  async created() {
    await this.populateSelects();
    if (this.user_id) await this.loadUser(this.user_id);
  },
  computed: {
    isFormValid() {
      for (let field_name in this.field_valid)
        if (!this.field_valid[field_name]) return false;
      return true;
    },
  },
  methods: {
    loadUser(user_id: number) {
      this.isLoading = true;
      return userService
        .getById(user_id)
        .then((user) => {
          this.isLoading = false;
          this.body = {
            name: user.name,
            email: user.email,
            username: user.username,
            password: "",
            clinic_id: user.clinic_id
          };

          this.body_hash = hash(this.body);
        })
        .catch(() => {
          this.$router.push("/users");
        });
    },
    save() {
      this.isLoading = true;
      const payload = this.body; 

      if (!payload.password) delete payload.password;

      if (this.user_id && this.body_hash != hash(this.body)) {
        return userService
          .update(this.user_id, payload)
          .then(() => {
            this.reloadUsers();
            this.$router.push("/users");
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else if (!this.user_id)
        return userService
          .create(payload)
          .then(() => {
            this.reloadUsers();
            this.$router.push("/users");
          })
          .catch(() => {
            this.isLoading = false;
          });
          this.reloadUsers();
          this.$router.push("/users");
    },
    closeModal(e: Event) {
      if (
        e.target == this.$refs.modal_mask ||
        e.target == this.$refs.close_modal
      )
        this.$router.push("/users");
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
    },
    ...mapActions({ reloadUsers: "users/load" }),
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
