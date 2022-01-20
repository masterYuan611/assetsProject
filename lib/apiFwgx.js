import http from "http.js";
function register(path, method = "get") {
  return function (params) {
    return http[method](path, params);
  };
}

const apiList = [
  {
    url: "/search/custominfo",
    func: "getSearchList",
    method: "get",
    desc: "模糊搜索",
  },
  {
    url: "/custom/asset/allocation",
    func: "getCustAsset",
    method: "get",
    desc: "获取客户的资产配置参数",
  },
  {
    url: "/custom/asset/allocation/revise",
    func: "postAllocationRevise",
    method: "post",
    desc: "修改资产配置",
  },
  {
    url: "/custom/asset/currentallocation",
    func: "getAssetData",
    method: "get",
    desc: "获取资产比例",
  },
  {
    url: "/custom/asset/recommendallocation",
    func: "getSuggestData",
    method: "get",
    desc: "获取建议持仓",
  },
  {
    url: "/home/recommendallocation",
    func: "getSuggestElseData",
    method: "get",
    desc: "获取无客户号的建议持仓",
  },
  {
    url: "/home/productportfoliolist",
    func: "getCombinationElseProducts",
    method: "get",
    desc: "获取无客户号的产品组合",
  },
  {
    url: "/custom/productportfoliolist",
    func: "getCombinationProducts",
    method: "get",
    desc: "获取组合产品",
  },
  {
    url: "/user/basicInfo/report/account",
    func: "getUseBasicInfo",
    method: "get",
    desc: "用户基本信息控制器",
  },
  {
    url: "/user/basicInfo/all/current/position",
    func: "getAllCurrentPosition",
    method: "get",
    desc: "获取所有证券分类的当前持仓",
  },
  {
    url: "/user/basicInfo/user/detail",
    func: "getUserDetail",
    method: "get",
    desc: "查询用户基本信息",
  },
  {
    url: "/user/basicInfo/follow",
    func: "updateFollow",
    method: "post",
    desc: "更新关注状态",
  },
  {
    url: "/user/basicInfo/dimensional/graph",
    func: "dimensionalGraph",
    method: "get",
    desc: "获取用户五维图",
  },
  {
    url: "/user/asset/analysis/recent/one/month/avg/asset",
    func: "oneMonthAvgAsset",
    method: "get",
    desc: "查询近一个月资产均值",
  },
  {
    url: "/user/asset/analysis/recent/one/month/earning/rate",
    func: "oneMonthEarningRate",
    method: "get",
    desc: "查询近一个月收益率",
  },
  {
    url: "/user/asset/analysis/recent/one/month/turn/rate",
    func: "oneMonthTurnRate",
    method: "get",
    desc: "查询近一个月日均换手率",
  },
  {
    url: "/user/asset/analysis/earnings/trend",
    func: "earingsTrend",
    method: "get",
    desc: "查询收益走势",
  },
  {
    url: "/user/asset/analysis/profitAndLoss",
    func: "profitAndLoss",
    method: "get",
    desc: "查询盈亏情况",
  },
  {
    url: "/user/asset/analysis/asset/trend",
    func: "assetTrend",
    method: "get",
    desc: "查询资产走势",
  },
  {
    url: "/user/asset/analysis/history/position",
    func: "historyPosition",
    desc: "查询历史仓位",
  },
  {
    url: "/trade/behavior/stock",
    func: "getTradeBehavior",
    method: "get",
    desc: "交易分析",
  },
  {
    url: "/trade/features/stocklist",
    func: "getTradeFeatureso",
    method: "get",
    desc: "特征股票",
  },
  {
    url: "/diagnosis/conclusion",
    func: "getDiagnosisConclusion",
    method: "get",
    desc: "用户诊断-账户诊断话术",
  },
  {
    url: "/trade/invest/indus",
    func: "getInvestIndus",
    method: "get",
    desc: "投资风格-按行业",
  },
  {
    url: "/trade/invest/style",
    func: "getInvestStyle",
    method: "get",
    desc: "投资风格-按风格",
  },
  {
    url: "/qy/auth",
    func: "getAuthentication",
    method: "post",
    desc: "授权登录",
  },
  {
    url: "/historicalreport/v2",
    func: "getHistoryList",
    method: "post",
    desc: "获取用户历史报告",
  },
  {
    url: "/historicalreport/v2/custom",
    func: "getSingleHistoryList",
    method: "post",
    desc: "获取单个用户历史报告",
  },
  {
    url: "/customerdynamic/home",
    func: "getHomeStatusList",
    method: "get",
    desc: "首页的客户动态",
  },
  {
    url: "/customerdynamic/detail",
    func: "getStatusList",
    method: "get",
    desc: "客户动态详情",
  },
  {
    url: "/user/basicInfo/getReportCode",
    func: "getCode",
    method: "post",
    desc: "生成编码",
  },
  {
    url: "/get/h5",
    func: "Previewreport",
    method: "get",
    desc: "获取h5页面,没有此h5就生成h5,再返回",
  },
  {
    url: "/get/node/createpdf",
    func: "creatreport",
    method: "get",
    desc: "生成pdf",
  },
  {
    url: "/get/file/stream",
    func: "loadreport",
    method: "get",
    desc: "下载pdf",
  },
  {
    url: "/get/file/authority",
    func: "authority",
    method: "get",
    desc: "下载报告前鉴权",
  },
  {
    url: "/file/report/code",
    func: "checkloadadrecss",
    method: "get",
    desc: "查询下载接口地址",
  },
  {
    url: "/get/file/xlsx",
    func: "getxsl",
    method: "get",
    desc: "获取博爱",
  },
  // {
  //   url: "/get/h5/file",
  //   func: "htmlreport",
  //   method: "get",
  //   desc: "获取h5页面,没有此h5就生成h5,再返回",
  // },
  {
    // url: "/user/basicInfo/customlist",
    url: "/search/customlistyh",
    func: "getUserDetailList",
    method: "post",
    desc: "查询用户列表",
  },
  {
    url: "/qy/getAccessJsSdkInfo",
    func: "getAccessJsSdkInfo",
    method: "post",
    desc: "企微获取授权信息",
  },
  {
    url: "/getAccessJsSdkInfo",
    func: "getWeiAccessJsSdkInfo",
    method: "post",
    desc: "微信获取授权信息",
  },
  {
    url: "/custom/elementcheck",
    func: "customElementcheck",
    desc: "客户四要素检查",
  },
  {
    url: "/asset/allocation/report/getAssetAllocation",
    func: "findDraft",
    desc: "查询草稿",
  },
  {
    url: "/asset/allocation/report/addAssetAllocation",
    func: "updateDraft",
    desc: "创建或更新草稿",
    method: "post",
  },
  {
    url: "/asset/allocation/report/delAssetAllocation",
    func: "deleteDraft",
    desc: "删除草稿",
    method: "delete",
  },
  {
    url: "/asset/allocation/report/search",
    func: "findViews",
    desc: "查询观点",
    method: "get",
  },
  {
    url: "/asset/allocation/report/detail",
    func: "findViewDetail",
    desc: "查询观点详情",
    method: "get",
  },
  {
    url: "/asset/allocation/report/getCustomPreference",
    func: "getCustomPreference",
    desc: "获取客户偏好",
    method: "get",
  },
  {
    url: "/compliance/risk/assessment",
    func: "getRiskAssessment",
    desc: "获取客户风险评测信息",
    method: "get",
  },
  {
    url: "/search/maincompany",
    func: "getmaincompany",
    desc: "获取主体公司列表",
    method: "get",
  },
  {
    url: "/search/subdepartment",
    func: "getsubdepartment",
    desc: "获取下辖营业部列表",
    method: "get",
  },
  {
    url: "/search/subordinatemanager",
    func: "getsubordinatemanager",
    desc: "获取营业部下属的客户经理列表",
    method: "get",
  },
  {
    url: "/search/customlist",
    func: "getSerchCutomlist",
    desc: "搜索之后数据去客户选择列表页面",
    method: "get",
  },
  {
    url: "/audit/view/search",
    func: "viewSearch",
    desc: "查询观点",
  },
  {
    url: "/audit/view/detail",
    func: "viewDetail",
    desc: "观点详情",
  },
  {
    url: "/audit/view/approve",
    func: "viewApprove",
    desc: "审核通过",
    method: "post",
  },
  {
    url: "/audit/view/reject",
    func: "viewReject",
    desc: "审核驳回",
    method: "post",
  },
  {
    url: "/audit/view/remove",
    func: "viewRemove",
    desc: "下架",
    method: "post",
  },
  {
    url: "/search/product",
    func: "getProductList",
    desc: "获取产品列表",
    method: "get",
  },
  {
    url: "/asset/allocation/report/getcheckHold",
    func: "getcheckHold",
    desc: "判断持有or新增",
    method: "get",
  },
  {
    url: "/custom/raisedfunds",
    func: "getCustomRaisedfunds",
    desc: "加载客户持仓",
    method: "get",
  },
  {
    url: "/custom/risklevel",
    func: "getRisk",
    desc: "获取用户风险等级",
    method: "get",
  },
  {
    url: "/custom/asset/v2/recommendallocation",
    func: "getSuggest",
    desc: "获取配置建议进来的客户建议持仓",
    method: "get",
  },
  {
    url: "/custom/asset/v2/productportfoliolist",
    func: "getProducts",
    desc: "获取配置建议进来的客户组合产品",
    method: "get",
  },
];
const API = apiList.reduce((ret, obj) => {
  ret[obj.func] = register(obj.url, obj.method);

  return ret;
}, {});
export default API;
