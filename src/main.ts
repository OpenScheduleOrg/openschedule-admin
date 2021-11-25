import { createApp } from "vue";
import App from "./App.vue";
import store, { key } from "./store";
import router from "./router";
import FontAwesomeIcon from "@/plugins/font-awesome";

import "./assets/css/style.css";

createApp(App)
  .use(store, key)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
