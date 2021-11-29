<template>
  <div class="containe">
    <div class="login-form">
      <h1>ConsuChat</h1>
      <hr />
      <span class="error">{{ messages.error.both }}</span>
      <div class="form-group">
        <label for="username">Username</label>
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
        <label for="password">Password</label>
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
        v-model="form.rememberMe"
        name="rememberMe"
        id="rememberMe"
      /><label for="rememberMe">Lembrar-me</label>
      <div class="form-group">
        <button
          id="btnSubmit"
          ref="btnSubmit"
          @click="submit()"
          :disabled="!form.password || !form.username"
        >
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ButtonHTMLAttributes, defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      form: { username: "", password: "", rememberMe: false },
      messages: {
        error: {
          both: "",
          username: "",
          password: "",
        },
      },
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
      this.$store
        .dispatch("auth/login", this.form)
        .then(() => this.$router.push("/"))
        .catch(
          (error) =>
            (this.messages.error.both =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString() ||
              "Inespected error.")
        );
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
  width: 25vw;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: solid rgb(43, 116, 226) 1.2px;
  border-radius: 5px;
  padding: 3em 1.25em;
}

.error {
  color: var(--font-danger);
}
span {
  display: inline-block;
  width: 100%;
  font-size: 0.9em;
}

.login-form > span {
  text-align: center;
}

h1 {
  text-align: center;
  margin-bottom: 0.6em;
  font-family: "Roboto";
  font-weight: 800;
  color: #0d45c3;
}

hr {
  border: solid 1px rgb(218, 218, 218);
  margin: 1em -1.25rem;
}

label[for="rememberMe"] {
  font-size: 0.8em;
}
input[type="checkbox"] {
  height: 0.8em;
}

button {
  width: 100%;
}
</style>
