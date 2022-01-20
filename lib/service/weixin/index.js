import apiFwgx from "apiFwgx";

const WX_API_LIST = [
  "checkJsApi",
  "onMenuShareTimeline",
  "onMenuShareAppMessage",
  "onMenuShareQQ",
  "onMenuShareWeibo",
  "hideMenuItems",
  "showMenuItems",
  "hideAllNonBaseMenuItem",
  "showAllNonBaseMenuItem",
  "translateVoice",
  "startRecord",
  "stopRecord",
  "onRecordEnd",
  "playVoice",
  "pauseVoice",
  "stopVoice",
  "uploadVoice",
  "downloadVoice",
  "chooseImage",
  "previewImage",
  "uploadImage",
  "downloadImage",
  "getNetworkType",
  "openLocation",
  "getLocation",
  "hideOptionMenu",
  "showOptionMenu",
  "closeWindow",
  "scanQRCode",
  "chooseWXPay",
  "openProductSpecificView",
  "addCard",
  "chooseCard",
  "openCard",
  "getLocalImgData",
];

class WXService {
  config() {
    apiFwgx.getAccessJsSdkInfo({ collUrl: location.href.split("#")[0] }).then(({ data }) => {
      const res = data.data;
      if (!res) return;
      wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，企业微信的corpID
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: WX_API_LIST, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      });

      wx.error(function (err) {
        console.error("error:", err);
      });
    });
  }

  // 如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行
  ready(func) {
    wx.ready(func);
  }

  // 分享
  share(option) {
    const { type, title, desc, link, imgUrl } = option;
    wx.ready(() => {
      wx.invoke(
        type,
        {
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享封面
        },
        function (res) {
          if (res.err_msg == "shareWechatMessage:ok") {
          }
        },
      );
    });
  }
}

export default new WXService();
