import { createApp } from "vue";
import App from "@/presentation/App.vue";
import store, { key } from "@/store";
import router from "./router";
import FontAwesomeIcon from "@/presentation/assets/font-awesome";

import vue3GoogleLogin from 'vue3-google-login'

import "@/presentation/assets/css/style.css";

import "./extensions";

createApp(App)
  .use(store, key)
  .use(router)
  .use(vue3GoogleLogin, {   clientId: process.env.VUE_APP_GOOGLE_OAUTH_CLIENTID })
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
