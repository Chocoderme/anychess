import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/styles/base.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/base.css";
// import 'element-plus/dist/index.css'

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
