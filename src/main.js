import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import Toasted from "vue-toasted";
import LottieVuePlayer from "@lottiefiles/vue-lottie-player";
import VueTippy, { TippyComponent } from "vue-tippy";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import LottieAnimation from "lottie-web-vue";

import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/google.css";
import "tippy.js/themes/translucent.css";

Vue.prototype.$axios = axios.create({
  baseURL: "https://api.nooor.app/api/",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

Vue.prototype.$vdocipher = axios.create({
  baseURL: "https://dev.vdocipher.com/api/",
  headers: {
    Authorization:
      "Apisecret CtFOFsoOFNf1vvyKhrTsTZAl1oRVmc6REpUZvDSLeFn1FPds0YMBMWlFBHL89Xcz",
  },
});

Vue.use(VueTippy);
Vue.component("tippy", TippyComponent);
Vue.use(LottieAnimation);
Vue.config.productionTip = false;
Vue.use(Toasted, {
  duration: 5000,
  iconPack: "mdi",
  theme: "bubble",
  position: "bottom-center",
});

Vue.use(Toast, {
  transition: "Vue-Toastification__slideBlurred",
  maxToasts: 20,
  newestOnTop: true,
  position: "bottom-center",
});

Vue.prototype.$apiBaseUrl = "http://localhost:3200/api/";
Vue.use(LottieVuePlayer);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
