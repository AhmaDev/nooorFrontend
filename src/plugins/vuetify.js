import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  rtl: true,
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#4C17AA",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#6FC972",
        warning: "#FFC107",
        background: "#FFFFFF",
        appBackground: "#EEEEEE",
        ovarlay: "#1B2531",
      },
      dark: {
        background: "#1B2531",
        appBackground: "#11171F",
        ovarlay: "#EEEEEE",
      },
    },
  },
});
