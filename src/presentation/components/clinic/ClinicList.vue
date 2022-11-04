<template>
  <div class="container scrolled">
    <div class="list-wrapper">
      <h1>Clínicas</h1>
      <div class="list-header">
        <router-link class="btn btn-new" :to="{ name: 'clinic_new' }">
          Nova clínica
        </router-link>
      </div>
      <ul
        :class="{
          'list-items': true,
          loading: isLoading,
          'empty-list': !isLoading && !clinics.length,
        }"
      >
        <template v-if="!isLoading">
          <li v-for="clinic in clinics" :key="clinic.id">
            <div class="item-data">
              <strong>{{ clinic.name }} - {{ clinic.cnpj.maskCnpj() }}</strong>
              <p>{{ clinic.cnpj.maskPhone() }}</p>
              <p>{{ clinic.address }}</p>
            </div>
            <div class="item-operations">
              <router-link
                class="btn"
                :to="{ name: 'clinic_edit', params: { clinic_id: clinic.id } }"
              >
                <font-awesome-icon
                  :icon="['fa', 'pen-square']"
                ></font-awesome-icon>
              </router-link>
              <button class="btn btn-delete" @click="deleteClinic(clinic.id)">
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
import { clinicService } from "@/domain/services";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

export default defineComponent({
  name: "ClinicList",
  computed: {
    ...mapState("clinics", ["clinics", "isLoading"]),
  },
  created() {
    this.loadClinics();
  },
  methods: {
    deleteClinic(id: number) {
      if (confirm("Você realmente deseja deletar essa clínica?")) {
        clinicService.deleteById(id).then(() => {
          this.loadClinics();
        });
      }
    },
    ...mapActions({ loadClinics: "clinics/load" }),
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
  content: "Nenhuma clínica cadastrada";
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
