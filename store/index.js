import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import proposal from "./modules/proposal";
import user from "./modules/user";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    proposal,
    user,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
  plugins: [
    createPersistedState({
      key: "session-storage",
      paths: [
        "proposal.custNo",
        "proposal.draft",
        "user.isInvestmentAdvisor",
        "user.authorization",
        "user.maxRole",
        "user.roleCodes",
      ],
      storage: window.sessionStorage,
    }),
    createPersistedState({
      key: "local-storage",
      paths: ["proposal.searchHistory"],
      storage: window.localStorage,
    }),
  ],
});
