<template>
  <div class="customer-page">
    <!-- <van-nav-bar :title="selfData.name + '的历史报告'" left-arrow :border="false">
      <template #left>
        <img src="images/back.png" @click="$router.back(-1)" />
      </template>
    </van-nav-bar> -->
    <div class="customer-main">
      <!-- 下拉选择 -->
      <div class="menu" id="select">
        <down-menu
          :isSingle="false"
          placeholder="报告类型"
          :options="assetsList"
          v-model="filterCondition.assets"
          @change="handleDownmenuChange"
        >
        </down-menu>
        <div class="readTime">
          <div class="menu-title" @click="timeSort">
            <span>阅读时长</span>
            <img :src="upOrDown ? 'images/timeDown.png' : 'images/timeUp.png'" alt="" />
          </div>
        </div>
        <down-menu
          :isSingle="false"
          placeholder="推送状态"
          :options="attentionList"
          v-model="filterCondition.attention"
          @change="handleDownmenuChange"
        >
        </down-menu>
      </div>
      <!-- 客户列表 -->
      <van-list
        id="custList"
        v-if="customerList.length > 0"
        class="history-list"
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="customer-name" v-for="(item, index) in customerList" :key="index">
          <div class="card-center" :style="index == customerList.length - 1 ? 'border:none;' : ''">
            <div class="name" @click="toPreview(item)">
              <span v-if="item.rptType == '101'">《个人账户诊断报告》</span>
              <span v-if="item.rptType == '102'">《资产配置建议书》</span>
              <span class="time">{{ item.createTime }}</span>
            </div>
            <div class="customer-info">
              <div class="infoDetail">
                <div class="details">
                  <span v-if="item.pushStatus == '1'">已推送</span>
                  <span v-if="item.pushStatus == '0'">未推送</span>
                  <span class="time" v-if="item.eventDuration == 'null'">阅读0s</span>
                  <span class="time" v-else>阅读 {{ item.eventDuration }}s</span>
                  <!-- <span> 转发 0次</span> -->
                </div>
                <div class="push" @click="pushReport(item)">推送</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <div v-else>
        <div class="noneImg">
          <img src="images/noneData.png" alt="" />
        </div>
        <div class="noneTipText">暂无历史报告</div>
      </div>
      <!-- 推送分享 -->
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import wxService from "service/weixin";
import DownMenu from "ui/downMenu.vue";
export default {
  components: { DownMenu },
  data() {
    return {
      //埋点数据
      second_module: "", //二级模块
      third_module: "", //三级模块
      content_title: "", //客户报告标题
      content_type: "", // 报告类型
      content_id: "", // 员工id
      content_id2: "", // 客户号
      content_title2: "", // 客户报告id
      content_type2: "", // 手机号
      content_id3: "", //客户姓名
      content_title3: "", // 部门号
      shareContent: {},
      custData: {}, //存储个人信息
      marsk: false, //推送弹框遮罩层
      pushdialog: false, //推送图标
      JSdata: "", //获取授权信息
      showtitle: false, //标题显示与隐藏
      showWarp: false, //预览内容显示与隐藏
      timer: null, // 定时器名称
      loading: false, //下载中
      clickload: true, //下载报告
      pageNum: 1,
      pageSize: 10,
      upOrDown: true,
      selfData: {},
      filterCondition: {
        assets: [""],
        customer: [""],
        attention: [""],
        risk: [""],
      },
      filterConditionCopy: {
        customer: [""],
      },
      assetsList: [
        { name: "不限", value: "" },
        { name: "账户诊断报告", value: 1 },
        { name: "资产配置建议书", value: 2 },
      ],
      attentionList: [
        { name: "不限", value: "" },
        { name: "已推送", value: 1 },
        { name: "未推送", value: 2 },
      ],
      loading: false,
      finished: false,
      dataList: [],
      customerList: [],
      showFilter: false,
    };
  },
  computed: {
    ...mapGetters(["authorization"]),
    // id() {
    //   return this.$route.query.id;
    // },
    // custNo() {
    //   return this.$route.query.custNo;
    // },
    // brhNo() {
    //   return this.$route.query.brhNo;
    // },
    assetsTitle() {
      return this.filterCondition.assets.includes("")
        ? "报告类型"
        : this.assetsList
            .filter((item) => this.filterCondition.assets.includes(item.value))
            .map((item) => item.name)
            .join(",");
    },
    attentionTitle() {
      return this.filterCondition.attention.includes("")
        ? "推送状态"
        : this.attentionList
            .filter((item) => this.filterCondition.attention.includes(item.value))
            .map((item) => item.name)
            .join(",");
    },
  },
  created() {
    // 埋点
    this.sensors.registerPage({
      // 设置埋点的公共属性
      app_name: "智能资配平台V1.0",
      platform_type: "企微H5",
      channel: "企微",
    });
    this.sensors.quick("autoTrack");
  },
  mounted() {
    this.selfData = this.$router.history.current.query;
    this.onLoad();
    window.addEventListener("scroll", this.handleScroll);
    document.getElementById("HeadTitle").innerText = this.$route.query.name + "的历史报告";
  },
  methods: {
    handleScroll() {
      //为了保证兼容性，这里取两个值，哪个有值取哪一个
      //scrollTop就是触发滚轮事件时滚轮的高度
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 0) {
        document.getElementById("select").style = "position: fixed;top: 0;left: 0;right: 0;";
        document.getElementById("custList").style = "padding-top:1.9rem;";
      } else {
        document.getElementById("select").style = "";
        document.getElementById("custList").style = "";
      }
    },
    handleDownmenuChange() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.onLoad();
    },
    timeSort() {
      //阅读时长排序
      this.upOrDown = !this.upOrDown;
      if (this.upOrDown) {
        //升序
        this.pageNum = 1;
        this.pageSize = 10;
        this.onLoad();
      } else {
        //降序
        this.pageNum = 1;
        this.pageSize = 10;
        this.onLoad();
      }
    },
    onLoad() {
      //加载更多
      this.loading = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      console.log(
        "this.filterCondition++:",
        this.filterCondition,
        this.filterCondition.attention[0],
      );
      this.$apiFwgx
        .getSingleHistoryList({
          custNo: this.selfData.id, //客户id
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          rptType:
            this.filterCondition.assets.length == 2
              ? ""
              : this.filterCondition.assets.length == 1 && this.filterCondition.assets[0] == ""
              ? ""
              : this.filterCondition.assets.length == 1 && this.filterCondition.assets[0] == 1
              ? "101"
              : this.filterCondition.assets.length == 1 && this.filterCondition.assets[0] == 2
              ? "201"
              : "",
          orderType: this.upOrDown ? "2" : "1",
          pushStatus:
            this.filterCondition.attention.length == 1 ? this.filterCondition.attention[0] : "",
          // this.filterCondition.attention.length == 2
          // ? ""
          // : this.filterCondition.attention.length == 1 &&
          //   this.filterCondition.attention[0] == ""
          // ? ""
          // : this.filterCondition.attention.length == 1 && this.filterCondition.attention[0] == 1
          // ? "2"
          // : this.filterCondition.attention.length == 1 && this.filterCondition.attention[0] == 2
          // ? "1"
          // : "",
          // pushStatus:
          //   this.filterCondition.attention.length == 1 ? this.filterCondition.attention[0] : "", //推送状态
          // readingTimeOrderType: "", //阅读时长排序类型
          // rptType: this.filterCondition.assets.length == 1 ? this.filterCondition.assets[0] : "", //报告类型
        })
        .then((res) => {
          console.log("res+", res);
          if (res.data.data) {
            if (this.pageNum == 1) {
              this.customerList = [...res.data.data.rows];
              console.log("  this.customerList", this.customerList);
            } else {
              this.customerList = [...this.customerList, ...res.data.data.rows];
            }
            this.pageNum += 1;
            if (res.data.data.rows.length < this.pageSize) {
              this.finished = true;
            }
          }
        })
        .finally(() => {
          this.loading = false;
          this.$toast.clear();
        });
    },
    toPreview(item) {
      console.log("item", item);
      this.$apiFwgx
        .Previewreport({
          custNo: item.custNo,
          reportCode: item.rptId,
        })
        .then(({ data }) => {
          this.url = data.data.filePath;
          localStorage.setItem("filePath", this.url);
          this.$light.navigate(
            `root/createPDFreport/reportPreview?id=${item.rptId}&custNo=${item.custNo}`,
          );
        });
    },
    //点击推送弹框
    pushReport(data) {
      console.log("www:", data);
      this.custData = data;
      this.showtitle = false;
      this.showWarp = false;
      this.marsk = true;
      this.pushdialog = true;
      this.content_id = data.oaUserId; // 员工id
      this.content_id2 = data.custNo; // 客户号
      this.content_title2 = data.rptId; // 客户报告id
      this.content_type2 = data.custTel; // 手机号
      this.content_id3 = data.custNm; //客户姓名
      this.content_title3 = data.brhNo; // 部门号
      this.second_module = "历史报告";
      this.content_type = data.rptType;

      if (data.rptType == "101") {
        this.third_module = "账户诊断报告";
        this.content_title = "账户诊断报告书";
      } else {
        this.third_module = "资产配置建议书";
        this.content_title = "资产配置建议书";
      }
      this.shareContent = {
        title:
          data.rptType == "101"
            ? "请查收您的专属《个人账户诊断报告》"
            : "请查收您的专属《资配配置建议书》", // 分享标题
        desc:
          data.rptType == "101"
            ? "为您提供专业账户分析、账户诊断及投资建议"
            : "为您提供专业市场分析、产品推荐和投资建议", // 分享描述
        link: `https://light-dev.ghzq.com.cn/light/h5/1oozewpjo/index.html#/login?reportCode=${
          data.rptId
        }&fileType=${data.rptType === "101" ? "101" : "201"}&custNm=${data.custNm}&brhNo=${
          data.brhNo
        }&custTel=${data.custTel}&staffId=${data.oaUserId}`, // 分享链接
        imgUrl:
          data.rptType == "101"
            ? "http://ghzqres.oss-cn-shenzhen.aliyuncs.com/pdf/iaa/images/two/share1.png"
            : "http://ghzqres.oss-cn-shenzhen.aliyuncs.com/pdf/iaa/images/two/share2.png", // 分享封面
      };
    },
    //点击取消按钮
    shareClose() {
      this.showtitle = true;
      this.showWarp = true;
      this.marsk = false;
      this.pushdialog = false;
    },
    //推送到微信
    shareToWeiXin() {
      // 分享到微信埋点
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: this.second_module, //二级模块
        third_module: this.third_module, //三级模块
        page_name: "用户历史报告列表", //页面名称
        button_area: "底部", //按钮区域
        button_name: "推送", //按钮名称
        content_id: this.content_id, // 员工id
        content_id2: this.content_id2, // 客户号
        content_title: this.content_title, //客户报告标题
        content_title2: this.content_title2, // 客户报告id
        content_type: this.content_type, // 报告类型
        content_type2: this.content_type2, // 手机号
        content_id3: this.content_id3, //客户姓名
        content_title3: this.content_title3, // 部门号
        content: "", // 流水号
      });
      wxService.share({
        type: "shareWechatMessage",
        ...this.shareContent,
      });
    },
    //点击推送到企业微信
    shareToJSWei() {
      // 分享到企微埋点
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: this.second_module, //二级模块
        third_module: this.third_module, //三级模块
        page_name: "用户历史报告列表", //页面名称
        button_area: "底部", //按钮区域
        button_name: "推送", //按钮名称
        content_id: this.content_id, // 员工id
        content_id2: this.content_id2, // 客户号
        content_title: this.content_title, //客户报告标题
        content_title2: this.content_title2, // 客户报告id
        content_type: this.content_type, // 报告类型
        content_type2: this.content_type2, // 手机号
        content_id3: this.content_id3, //客户姓名
        content_title3: this.content_title3, // 部门号
        content: "", // 流水号
      });
      wxService.share({
        type: "shareAppMessage",
        ...this.shareContent,
      });
    },
    //下载报告
    async loadreport() {
      // 下载报告按钮埋点
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: this.second_module, //二级模块
        third_module: this.third_module, //三级模块
        page_name: "用户历史报告列表", //页面名称
        button_area: "底部", //按钮区域
        button_name: "下载", //按钮名称
        content_id: this.content_id, // 员工id
        content_id2: this.content_id2, // 客户号
        content_title: this.content_title, //客户报告标题
        content_title2: this.content_title2, // 客户报告id
        content_type: this.content_type, // 报告类型
        content_type2: this.content_type2, // 手机号
        content_id3: this.content_id3, //客户姓名
        content_title3: this.content_title3, // 部门号
        content: "", // 流水号
      });

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
          custNo: this.content_id2,
          fileType: this.content_type === "101" ? "100" : "200",
          reportCode: this.content_title2,
        })
        .then(({ data }) => {
          const path = data.data.filePath;
          return path;
        });
    },
    // 创建报告pdf(h5)
    handlePdfCreate() {
      return this.$apiFwgx
        .creatreport({
          custNo: this.content_id2,
          reportCode: this.content_title2,
          fileType: this.content_type === "101" ? "101" : "201",
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
          custNo: this.content_id2,
          fileType: this.content_type === "101" ? "100" : "200",
          reportCode: this.content_title2,
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
        `/get/file/stream?custNo=${this.content_id2}&fileType=${
          this.content_type === "101" ? "100" : "200"
        }&reportCode=${this.content_title2}&Authorization=${this.authorization}`; // 拼接下载地址
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
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="less" scoped>
// /deep/ .van-nav-bar {
//   img {
//     width: 0.4rem;
//   }
// }
.customer-page {
  background: #f2f3f5;
  min-height: 100vh;
  .customer-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    .search-box {
      width: 7.5rem;
      background: #ffffff;
      display: flex;
      justify-content: center;
    }
    .search {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 6.91rem;
      height: 0.6rem;
      margin: 0.14rem 0;
      background: #f2f3f5;
      border-radius: 0.12rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.4rem;
      font-size: 0.28rem;
      .text {
        margin-left: 0.2rem;
      }
      img {
        width: 0.25rem;
      }
    }
    .menu {
      width: 100%;
      align-self: stretch;
      display: flex;
      justify-content: center;
      padding: 0.15rem 0 0.2rem 0;
      background: #ffffff;
      border-bottom: 0.01rem solid #ebebeb;
      z-index: 2;
      > div {
        height: 0.54rem;
        margin-right: 0.2rem;
        &:nth-child(1) {
          width: 1.9rem;
        }
        &:nth-child(2) {
          width: 1.65rem;
        }
        &:nth-child(3) {
          width: 1.65rem;
          margin-right: 0;
        }
      }
      .readTime {
        position: relative;
        background: #f2f3f5;
        font-size: 0.26rem;
        font-weight: 400;
        color: #666666;
        .menu-title {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.04rem;
          span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          &.active {
            background: rgba(0, 123, 246, 0.03);
            border: 1px solid rgba(0, 123, 246, 0.7);
          }
          img {
            width: 0.14rem;
            margin-left: 0.1rem;
          }
        }
      }
      .assets,
      .customer,
      .attention {
        display: flex;
        flex-wrap: wrap;
        font-size: 0.28rem;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 0.4rem;
        .item {
          display: flex;
          align-items: center;
          width: 50%;
          img {
            width: 0.18rem;
            margin-left: 0.1rem;
          }
        }
      }
      .assets,
      .customer {
        .item:nth-child(n + 5) {
          margin-bottom: 0;
        }
      }
      .attention {
        .item:nth-child(n + 3) {
          margin-bottom: 0;
        }
      }
    }
    .history-list {
      background: #f2f3f5;
    }

    .customer-name {
      width: 7.5rem;
      background: #ffffff;
      padding: 0 0.3rem;
      box-sizing: border-box;
      .card-center {
        padding: 0.27rem 0 0.3rem 0;
        border-bottom: 1px solid #ebebeb;
      }
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.32rem;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 0.45rem;
        .time {
          font-size: 0.24rem;
          font-weight: 400;
          text-align: right;
          color: #999999;
          line-height: 0.36rem;
        }
      }
      img {
        height: 0.34rem;
      }
    }
    .customer-info {
      font-size: 0.28rem;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 0.4rem;
      .infoDetail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.18rem;
        height: 0.4rem;
        .details {
          font-size: 0.28rem;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 0.4rem;
          .time {
            &::after {
              content: "";
              display: inline-block;
              width: 1px;
              height: 0.2rem;
              margin: 0 0.15rem;
              background: #d8d8d8;
            }
            &::before {
              content: "";
              display: inline-block;
              width: 1px;
              height: 0.2rem;
              margin: 0 0.15rem;
              background: #d8d8d8;
            }
          }
        }
        .push {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.2rem;
          height: 0.56rem;
          opacity: 0.7;
          // border: 0.01rem solid #007bf6;
          // border-radius: 0.29rem;
          margin-bottom: 0.16rem;
          padding: 0.01rem;
          font-size: 0.28rem;
          font-weight: 400;
          text-align: center;
          color: #007bf6;
          line-height: 0.4rem;
          position: relative;
          &::after {
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            transform: scale(0.5);
            transform-origin: left top;
            box-sizing: border-box;
            border: 0.02rem solid #007bf6;
            border-radius: 0.58rem;
          }
        }
        // .van-button {
        //   width: 1.2rem;
        //   height: 0.56rem;
        //   opacity: 0.7;
        //   border: 0.01rem solid #007bf6;
        //   border-radius: 0.29rem;
        //   margin-bottom: 0.16rem;
        //   padding: 0.01rem;
        // }
        // .van-button__text {
        //   font-size: 0.28rem;
        //   font-weight: 400;
        //   text-align: center;
        //   color: #007bf6;
        //   line-height: 0.4rem;
        // }
      }
    }
    .account {
      font-size: 0.32rem;
      font-weight: 400;
      text-align: center;
      color: #383838;
      line-height: 0.38rem;
    }
    .noneImg {
      display: flex;
      width: 4.4rem;
      height: 2.8rem;
      margin-top: 3.86rem;
      img {
        width: 4.4rem;
        height: 2.8rem;
      }
    }
    .noneTipText {
      font-size: 0.28rem;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #999999;
      line-height: 0.4rem;
    }
  }
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
  z-index: 10;
  // position: relative;
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
}

.img {
  width: 1rem;
  height: 1rem;
  display: block;
  margin-left: 0.06rem;
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
</style>
