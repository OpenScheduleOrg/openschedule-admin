
<template>
  <div class="container scrolled">
    <div class="list-wrapper">
      <h1>Usuários</h1>
      <div class="list-header">
        <router-link class="btn btn-new" :to="{ name: 'user_new' }">
          Cadastrar Usuários
        </router-link>
      </div>
      <ul :class="{
        'list-items': true,
        loading: isLoading,
        'empty-list': !isLoading && !users.length,
      }">
        <template v-if="!isLoading">
          <li v-for="user in (users as UserModel[])" :key="user.id">
            <div class="item-data">
              <strong>{{ user.name }} </strong>
              <p> {{ user.email }}</p>
            </div>
            <div class="item-operations">
              <router-link class="btn" :to="{ name: 'user_edit', params: { user_id: user.id } }">
                <font-awesome-icon :icon="['fa', 'pen-square']"></font-awesome-icon>
              </router-link>
              <button :class="['btn', user.active ? 'btn-delete' : 'btn-new']" @click="toogleStatus(user)">
                <font-awesome-icon :icon="['fa', user.active ? 'ban' : 'check']"></font-awesome-icon>
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
import { UserModel } from "@/domain/models";
import { userService } from "@/domain/services";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

export default defineComponent({
  name: "UserList",
  computed: {
    ...mapState("users", ["users", "isLoading"]),
  },
  created() {
    this.loadUsers();
  },
  methods: {
    toogleStatus(user: UserModel) {
      userService.update(user.id, { active: !user.active}).then(() => {
        this.loadUsers();
      });
    },
    ...mapActions({ loadUsers: "users/load" }),
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

.list-wrapper>h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.list-wrapper .list-header {
  display: flex;
  background-color: rgba(19, 19, 19, 0.06);
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  justify-content: space-between;
  flex-direction: row-reverse;
  margin-bottom: 0.4rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
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
  background-color: rgba(19, 19, 19, 0.10);
  border-radius: 0.5rem;
  margin: 0.6rem 0;
  padding: 0.7rem 1rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

li>* {
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
