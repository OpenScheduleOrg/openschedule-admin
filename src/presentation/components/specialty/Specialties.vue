<template>
  <div class="container scrolled">
    <div class="list-wrapper">
      <h1>Especialidades</h1>
      <div class="list-header">
        <Form>
          <text-field
            v-model="body.description"
            :name="'description'"
            :label="'Nome da especialidade'"
            :validators="{ required: {} }"
            @updateValidation="updateValidation"
            :validation="validations.description"
          />
        </Form>
        <button
          @click="save()"
          :class="{
            btn: true,
            'btn-update': !disableButton && isFormValid && !!specialty_id,
            'btn-new': !disableButton && isFormValid && !!!specialty_id,
          }"
          :disabled="!isFormValid || disableButton"
        >
          <font-awesome-icon
            v-if="!!specialty_id"
            :icon="['fa', 'save']"
          ></font-awesome-icon>
          <font-awesome-icon v-else :icon="['fa', 'plus']"></font-awesome-icon>
        </button>
      </div>
      <ul
        :class="{
          'list-items': true,
          loading: isLoading,
          'empty-list': !isLoading && !specialties.length,
        }"
      >
        <template v-if="!isLoading">
          <li v-for="specialty in specialties" :key="specialty.id">
            <div class="item-data">
              <strong>{{ specialty.description }}</strong>
            </div>
            <div class="item-operations">
              <button
                class="btn btn-update"
                @click="setToUpdate(specialty.id, specialty.description)"
              >
                <font-awesome-icon
                  :icon="['fa', 'pen-square']"
                ></font-awesome-icon>
              </button>
              <button
                class="btn btn-delete"
                @click="deleteSpecialty(specialty.id)"
              >
                <font-awesome-icon :icon="['fa', 'trash']"></font-awesome-icon>
              </button>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Form, TextField } from "../util";
import { defineComponent } from "vue";

import { specialtyService } from "@/domain/services";
import { SpecialtyBody } from "@/domain/params";
import { SpecialtyModel } from "@/domain/models";

type ComponentData = {
  isLoading: boolean;
  specialties: SpecialtyModel[];
  validations: { [field: string]: { valid: boolean; message?: string } };
  specialty_id?: number;
  body: SpecialtyBody;
  disableButton: boolean;
};

export default defineComponent({
  name: "Specialties",
  components: { Form, TextField },
  data(): ComponentData {
    return {
      specialties: [],
      isLoading: true,
      validations: { description: { valid: false } },
      specialty_id: undefined,
      body: {
        description: "",
      },
      disableButton: false,
    };
  },
  created() {
    this.loadSpecialties();
  },
  computed: {
    isFormValid() {
      for (let field in this.validations)
        if (!this.validations[field].valid) return false;
      return true;
    },
  },
  methods: {
    setToUpdate(id: number, description: string) {
      this.specialty_id = id;
      this.body.description = description;
      this.validations.description = { valid: true };
    },
    deleteSpecialty(id: number) {
      if (confirm("Você realmente deseja remover essa especialidade?")) {
        specialtyService.deleteById(id).then(() => {
          this.loadSpecialties();
        });
      }
    },
    loadSpecialties() {
      this.isLoading = true;
      specialtyService
        .load()
        .then((specialties) => {
          this.specialties = specialties;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    updateValidation(field: string, valid: boolean) {
      this.validations[field].valid = valid;
    },
    save() {
      this.disableButton = true;
      if (this.specialty_id)
        return specialtyService
          .update(this.specialty_id, this.body)
          .then(() => {
            this.disableButton = false;
            this.loadSpecialties();
            this.body.description = "";
            this.specialty_id = undefined;
            this.validations.description.valid = false;
          })
          .catch(() => {
            this.disableButton = false;
          });

      return specialtyService
        .create(this.body)
        .then(() => {
          this.disableButton = false;
          this.loadSpecialties();
          this.body.description = "";
          this.validations.description.valid = false;
        })
        .catch(() => {
          this.disableButton = false;
        });
    },
  },
});
</script>

<style scoped>
.container {
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
  height: 100%;
}

.container .list-wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-height: 100%;
  width: 40%;
  background-color: rgba(19, 19, 19, 0.082);
  border-radius: 0.6rem;
  padding: 1.3rem 3rem;
}

.cc-form {
  width: 240px;
}

.list-wrapper > h1 {
  text-align: center;
  margin-bottom: 1.4rem;
}

.list-wrapper .list-header {
  display: flex;
  background-color: rgba(69, 69, 69, 0.094);
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  align-items: center;
}

.list-header .btn {
  padding: 0;
  border-radius: 4px;
  height: 45px;
  width: 45px;
}

.list-items {
  min-height: 110px;
  padding: 0.3rem;
}

.list-items.empty-list::after {
  content: "Nenhuma especialidade cadastrada";
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 1.3rem;
  color: rgba(169, 169, 169, 0.967);
  margin-top: 1.2rem;
}

.list-items.loading::after {
  content: "Carregando...";
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  color: rgba(169, 169, 169, 0.827);
  margin-top: 1.2rem;
}

.list-wrapper li {
  display: flex;
  background-color: rgb(255, 255, 255);
  border-radius: 0.5rem;
  margin: 0.6rem 0;
  padding: 0.7rem 1rem;
}

li > * {
  flex: 13;
}

li .item-data {
  display: flex;
  align-items: center;
}

li .item-data strong {
  vertical-align: center;
  font-size: 1.2rem;
}

li .item-operations {
  flex: 3;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.item-operations .btn {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin: 2px;
  font-size: 0.9rem;
}
</style>
