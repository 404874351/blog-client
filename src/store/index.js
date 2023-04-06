import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    loginVisible: false,
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    DEL_USER_INFO(state) {
      state.userInfo = null
    },

    SET_LOGIN_VISIBLE(state, loginVisible) {
      state.loginVisible = loginVisible
    },

  },
  actions: {},
  modules: {},
});
