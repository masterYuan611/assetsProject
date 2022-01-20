const getters = {
  custNo: (state) => state.proposal.custNo,
  draft: (state) => state.proposal.draft,
  searchHistory: (state) => state.proposal.searchHistory,
  custTel: (state) => state.proposal.custTel,
  custNm: (state) => state.proposal.custNm,
  isInvestmentAdvisor: (state) => state.user.isInvestmentAdvisor,
  authorization: (state) => state.user.authorization,
  maxRole: (state) => state.user.maxRole,
  roleCodes: (state) => state.user.roleCodes,
  statusActive: (state) => state.user.statusActive,
};

export default getters;
