import { createApp } from "vue";
import App from "@/presentation/App.vue";
import store, { key } from "@/store";
import router from "./router";
import FontAwesomeIcon from "@/presentation/assets/font-awesome";

import "@/presentation/assets/css/style.css";

import "./prototype";

createApp(App)
  .use(store, key)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
