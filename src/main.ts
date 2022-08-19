import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import CustomDirectives from "./directives";

import VueKonva from "vue-konva";

import "./assets/styles/base.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/base.css";
// import 'element-plus/dist/index.css'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(CustomDirectives);
app.use(VueKonva);

app.mount("#app");
