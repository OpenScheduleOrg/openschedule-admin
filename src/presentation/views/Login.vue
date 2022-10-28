<template>
  <div class="containe">
    <div class="login-form">
      <h1>ConsuChat</h1>
      <hr />
      <span class="error">{{ messages.error.both }}</span>
      <div class="form-group">
        <label for="username">Usuário</label>
        <input
          ref="username"
          type="text"
          @keyup.enter="submit"
          v-model="form.username"
          autofocus
          placeholder="username"
          name="username"
          id="username"
        />
        <span class="error">{{ messages.error.username }}</span>
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input
          ref="password"
          type="password"
          @keyup.enter="submit"
          v-model="form.password"
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
          name="password"
          id="password"
        />
        <span class="error">{{ messages.error.password }}</span>
      </div>
      <hr />
      <input
        type="checkbox"
        v-model="form.remember_me"
        name="remember-me"
        id="remember-me"
      /><label for="remember-me">Lembrar-me</label>
      <div class="form-group">
        <button
          id="btnSubmit"
          ref="btnSubmit"
          @click="submit()"
          :disabled="!form.password || !form.username"
          :class="{ isSubmited: loading }"
        >
          <transition name="fade" mode="out-in">
            <div v-if="loading" class="loader"></div>
            <span v-else>Entrar</span>
          </transition>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      form: { username: "", password: "", remember_me: false },
      messages: {
        error: {
          both: "",
          username: "",
          password: "",
        },
      },
      loading: false,
    };
  },
  mounted() {
    const input = this.$refs.username as HTMLInputElement;
    const btnSubmit = this.$refs.btnSubmit as HTMLButtonElement;

    setTimeout(() => {
      if (input.matches(":-webkit-autofill")) {
        btnSubmit.removeAttribute("disabled");
      }
    }, 500);
  },
  methods: {
    checkForm(usern = true, passw = true) {
      let isValid = true;
      if (!this.form.username && usern)
        (this.messages.error.username = "Campo vazio"), (isValid = false);
      else if (usern) this.messages.error.username = "";
      if (!this.form.password && passw)
        (this.messages.error.password = "Campo vazio"), (isValid = false);
      else if (passw) this.messages.error.password = "";

      return isValid;
    },
    submit() {
      if (!this.checkForm()) return;

      this.loading = true;
      this.$store
        .dispatch("auth/login", this.form)
        .then(() => this.$router.push("/"))
        .catch((error) => {
          this.loading = false;
          return (this.messages.error.both =
            error.msg ||
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString() ||
            "Inespected error.");
        });
    },
  },
  watch: {
    "form.username": function () {
      this.checkForm(true, false);
    },
    "form.password": function () {
      this.checkForm(false);
    },
  },
});
</script>

<style scoped>
.containe {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-dark);
}

.login-form {
  position: absolute;
  background-color: white;
  width: 23vw;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: solid rgb(43, 116, 226) 1.2px;
  border-radius: 5px;
  padding: 1.75em 1.25em;
}

.error {
  color: var(--font-danger);
  margin-bottom: 4px;
}
span {
  display: block;
  width: 100%;
  height: 1.1em;
}

.login-form > span {
  text-align: center;
}

h1 {
  text-align: center;
  margin-bottom: 0.9em;
  font-family: "Roboto";
  font-weight: 800;
  color: #0d45c3;
}

hr {
  border: solid 1px rgb(218, 218, 218);
  margin: 0.7em -1.25rem;
}

label[for="remember-me"] {
  font-size: 0.8em;
}
input[type="checkbox"] {
  height: 0.8em;
}

button {
  width: 100%;
  height: 2.4rem;
  margin: 4px 0;
}
button > span {
  display: inline;
  font-size: 0.95rem;
}

.isSubmited {
  pointer-events: none;
  cursor: initial;
  background-color: #075197;
}

.loader {
  border: 0.15em solid #ffffff;
  border-radius: 50%;
  border-top: 0.15rem solid #0392f1;
  width: 1.5rem;
  height: 1.5rem;
  -webkit-animation: spin 800ms linear infinite; /* Safari */
  animation: spin 800ms linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group {
  width: 100%;
  font-size: 0.8rem;
  margin-bottom: 1em;
}

.form-group > label {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 7px;
}

.form-group > input {
  width: 100%;
  background-color: var(--input-default);
  font-size: 1.05em;
  padding: 0.77em 0.77em;
  border: solid 1px var(--input-default);
  border-radius: 2px;
}
.form-group > input:focus,
.form-group > input:hover {
  background-color: var(--input-focused);
  border-color: var(--input-focused);
}
</style>
