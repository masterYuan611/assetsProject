import {
  SET_CUSTNO,
  SET_DRAFT,
  SET_SEARCHHISTORY,
  SET_CUSTNM,
  SET_CUSTTEL,
} from "../mutation-types";

const proposal = {
  namespaced: true,
  state: {
    custNo: "", // 当前客户
    custTel: "", // 当前客户手机号
    custNm: "", // 当前客户姓名
    draft: {
      selectReport: [], // 选中章节
      viewId: "", // 观点id
      viewVersion: "", // 观点版本
      auditSearchViewVO: null, // 置顶观点
      pageCode: 0, // 草稿当前页
      planningAsset: "", // 规划资产
      termAssets: "", // 投资期限
      mobility: "", // 流动性
      expectedIncome: "", // 预期收益
      riskTolerance: "", // 最大可承受风险
    }, // 资配建议书草稿
    searchHistory: [], // 搜索历史
  },
  mutations: {
    [SET_CUSTNO](state, custNo) {
      state.custNo = custNo;
    },
    [SET_DRAFT](state, draft) {
      state.draft = draft;
    },
    [SET_SEARCHHISTORY](state, obj) {
      let { value, type } = obj;
      if (type === "clear") {
        state.searchHistory = [];
        return;
      }
      let list = [...state.searchHistory];
      let index = list.findIndex((item) => item === value);
      if (index > -1) {
        list.splice(index, 1);
      }
      list.unshift(value);
      if (list.length > 15) {
        list.pop();
      }
      state.searchHistory = list;
    },
    [SET_CUSTNM](state, custNm) {
      state.custNm = custNm;
    },
    [SET_CUSTTEL](state, custTel) {
      state.custTel = custTel;
    },
  },
  actions: {},
};

export default proposal;
