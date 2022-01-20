<template>
  <div class="warp">
    <!-- 等待报告创建中弹框 -->
    <div class="preview-warp" v-if="creatdialog">
      <div class="precession">
        <van-progress
          :percentage="percentage"
          pivot-color="none"
          text-color="#7cb8f1"
          track-color="#F2F8FE"
          color="linear-gradient(to right,#7cb8f1, #44a2ff 85%)"
        />
        <div class="percentage">报告生成中…</div>
      </div>
    </div>

    <!-- 报告预览部分 -->
    <div class="preview-html" v-show="showWarp" style="height: calc(100vh - 1.1rem)">
      <iframe id="iframe" style="width: 100%; height: 100%; border: none" :src="this.url"></iframe>
    </div>

    <!-- 底部按钮 -->
    <div class="preview-footer">
      <!-- <van-button loading-text="下载中..." loading v-show="loading"></van-button> -->
      <div class="load" v-show="loading">下载中...</div>
      <div class="load" @click="loadreport" v-show="clickload">下载报告</div>
      <div class="push" @click="clickPush" v-show="false">推送</div>
    </div>
    <!-- 推送弹框 -->
    <div class="app-dialog" v-show="marsk"></div>
    <div class="dialog" v-show="pushdialog">
      <div class="share-icon">
        <div class="iocn" @click="shareToWeiXin">
          <img src="images/wei.png" alt="" class="img" /><span>微信好友</span>
        </div>
        <div class="iocn" @click="shareToJSWei">
          <img src="images/qiwei.png" alt="" class="img" /><span>企业微信</span>
        </div>
        <div class="iocn" @click="loadreport">
          <img src="images/loading.png" alt="" class="img" /><span>下载报告</span>
        </div>
      </div>
      <div class="close" @click="shareClose">取消</div>
      <a href="#" id="bbb" download="#" style="display: none">隐藏标签</a>
    </div>
  </div>
</template>
<script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

<script>
export default {
  data() {
    return {
      marsk: false, //推送弹框遮罩层
      pushdialog: false, //推送图标
      showtitle: false, //标题显示与隐藏
      showWarp: false, //预览内容显示与隐藏
      creatdialog: true, //等待弹框
      percentage: 30,
      code: "",
      url: "", //返回的预览html报告地址
      fileurl: "",
      flag: true,
      timer: null, // 定时器名称
      loading: false, //下载中
      clickload: true, //下载报告
      JSdata: "", //企业微信获取授权信息
      Weidata: "", //微信获取授权信息
      interval: null,
    };
  },
  created() {
    // 一期埋点不做 先注释
    // window.sensors.registerPage({
    //   // 设置埋点的公共属性
    //   app_name: "国海工作室",
    //   platform_type: "H5",
    //   channel: "微信",
    // });
    // window.sensors.quick("autoTrack");
  },
  mounted() {
    // document.getElementById("iframe").contentWindow.location.reload(true);
    this.setprecentage();
  },
  methods: {
    //进度条
    setprecentage() {
      var timer = setInterval(() => {
        this.percentage += 10;
        if (this.percentage > 100) {
          clearInterval(timer);
          let filePath = localStorage.getItem("filePath");
          let authorization = sessionStorage.getItem("authorization");
          this.url =
            APIconfig.requestReportUrl +
            `/oss/${filePath}?Authorization=${authorization}&reportCode=${this.$route.query.id}`;
          this.creatdialog = false;
          this.showWarp = true;
          this.showtitle = true;
        }
      }, 300);
    },
    //推送到微信
    getWeisdkInfo() {
      var that = this;
      this.$apiFwgx.getAccessJsSdkInfo({ collUrl: location.href.split("#")[0] }).then((data) => {
        this.JSdata = data.data.data;
        if (this.JSdata) {
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this.JSdata.appId, // 必填，企业微信的corpID
            timestamp: this.JSdata.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.JSdata.nonceStr, // 必填，生成签名的随机串
            signature: this.JSdata.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: [
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
            ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          });

          wx.ready(function () {
            wx.invoke(
              "shareWechatMessage",
              {
                title: "请查收您的专属《个人账户诊断报告》", // 分享标题
                desc: "为您提供专业账户分析、账户诊断及投资建议", // 分享描述
                link: `https://light-dev.ghzq.com.cn/light/h5/1oozewpjo/index.html#/login?reportCode=${that.$route.query.id}`, // 分享链接
                imgUrl: "images/share1.png", // 分享封面
              },
              function (res) {
                if (res.err_msg == "shareWechatMessage:ok") {
                }
              },
            );
          });
          wx.error(function (res) {});
        }
      });
    },

    // 推送获取企微授权信息
    getJssdkInfo() {
      var that = this;
      this.$apiFwgx.getAccessJsSdkInfo({ collUrl: location.href.split("#")[0] }).then((data) => {
        this.JSdata = data.data.data;
        if (this.JSdata) {
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this.JSdata.appId, // 必填，企业微信的corpID
            timestamp: this.JSdata.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.JSdata.nonceStr, // 必填，生成签名的随机串
            signature: this.JSdata.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: [
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
            ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          });
          wx.ready(function () {
            wx.invoke(
              "shareAppMessage",
              {
                title: "请查收您的专属《个人账户诊断报告》", // 分享标题
                desc: "为您提供专业账户分析、账户诊断及投资建议", // 分享描述
                link: `https://light-dev.ghzq.com.cn/light/h5/1oozewpjo/index.html#/login?reportCode=${that.$route.query.id}`, // 分享链接
                imgUrl: "images/share1.png", // 分享封面
              },
              function (res) {
                if (res.err_msg == "shareAppMessage:ok") {
                }
              },
            );
          });
          wx.error(function (res) {});
        }
      });
    },
    // 点击推送按钮
    clickPush() {
      // 下载报告按钮埋点// 一期埋点不做 先注释
      // window.sensors.track("PageClick", {
      //   first_module: "报告详情页",
      //   second_module: "微信端",
      //   third_module: "",
      //   page_name: "",
      //   button_area: "底部",
      //   button_name: "下载报告",
      //   content_id: data.data.brhNo, // 员工id
      //   content_id2: data.data.brhNo, // 客户号
      //   content_title: data.data.reportType, // 客户报告类型
      //   content_title2: data.data.reportDate, // 客户生成时间
      // });
      this.showWarp = true;
      this.marsk = true;
      this.pushdialog = true;
    },
    //点击取消按钮
    shareClose() {
      this.marsk = false;
      this.pushdialog = false;
    },

    //下载报告 点击下载按钮，先去查询数据库有没有生成过pdf报告，有就直接返回给前端下载，没有就要先生成pdf-在下载
    loadreport() {
      this.clickload = false;
      this.loading = true;
      this.$apiFwgx
        .checkloadadrecss({
          custNo: this.$route.query.custNo,
          fileType: "100",
          reportCode: this.$route.query.id,
        })
        .then((data) => {
          if (data.data.data.filePath) {
            let url =
              APIconfig.requestUrl +
              `/get/file/stream?custNo=${this.$route.query.custNo}&fileType=100&reportCode=${
                this.$route.query.id
              }&Authorization=${sessionStorage.getItem("authorization")}`; // 拼接下载地址

            this.$apiFwgx
              .authority({
                custNo: this.$route.query.custNo,
                fileType: "100",
                reportCode: this.$route.query.id,
              })
              .then((data) => {
                if (data.data.success === false) {
                  var message = data.data.retMsg;
                  this.$toast({ message, duration: 2000 });
                } else {
                  var u = navigator.userAgent;
                  if (u.indexOf("iPhone") > -1) {
                    //  //是ios页面打开
                    var bb = document.getElementById("bbb");
                    bb.setAttribute("href", url + "&phoneType=ios");
                    bb.setAttribute("download", url + "&phoneType=ios");
                    window.location.href = url + "&phoneType=ios";
                    this.clickload = true;
                    this.loading = false;
                  } else {
                    // 是安卓打开
                    window.open(url);
                    this.clickload = true;
                    this.loading = false;
                    return;
                  }
                }
              });
          } else {
            this.$apiFwgx
              .creatreport({
                custNo: this.$route.query.custNo,
                reportCode: this.$route.query.id,
              })
              .then((data) => {
                if (data.data.data.success === true) {
                  this.timer = setInterval(() => {
                    this.$apiFwgx
                      .checkloadadrecss({
                        custNo: this.$route.query.custNo,
                        fileType: "100",
                        reportCode: this.$route.query.id,
                      })
                      .then((data) => {
                        if (data.data.data.filePath) {
                          clearInterval(this.timer);
                          this.timer = null;
                          this.flag == false; //false销毁定时器
                          let url =
                            APIconfig.requestUrl +
                            `/get/file/stream?custNo=${
                              this.$route.query.custNo
                            }&fileType=100&reportCode=${
                              this.$route.query.id
                            }&Authorization=${sessionStorage.getItem("authorization")}`; // 拼接下载地址
                          console.log(url);
                          debugger;
                          //下载前判断是否有权限
                          this.$apiFwgx
                            .authority({
                              custNo: this.$route.query.custNo,
                              fileType: "100",
                              reportCode: this.$route.query.id,
                            })
                            .then((data) => {
                              if (data.data.success === false) {
                                var message = data.data.retMsg;
                                this.$toast({ message, duration: 2000 });
                              } else {
                                var u = navigator.userAgent;
                                if (u.indexOf("iPhone") > -1) {
                                  //  //是ios页面打开
                                  var bb = document.getElementById("bbb");
                                  bb.setAttribute("href", url + "&phoneType=ios");
                                  bb.setAttribute("download", url + "&phoneType=ios");
                                  window.location.href = url + "&phoneType=ios";
                                  this.clickload = true;
                                  this.loading = false;
                                } else {
                                  // 是安卓打开
                                  window.open(url);
                                  this.clickload = true;
                                  this.loading = false;
                                  return;
                                }
                              }
                            });
                        }
                      });
                  }, 10000);
                }
              });
          }
        });
    },
    //推送到微信
    shareToWeiXin() {
      this.getWeisdkInfo();
    },
    //点击推送到企业微信
    shareToJSWei() {
      this.getJssdkInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.warp {
  margin: 0 auto;
  width: 7.5rem;
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.preview-warp {
  padding: 0 0.3rem;
  background: #ffffff;
}

.preview-html {
  background: #fafbfc;
  width: 6.9rem;
  padding: 0 0.3rem;
}
.preview-footer {
  width: 6.7rem;
  position: fixed;
  bottom: 0;
  left: 0;
  line-height: 1rem;
  height: 1.1rem;
  background: #ffffff;
  box-shadow: 0px -0.01rem 0px 0px #ebebeb;
  padding: 0.15rem 0.4rem 0.3rem 0.4rem;
  display: flex;
  justify-content: space-between;
  padding-bottom: env(safe-area-inset-bottom);
}
.load {
  // width: 3.25rem;
  width: 100%;
  height: 0.8rem;
  font-size: 0.32rem;
  text-align: center;
  color: #007bf6;
  font-weight: 500;
  line-height: 0.8rem;
  // border: 1px solid #007bf6;
  // border-radius: 0.46rem;
  position: relative;
  &:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: left top;
    box-sizing: border-box;
    border: 1px solid #007bf6;
    border-radius: 46px;
  }
}
/deep/ .van-button {
  width: 3.23rem;
  height: 0.78rem;
  text-align: center;
  line-height: 0.78rem;
  opacity: 0.7;
  border: none;
  border: 0.01rem solid #007bf6;
  border-radius: 0.46rem;
  float: left;
  color: #007bf6;

  margin-left: 0.2rem;
  .van-button__text {
    color: #007bf6;
    font-size: 0.32rem;
    font-weight: 500;
  }
}
.push {
  width: 3.25rem;
  height: 0.8rem;
  font-size: 0.32rem;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  line-height: 0.8rem;
  background: linear-gradient(90deg, #00aff6, #007bf6);
  border-radius: 0.46rem;
}
.app-dialog {
  width: 7.5rem;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.4;
  background: #000000;
  // background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  // position: relative;
  padding-bottom: env(safe-area-inset-bottom);
}
.dialog {
  position: absolute;
  background: #ebebeb;
  opacity: 1;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3.55rem;
  z-index: 111;
}
.share-icon {
  padding: 0.5rem 0;
  height: 1.55rem;
  background: #f4f5f7;
  border-bottom: 0.01rem solid #ebebeb;
  // box-shadow: 0px 0.01rem 0px 0px #ebebeb;
  border-radius: 0.2rem 0.2rem 0px 0px;
  display: flex;
  justify-content: space-around;
}

.img {
  width: 1rem;
  height: 1rem;
  display: block;
  margin-left: 0.06rem;
}
span {
  margin-top: 0.15rem;
  display: block;
  height: 0.4rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: center;
  color: #333333;
  line-height: 0.4rem;
}
.close {
  background: #f4f5f7;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.32rem;
  font-weight: 400;
  text-align: center;
  color: #333333;
}
//等待弹框得样式
.precession {
  position: absolute;
  left: 1.85rem;
  top: 5.61rem;
  width: 3.8rem;
  height: 1.51rem;
}
.process-line {
  height: 0.1rem;
  width: 100%;
}
.percentage {
  margin-top: 1rem;
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: center;
  color: #999999;
}
.van-progress {
  height: 0.1rem;
  border: 1px solid undefined;
  border-radius: 0.11rem;
}
.van-progress /deep/ .van-progress__pivot {
  font-size: 0.28rem !important;
  padding: 0 0.17rem !important;
  position: absolute;
  left: 1.45rem !important;
  top: 0.4rem !important;
  color: #007bf6 !important;
  font-weight: 700;
}
</style>
