import {
  SET_AUTHORIZATION,
  SET_MAXROLE,
  SET_ROLECODES,
  SET_ISINVESTMENTADVISOR,
} from "../mutation-types";

const user = {
  namespaced: true,
  state: {
    authorization: "", // token
    maxRole: "", // 最大角色编码
    roleCodes: [], //拥有的角色类型
    isInvestmentAdvisor: false, // 是否有投顾资格
    statusActive: 0, // 观点审核页面观点状态
  },
  mutations: {
    [SET_AUTHORIZATION](state, authorization) {
      state.authorization = authorization;
    },
    [SET_MAXROLE](state, maxRole) {
      state.maxRole = maxRole;
    },
    [SET_ROLECODES](state, roleCodes) {
      state.roleCodes = roleCodes;
    },
    [SET_ISINVESTMENTADVISOR](state, isInvestmentAdvisor) {
      state.isInvestmentAdvisor = isInvestmentAdvisor;
    },
    SETSTATEACTIVE(state, val) {
      state.statusActive = val;
    },
  },
  actions: {},
};

export default user;
