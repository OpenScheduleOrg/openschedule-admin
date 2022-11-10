
<template>
  <div class="container scrolled">
    <div class="list-wrapper">
      <h1>Profissionais</h1>
      <div class="list-header">
        <router-link class="btn btn-new" :to="{ name: 'professional_new' }">
          Cadastro professional
        </router-link>
      </div>
      <ul
        :class="{
          'list-items': true,
          loading: isLoading,
          'empty-list': !isLoading && !professionals.length,
        }"
      >
        <template v-if="!isLoading">
          <li v-for="professional in (professionals as ProfessionalModel[])" :key="professional.id">
            <div class="item-data">
              <strong>{{ professional.name }} </strong>
              <p>{{ professional.actuations?.[0].specialty_description || "Especialidade não definida" }} na {{ professional.actuations?.[0].clinic_name || "Clinica não definida"}}</p>
              <p>E-mail: {{ professional.email }}</p>
              <p>Telefone: {{ professional.phone.maskPhone() }}</p>
            </div>
            <div class="item-operations">
              <router-link
                class="btn"
                :to="{ name: 'professional_edit', params: { professional_id: professional.id } }"
              >
                <font-awesome-icon
                  :icon="['fa', 'pen-square']"
                ></font-awesome-icon>
              </router-link>
              <button class="btn btn-delete" @click="deleteProfessional(professional.id)">
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
// eslint-disable-next-line 
import { ProfessionalModel } from "@/domain/models";
import { professionalService } from "@/domain/services";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

export default defineComponent({
  name: "ProfessionalList",
  computed: {
    ...mapState("professionals", ["professionals", "isLoading"]),
  },
  created() {
    this.loadProfessionals();
  },
  methods: {
    deleteProfessional(id: number) {
      if (confirm("Você realmente deseja deletar essa clínica?")) {
        professionalService.deleteById(id).then(() => {
          this.loadProfessionals();
        });
      }
    },
    ...mapActions({ loadProfessionals: "professionals/load" }),
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
  width: 65%;
  background-color: rgba(19, 19, 19, 0.082);
  border-radius: 0.6rem;
  padding: 1.3rem 3rem;
}

.list-wrapper > h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.list-wrapper .list-header {
  display: flex;
  background-color: rgba(19, 19, 19, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  justify-content: space-between;
  flex-direction: row-reverse;
  margin-bottom: 0.4rem;
}

.list-header .btn {
  border-radius: 4px;
}

.list-items {
  min-height: 110px;
  padding: 0.3rem;
}

.list-items.empty-list::after {
  content: "Nenhum profissional cadastrada";
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  color: rgba(169, 169, 169, 0.967);
  margin-top: 1.2rem;
}

.list-items.loading::after {
  content: "Carregando...";
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  color: rgba(169, 169, 169, 0.827);
  margin-top: 1.2rem;
}

.list-wrapper li {
  display: flex;
  background-color: rgba(162, 162, 162, 0.25);
  border-radius: 0.5rem;
  margin: 0.6rem 0;
  padding: 0.7rem 1rem;
}

li > * {
  flex: 13;
}

li .item-data strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 2px;
}

li .item-operations {
  flex: 3;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.item-operations .btn {
  width: 45px;
  height: 45px;
  border-radius: 45px;
  font-size: 1.1rem;
}
</style>
