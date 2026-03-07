import { createApp } from "vue";
import App from "@/presentation/App.vue";
import store, { key } from "@/store";
import router from "./router";
import FontAwesomeIcon from "@/presentation/assets/font-awesome";

import vue3GoogleLogin from 'vue3-google-login'

import "@/presentation/assets/css/style.css";

import "./extensions";

let appBuilder = createApp(App)
  .use(store, key)
  .use(router);

if (process.env.VUE_APP_GOOGLE_OAUTH_CLIENTID)
  appBuilder = appBuilder.use(vue3GoogleLogin, { clientId: process.env.VUE_APP_GOOGLE_OAUTH_CLIENTID })

appBuilder.component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
