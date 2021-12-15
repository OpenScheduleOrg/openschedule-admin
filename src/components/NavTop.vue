<template>
  <div class="hd-left">
    <router-link class="brand" to="/" title="ConsuChat">ConsuChat</router-link>
  </div>
  <div class="hd-center">
    <div class="nav-calendar">
      <router-link
        class="hd_button"
        :class="{ 'is-today': isToday && isAgendaRoute }"
        :to="{ name: period }"
      >
        hoje
      </router-link>
      <router-link
        class="prev-next"
        :to="{
          name: period,
          params: {
            day: datePrev.getDate(),
            month: datePrev.getMonth() + 1,
            year: datePrev.getFullYear(),
          },
        }"
      >
        <font-awesome-icon icon="chevron-left" />
      </router-link>
      <router-link
        class="prev-next"
        :to="{
          name: period,
          params: {
            day: dateNext.getDate(),
            month: dateNext.getMonth() + 1,
            year: dateNext.getFullYear(),
          },
        }"
      >
        <font-awesome-icon icon="chevron-right" />
      </router-link>
      <span class="today-date"> {{ dayMonthYear }} </span>
    </div>
    <div class="period-calendar">
      <router-link
        class="hd_button"
        v-for="(text, p) in periods"
        :class="{ 'selected-period': isActivedPeriod(p) && isAgendaRoute }"
        :key="p"
        :to="{
          name: p,
          params: {
            day: current_date.getDate(),
            month: current_date.getMonth() + 1,
            year: current_date.getFullYear(),
          },
        }"
      >
        {{ text }}
      </router-link>
    </div>
  </div>
  <div class="hd-right">
    <div class="dropdown">
      <button id="btn-dropdown">
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="w3schools"
        />
        <span>{{ user.nome }} {{ user.sobrenome }}</span>
      </button>
      <ul div class="drop-content" ref="drop-content">
        <li class="user-detail">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="w3schools"
          />
          <div>
            <span :title="user.nome + ' ' + user.sobrenome"
              >{{ user.nome }} {{ user.sobrenome }}</span
            >
            <span class="text-continous" :title="user.email">{{
              user.email
            }}</span>
          </div>
        </li>
        <hr />
        <li>
          <router-link class="dropdown-link" to="/profile">
            Perfil
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-link" to="/config">
            Configurações
          </router-link>
        </li>
        <hr />
        <li>
          <router-link class="dropdown-link" to="/logout"> Sair </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import { Periods } from "@/constants";

export default defineComponent({
  name: "NavTop",
  data() {
    return {
      user: this.$store.state.auth.user,
      periods: Periods[navigator.language],
    };
  },
  computed: {
    ...mapGetters({
      dayMonthYear: "calendar/getDateString",
      datePrev: "calendar/getDatePrev",
      dateNext: "calendar/getDateNext",
      isActivedPeriod: "calendar/isActivedPeriod",
      isToday: "calendar/isToday",
    }),
    ...mapState("calendar", ["period", "current_date"]),
    isAgendaRoute() {
      return this.$route.path.startsWith("/agenda");
    },
  },
});
</script>
<style scoped>
* {
  color: var(--font-light);
}
header.grid-item > div,
.nav-calendar,
.dropdown {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hd-left {
  width: 20%;
}
.hd-center {
  width: 60%;
  padding: 0 8px;
}
.hd-right {
  width: 20%;
  justify-content: flex-end !important;
}
.brand {
  display: inline-block;
  margin-left: 1rem;
  padding: 10px 30px;
  font-size: 2.1rem;
  font-weight: bolder;
}

a.hd_button {
  padding: 0.5rem 0.8rem;
  font-weight: bold;
  margin: 0 6px;
  border: solid 1.3px rgb(216, 216, 216);
  border-radius: 3px;
  font-size: 0.9rem;
}
.nav-calendar > .button {
  margin-right: 18px;
}
.prev-next > * {
  height: 1.3rem;
  width: 1.3rem;
}
.prev-next {
  padding: 0.4rem 0.4rem;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}
a.hd_button:hover,
.prev-next:hover {
  background-color: rgba(241, 241, 241, 0.158);
}
.prev-next:active {
  background-color: rgba(241, 241, 241, 0.432);
}

.today-date {
  font-size: 1.5rem;
  margin: 0 0.2rem;
}
.hd-center a {
  text-transform: uppercase;
}

a.selected-period,
a.is-today {
  pointer-events: none;
  cursor: initial;
  background-color: rgba(0, 0, 0, 0.219) !important;
  border-color: rgba(0, 0, 0, 0) !important;
  transition: all 0.4s !important;
}

.dropdown {
  background-color: var(--bg-header);
}
#btn-dropdown {
  border-radius: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  background: none;
  font-size: 0.9rem;
}
#btn-dropdown:hover,
#btn-dropdown:focus {
  background-color: rgba(255, 255, 255, 0.048);
}
img {
  border-radius: 50%;
  height: 8vh;
  margin: 0 4px;
}
.drop-content {
  position: absolute;
  display: block;
  padding: 0.5rem 1rem 4px 4px;
  z-index: 32;
  top: 10vh;
  right: 5px;
  background-color: var(--bg-dropdown);
  width: 16vw;
  border-radius: 2px;
  list-style-type: none;
  border: solid 1px black;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.4s linear;
}
#btn-dropdown:focus ~ .drop-content {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s, opacity 0.4s linear;
}
.drop-content:hover {
  visibility: visible;
  opacity: 1;
}

.drop-content * {
  color: black;
}
.drop-content > a {
  display: block;
}
.drop-content li:not(:first-child) {
  width: 100%;
  margin: 0.7rem 0;
}
.drop-content .user-detail {
  display: flex;
  width: 100%;
  padding: 4px;
  font-size: 0.88rem;
}
.drop-content .user-detail div {
  padding: 3px;
  max-width: 70%;
}
.drop-content hr {
  border: solid 1px rgb(194, 194, 194);
  margin-top: 4px;
}

.drop-content .user-detail img {
  height: 45px;
}

.drop-content .user-detail span {
  display: block;
  margin: 3px;
}

.dropdown-link {
  display: block;
  text-align: center;
  width: 80%;
  padding: 0.2rem;
  border-radius: 4px;
  margin: 0 auto;
  border: solid 1px rgb(228, 228, 228);
}
.dropdown-link:hover {
  background-color: rgb(228, 228, 228);
}
</style>
