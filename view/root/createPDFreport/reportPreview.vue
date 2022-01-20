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
      <div class="load" v-if="loading">下载中...</div>
      <div class="load" @click="loadReport" v-else>下载报告</div>
      <div class="push" @click="clickPush">推送</div>
    </div>
    <!-- 推送弹框 -->
    <div class="app-dialog" v-show="showPush"></div>
    <div class="dialog" v-show="showPush">
      <div class="share-icon">
        <div class="iocn" @click="shareToWeiXin">
          <img src="images/wei.png" alt="" class="img" /><span>微信好友</span>
        </div>
        <div class="iocn" @click="shareToWeiXinWork">
          <img src="images/qiwei.png" alt="" class="img" /><span>企业微信</span>
        </div>
        <div class="iocn" @click="loadReport">
          <img src="images/loading.png" alt="" class="img" /><span>下载报告</span>
        </div>
      </div>
      <div class="close" @click="shareClose">取消</div>
      <a href="#" id="bbb" download="#" style="display: none">隐藏标签</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import wxService from "service/weixin";

export default {
  data() {
    return {
      showPush: false, //推送弹框、遮罩层
      showWarp: false, //预览内容显示与隐藏
      creatdialog: true, //等待弹框
      percentage: 30,
      url: "", //预览html
      timer: null, // 定时器
      loading: false, //下载状态
      shareContent: {},
      second_module: "",
      third_module: "",
      page_name: "",
      content_title: "",
      content_type: "",
    };
  },
  computed: {
    ...mapGetters(["authorization"]),
    id() {
      return this.$route.query.id;
    },
    custNo() {
      return this.$route.query.custNo;
    },
    brhNo() {
      return this.$route.query.brhNo;
    },
    type() {
      return this.$route.query.type;
    },
    staffId() {
      return this.$route.query.staffId;
    },
    custTel() {
      return this.$route.query.custTel;
    },
    custNm() {
      return this.$route.query.custNm;
    },
  },
  created() {
    //判断埋点动态数据
    if (this.type == "101") {
      this.second_module = "账户诊断";
      this.third_module = "账户诊断";
      this.page_name = "账户诊断报告预览页";
      this.content_title = "账户诊断报告书";
      this.content_type = "101";
    } else {
      this.second_module = "资配建议书";
      this.third_module = "资配建议书";
      this.page_name = "资配建议书预览页";
      this.content_title = "资配配置建议书";
      this.content_type = "201";
    }
    // 埋点
    this.sensors.registerPage({
      // 设置埋点的公共属性
      app_name: "智能资配平台V1.0",
      platform_type: "企微H5",
      channel: "企微",
    });
    this.sensors.quick("autoTrack");

    this.shareContent = {
      title:
        this.type === "101"
          ? "请查收您的专属《个人账户诊断报告》"
          : "请查收您的专属《资配配置建议书》", // 分享标题
      desc:
        this.type === "101"
          ? "为您提供专业账户分析、账户诊断及投资建议"
          : "为您提供专业市场分析、产品推荐和投资建议", // 分享描述
      link: `https://light-dev.ghzq.com.cn/light/h5/1oozewpjo/index.html#/login?reportCode=${
        this.id
      }&fileType=${this.type === "101" ? "101" : "201"}&custNm=${this.custNm}&brhNo=${
        this.brhNo
      }&custTel=${this.custTel}&staffId=${this.staffId}`, // 分享链接
      imgUrl:
        this.type === "101"
          ? "http://ghzqres.oss-cn-shenzhen.aliyuncs.com/pdf/iaa/images/two/share1.png"
          : "http://ghzqres.oss-cn-shenzhen.aliyuncs.com/pdf/iaa/images/two/share2.png", // 分享封面
    };
  },
  mounted() {
    this.setprecentage();
    document.getElementById("HeadTitle").innerText =
      this.type === "200" ? "资产配置建议书" : "账户诊断报告";
  },
  methods: {
    //进度条
    setprecentage() {
      const timer = setInterval(() => {
        this.percentage += 10;
        if (this.percentage > 100) {
          clearInterval(timer);
          let filePath = localStorage.getItem("filePath");
          this.url =
            window.APIconfig.requestReportUrl +
            `/oss/${filePath}?Authorization=${this.authorization}&reportCode=${this.id}`;
          this.creatdialog = false;
          this.showWarp = true;
        }
      }, 300);
    },
    //推送到微信
    shareToWeiXin() {
      // 分享到微信埋点
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: this.second_module, //二级模块
        third_module: this.third_module, //三级模块
        page_name: this.page_name, //页面名称
        button_area: "底部", //按钮区域
        button_name: "推送", //按钮名称
        content_id: this.staffId, // 员工id
        content_id2: this.custNo, // 客户号
        content_title: this.content_title, //客户报告标题
        content_title2: this.id, // 客户报告id
        content_type: this.content_type, // 报告类型
        content_type2: this.custTel, // 手机号
        content_id3: this.custNm, //客户姓名
        content_title3: this.brhNo, // 部门号
        content: "", // 流水号
      });

      wxService.share({
        type: "shareWechatMessage",
        ...this.shareContent,
      });
    },

    // 推送到企微会话
    shareToWeiXinWork() {
      // 分享到企微埋点
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: this.second_module, //二级模块
        third_module: this.third_module, //三级模块
        page_name: this.page_name, //页面名称
        button_area: "底部", //按钮区域
        button_name: "推送", //按钮名称
        content_id: this.staffId, // 员工id
        content_id2: this.custNo, // 客户号
        content_title: this.content_title, //客户报告标题
        content_title2: this.id, // 客户报告id
        content_type: this.content_type, // 报告类型
        content_type2: this.custTel, // 手机号
        content_id3: this.custNm, //客户姓名
        content_title3: this.brhNo, // 部门号
        content: "", // 流水号
      });

      wxService.share({
        type: "shareAppMessage",
        ...this.shareContent,
      });
    },
    // 点击推送按钮
    clickPush() {
      this.showPush = true;
    },
    //点击取消按钮
    shareClose() {
      this.showPush = false;
    },
    // 下载报告
    async loadReport() {
      // 下载报告按钮埋点
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: this.second_module, //二级模块
        third_module: this.third_module, //三级模块
        page_name: this.page_name, //页面名称
        button_area: "底部", //按钮区域
        button_name: "下载报告", //按钮名称
        content_id: this.staffId, // 员工id
        content_id2: this.custNo, // 客户号
        content_title: this.content_title, //客户报告标题
        content_title2: this.id, // 客户报告id
        content_type: this.content_type, // 报告类型
        content_type2: this.custTel, // 手机号
        content_id3: this.custNm, //客户姓名
        content_title3: this.brhNo, // 部门号
        content: "", // 流水号
      });

      this.loading = true;
      const pdfExist = await this.handlePdfCheck();
      if (pdfExist) {
        const allowed = await this.handleAuthority();
        if (!allowed) return;
        this.handleDownload();
      } else {
        const isCreated = await this.handlePdfCreate();
        if (!isCreated) return;
        this.timer = setInterval(() => {
          this.handleReportDownload();
        }, 10000);
      }
    },
    // 轮询
    async handleReportDownload() {
      const pdfExist = await this.handlePdfCheck();
      if (pdfExist) {
        clearInterval(this.timer);
        const allowed = await this.handleAuthority();
        if (!allowed) return;
        this.handleDownload();
      }
    },
    // 检查是否已经生成过pdf
    handlePdfCheck() {
      return this.$apiFwgx
        .checkloadadrecss({
          custNo: this.custNo,
          fileType: this.type === "200" ? "200" : "100",
          reportCode: this.id,
        })
        .then(({ data }) => {
          const path = data.data.filePath;
          return path;
        });
    },
    // 创建报告pdf
    handlePdfCreate() {
      return this.$apiFwgx
        .creatreport({
          custNo: this.custNo,
          reportCode: this.id,
          fileType: this.type === "200" ? "201" : "101",
        })
        .then(({ data }) => {
          const result = data.data.success;
          return result;
        });
    },
    // 身份校验
    handleAuthority() {
      return this.$apiFwgx
        .authority({
          custNo: this.custNo,
          fileType: this.type === "200" ? "200" : "100",
          reportCode: this.id,
        })
        .then(({ data }) => {
          const result = data.success;
          if (!result) {
            this.$toast({ message: data.retMsg, duration: 2000 });
            return;
          }
          return result;
        });
    },
    // 下载
    handleDownload() {
      const url =
        window.APIconfig.requestUrl +
        `/get/file/stream?custNo=${this.custNo}&fileType=${
          this.type === "200" ? "200" : "100"
        }&reportCode=${this.id}&Authorization=${this.authorization}`; // 拼接下载地址
      const u = navigator.userAgent;
      if (u.indexOf("iPhone") > -1) {
        //  //是ios页面打开
        var bb = document.getElementById("bbb");
        bb.setAttribute("href", url + "&phoneType=ios");
        bb.setAttribute("download", url + "&phoneType=ios");
        console.log(url + "&phoneType=ios");
        window.location.href = url + "&phoneType=ios";
      } else {
        // 是安卓打开
        window.open(url);
      }
      this.loading = false;
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
  width: 3.25rem;
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
