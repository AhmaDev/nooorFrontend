import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isLoggedIn: false,
    loginInfo: null,
    sessionKey: null,
    token: null,
    actionsToolTip: {
      arrow: true,
      arrowType: "round",
      placement: "top",
      followCursor: true,
      animateFill: true,
      animation: "scale",
    },
  },
  mutations: {
    setLoginInfo: function (state, payload) {
      state.loginInfo = payload;
      state.isLoggedIn = true;
    },
    setSessionKey: function (state, payload) {
      state.sessionKey = payload.sessionKey;
      state.token = payload.token;
    },
  },
  actions: {},
  modules: {},
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    getLoginInfo: (state) => state.loginInfo,
  },
});
