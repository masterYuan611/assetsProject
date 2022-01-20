(function (win) {
  function checkPlatform() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) !== null && ua.match(/WxWork/i) !== null) {
      return "WxWork";
    }
    return false;
  }

  win.APIconfig = {
    env: "uat",
    platform: checkPlatform(),
    isWxWork: checkPlatform() === "WxWork",
    //测试地址
    requestUrl: "https://cngw.ghzq.com.cn:9443/ra-api/ra", //请求地址
    requestReportUrl: "https://cngw.ghzq.com.cn:9443/ra-api", //报告预览求地址
  };
})(window);
