(function (win) {
  function checkPlatform() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) !== null && ua.match(/WxWork/i) !== null) {
      return "WxWork";
    }
    return false;
  }

  win.APIconfig = {
    env: "dev",
    platform: checkPlatform(),
    isWxWork: checkPlatform() === "WxWork",
    //测试地址
    requestUrl: "https://cngw-stg.ghzq.com.cn:9443/ra-api/ra", //新请求地址
    requestReportUrl: "https://cngw-stg.ghzq.com.cn:9443/ra-api", //报告预览求地址
  };
})(window);
