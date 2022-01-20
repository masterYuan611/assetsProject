<template>
  <div class="customerDetail">
    <div class="header">
      <div class="headerInfo">
        <div class="userInfo">
          <div class="avator">
            <van-image round width="1.2rem" height="1.2rem" :src="portrait" />
          </div>
          <div class="customer">
            <div class="user">
              <span class="name">{{ userInfo.custNm.slice(0, 9) }}</span>
              <span
                v-if="userInfo.custNm.length > 9"
                style="font-size: 0.36rem; line-height: 0.4rem"
              >
                {{ userInfo.custNm.slice(9) }}
              </span>
              <div class="risk">{{ userInfo.riskLvl2 || "-" }}</div>
              <div class="level">{{ userInfo.custLvl }}</div>
            </div>
            <div class="userline2">
              <span>{{ userInfo.custGndr }}</span>
              <div class="age">{{ userInfo.custAge }}岁</div>
              <span v-if="userInfo.custTel" class="phone">{{ userInfo.custTel }}</span>
            </div>
          </div>
          <div
            style="margin-left: auto"
            @click="updateFollow"
            :class="userInfo.followFlag === 0 ? 'interest' : 'isinterest'"
          ></div>
        </div>
        <div class="report" @click="reportDetail" v-if="diagnosisNum || assestAdvise">
          <span class="diagnosis" v-if="diagnosisNum">账户诊断报告：{{ diagnosisNum }}份</span>
          <span v-if="assestAdvise">资产配置建议书：{{ assestAdvise }}份</span>
          <van-icon name="arrow" size="0.24rem" color="#fff" />
        </div>
        <img class="overalltipimg" @click="overalltip" src="images/overall.png" />
        <div class="overall">
          <div class="fivedimensionalgraph" id="fivedimensionalgraph"></div>
          <div class="updateTime">
            <span>- 报告数据更新于：{{ graph.updateDate }} -</span>
          </div>
        </div>
      </div>
    </div>
    <van-sticky>
      <van-tabs
        v-model="active"
        color="#007bf6"
        title-active-color="#007BF6"
        @click="changeTab('baseMessage')"
      >
        <van-tab v-for="item in tabList" :key="item.name" :name="item.name" :title="item.title">
        </van-tab>
      </van-tabs>
    </van-sticky>
    <sub-view></sub-view>
    <div class="footbutton">
      <div @click.stop="footBut('createPDF')" class="marright20">生成PDF报告</div>
      <div @click.stop="footBut()" class="footbuttonactive">获取配置建议</div>
    </div>
    <!-- 注释：账户诊断 -->
    <FiveDimensionTip ref="fiveDimensionTip" />
    <!-- 风险等级为空提示 -->
    <van-dialog
      class="riskTip"
      v-model="showTip"
      confirmButtonText="知道了"
      confirm-button-color="#007BF6"
    >
      <div>
        <p class="tip">“客户未做风险测评或已过期，无法提供AI配置建议”</p>
      </div>
    </van-dialog>
    <!-- 客户四要素检查 -->
    <Dialog ref="myDialog"></Dialog>
    <!--收益评估、风险评估提示框-->
    <Appraise ref="appraise" />
  </div>
</template>

<script>
const TABLIST = [
  { title: "基本信息", name: "baseMessage" },
  { title: "资产分析", name: "assetAnalysis" },
  { title: "交易分析", name: "transactionAnalysis" },
  { title: "诊断结论", name: "conclusion" },
];
import Dialog from "../../ui/dialog.vue";
import FiveDimensionTip from "../../ui/fiveDimensionTip.vue";
import Appraise from "../../ui/appraise.vue";
export default {
  components: { Dialog, FiveDimensionTip, Appraise },
  data() {
    return {
      userInfo: {
        custNm: "", // 客户名称
        riskLvl2: "", // 风险承受能力
        custLvl: "", // 客户级别
        custGndr: "", // 性别
        custAge: "", // 年龄
        custTel: "", // 手机号码
        followFlag: 0, // 关注状态，0未关注，1已关注
      },
      graph: {
        averageScore: 0, // 总评分
        holdScore: 0, // 持仓评分
        maxDrawdownScore: 0, // 风险控制
        prftBalScore: 0, // 收益能力
        sucsRateScore: 0, // 交易胜率
        userTimingScore: 0, // 择时能力
        updateDate: "", // 数据更新日期
      },
      diagnosisNum: 0, // 账户诊断报告数
      assestAdvise: 0, // 资产配置建议书
      active: "baseMessage",
      footButActive: "getAdvise",
      tabList: TABLIST,
      custNm: "", // 客户名称
      url: "", //h5报告地址
      showTip: false, // 风险等级为空提示
      checkInfos: [],
      adviseisFlag: false, // 获取配置建议请求中
    };
  },
  created() {
    this.$EventBus.$on("appraise", (target) => {
      this.$refs.appraise.show(target);
    });
    this.getUserInfo();
    this.dimensionalGraph();
    // 公共埋点注册
    this.sensors.registerPage({
      // 设置埋点的公共属性
      app_name: "智能资配平台V1.0",
      platform_type: "企微H5",
      channel: "企微",
    });
    this.sensors.quick("autoTrack");
  },
  mounted() {
    this.changeTab();
  },
  computed: {
    custNo() {
      // if (this.$route.query.source == "home") {
      //   return this.$route.query.custNo;
      // } else {
      return sessionStorage.getItem("custNo");
      // }
    },
    portrait() {
      return this.userInfo.custGndr === "男" ? "images/male.png" : "images/female.png";
    },
  },
  methods: {
    reportDetail() {
      this.$light.navigate(
        `root/historyReport/custonHistoryReport?id=${this.custNo}&name=${this.userInfo.custNm}`,
      );
    },
    dimensionalGraph() {
      this.$apiFwgx
        .dimensionalGraph({
          custNo: this.custNo,
        })
        .then(({ data }) => {
          const res = data.data;
          if (res) {
            Object.keys(this.graph).forEach((key) => {
              this.graph[key] = res[key];
            });
            this.drawFiveGraph();
          }
        });
    },
    updateFollow() {
      this.$toast.loading();
      this.$apiFwgx
        .updateFollow({
          custNo: this.custNo,
          followFlag: this.userInfo.followFlag === 0 ? 1 : 0,
        })
        .then(({ data }) => {
          if (data) {
            this.getUserInfo();
            this.$toast.clear();
          }
        });
    },
    getUserInfo() {
      const param = { custNo: this.custNo };
      this.$apiFwgx.getUserDetail(param).then(({ data }) => {
        const res = data.data;
        if (res) {
          Object.keys(this.userInfo).forEach((key) => {
            this.userInfo[key] = res[key];
          });
          if (res.reportStatisticsList && res.reportStatisticsList.length > 0) {
            res.reportStatisticsList.forEach((item) => {
              if (item.reportType === "101") {
                this.diagnosisNum = item.reportNum;
              }
              if (item.reportType === "201") {
                this.assestAdvise = item.reportNum;
              }
            });
          }
        }
      });
    },
    footBut(but) {
      if (but === "createPDF") {
        let code = "";
        this.$apiFwgx
          .getCode({
            custNo: this.custNo,
            reportMode: "1", //生成方式，1代表员工通过智能资配平台主动为客户生成，2代表客户在前端主动生成
            reportType: "1", //报告模板，1为《个人账户诊断报告》2为《资产配置建议书》
          })
          .then(({ data }) => {
            code = data.data;
            this.$apiFwgx
              .Previewreport({
                custNo: this.custNo,
                reportCode: code,
                fileType: "101",
              })
              .then(({ data }) => {
                this.url = data.data.filePath;
                localStorage.setItem("filePath", this.url);
                this.$light.navigate(
                  `root/createPDFreport/reportPreview?id=${code}&custNo=${this.custNo}&staffId=${data.data.staffId}&brhNo=${data.data.brhNo}&custTel=${this.userInfo.custTel}&custNm=${this.userInfo.custNm}&type=101`,
                );

                // 生成报告按钮埋点
                this.sensors.track("PageClick", {
                  first_module: "企微手机端", //一级模块
                  second_module: "账户诊断", //二级模块
                  third_module: "账户诊断", //三级模块
                  page_name: "账户诊断页面", //页面名称
                  button_area: "底部", //按钮区域
                  button_name: "生成PDF报告", //按钮名称
                  content_id: data.data.staffId, // 员工id
                  content_id2: this.custNo, // 客户号
                  content_title: "账户诊断报告书", //客户报告标题
                  content_title2: code, // 客户报告id(报告编号)
                  content_type: "101", // 报告类型
                  content_id3: this.userInfo.custNm, //客户姓名
                  content_title3: data.data.brhNo, // 部门号
                  content_type2: this.userInfo.custTel, // 手机号
                  content: " ", // 流水号
                });
              });
          });
      } else {
        if (this.adviseisFlag) return;
        this.adviseisFlag = true;
        this.customElementcheck();
      }
    },
    customElementcheck() {
      if (!this.userInfo.riskLvl2 || this.userInfo.riskLvl2 === "默认型") {
        this.adviseisFlag = false;
        return (this.showTip = true);
      }
      this.$apiFwgx.customElementcheck({ custNo: this.custNo }).then(({ data }) => {
        const res = data.data;
        this.adviseisFlag = false;
        if (!res.result && res.msg) {
          return (this.showTip = true);
        }
        if (!res.result) {
          this.checkInfos = [];
          this.checkInfos.push(
            res.riskLevelCheck,
            res.investTermCheck,
            res.investKindCheck,
            res.incomeTypeCheck,
          );
          return this.$refs.myDialog.show(this.checkInfos);
        }
        if (this.userInfo.riskLvl2) {
          this.$light.navigate(`root/customerDetail/configurationPlan?custNo=${this.custNo}`);
        }
      });
    },
    changeTab() {
      this.$router.replace(`/root/customerDetail/${this.active}`);
    },
    overalltip() {
      this.$refs.fiveDimensionTip.show();
    },
    drawFiveGraph() {
      let fiveChart = this.$echarts.init(document.getElementById("fivedimensionalgraph"));
      let option = {
        title: {
          text: this.graph.averageScore,
          x: "center",
          y: "center",
          textStyle: {
            color: "#007BF6",
            fontWeight: "bolder",
            fontSize: 30,
          },
        },

        radar: {
          splitArea: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#DEEDFA",
            },
          },
          center: ["50%", "50%"],
          radius: "55%",
          axisLine: {
            lineStyle: {
              color: "#DEEDFA",
              width: 0.5,
            },
          },
          name: {
            textStyle: {
              fontSize: 14,
              color: "#333433",
            },
            formatter: (value) => {
              if (value === "收益能力") {
                return value + ` {number|${this.graph.prftBalScore}}`;
              } else if (value === "持仓评分") {
                return value + ` {number|${this.graph.holdScore}}`;
              } else if (value === "交易胜率") {
                return value + ` {number|${this.graph.sucsRateScore}}`;
              } else if (value === "择时能力") {
                return value + ` {number|${this.graph.userTimingScore}}`;
              } else if (value === "风险控制") {
                return value + ` {number|${this.graph.maxDrawdownScore}}`;
              }
            },
            rich: {
              number: {
                color: "#3E8FFD",
                fontSize: 14,
              },
            },
          },
          indicator: [
            { name: "收益能力", max: 100 },
            { name: "持仓评分", max: 100 },
            { name: "交易胜率", max: 100 },
            { name: "择时能力", max: 100 },
            { name: "风险控制", max: 100 },
          ],
        },
        series: [
          {
            areaStyle: {
              color: "#9CDAFF",
              opacity: 0.7,
            },
            type: "radar",
            symbol: "none",
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)", // 图表中各个图区域的边框线拐点颜色
                lineStyle: {
                  color: "white", // 图表中各个图区域的边框线颜色
                },
              },
            },
            data: [
              {
                value: [
                  this.graph.prftBalScore,
                  this.graph.holdScore,
                  this.graph.sucsRateScore,
                  this.graph.userTimingScore,
                  this.graph.maxDrawdownScore,
                ],
                name: "Allocated Budget",
              },
            ],
          },
        ],
      };
      fiveChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.accountTip {
  box-sizing: border-box;
}
.overalltipimg {
  z-index: 99;
  width: 1.68rem;
  height: 0.52rem;
  position: relative;
  top: -0.52rem;
  left: 4.95rem;
}
.riskTip {
  width: 6rem;
  .tip {
    font-size: 0.28rem;
    height: 0.84rem;
    line-height: 0.42rem;
    color: #666;
    font-weight: 400;
    margin: 0.4rem 0;
  }
}
.van-dialog {
  border-radius: 0.08rem;
  padding-left: 0.4rem;
  padding-right: 0.3rem;
}
.customerDetail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 1.4rem;
  background: #f2f3f5;
  /deep/ .van-sticky {
    border-bottom: 1px solid #f2f3f5;
  }
  .header {
    .headerInfo {
      box-sizing: border-box;
      height: 7.5rem;
      color: #fff;
      background: url("../../images/accounAnalyseHeader.png") no-repeat;
      padding: 0 0.35rem;
      padding-top: 0.6rem;
    }
    .userInfo {
      height: 1.3rem;
      display: flex;
      align-items: center;
      .avator {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50%;
        .van-image {
          top: 0.05rem;
          left: 0.05rem;
        }
      }
      .customer {
        width: 4.2rem;
        margin: 0.15rem 0rem 0.17rem 0.25rem;
        display: flex;
        flex-direction: column;
        .user {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          .name {
            flex-shrink: 0;
            font-size: 0.36rem;
            line-height: 0.4rem;
          }
          .risk {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            height: 0.34rem;
            text-align: center;
            font-size: 0.24rem;
            background: #4497f9;
            border-radius: 0.04rem;
            margin-left: 0.15rem;
            box-sizing: border-box;
            padding: 0 0.1rem;
          }
          .level {
            display: flex;
            align-items: center;
            text-align: center;
            flex-shrink: 0;
            height: 0.32rem;
            font-size: 0.2rem;
            border-radius: 0.04rem;
            margin-left: 0.15rem;
            padding: 0 0.1rem;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 4px;
          }
        }
        .userline2 {
          margin-top: 0.18rem;
          display: flex;
          align-items: center;
          font-size: 0.28rem;
          height: 0.4rem;
          line-height: 0.4rem;
          .age {
            margin-left: 0.1rem;
            margin-right: 0.1rem;
            padding: 0 0.1rem;
            height: 0.28rem;
            line-height: 0.28rem;
            position: relative;
            &:after {
              content: "";
              position: absolute;
              pointer-events: none; /* 元素永远不会成为鼠标事件的target。 */
              top: -50%;
              bottom: -50%;
              left: -50%;
              right: -50%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              border: 1px solid rgba(255, 255, 255, 0.7);
              border-top: none;
              border-bottom: none;
            }
          }
          .phone {
            height: 0.28rem;
            line-height: 0.28rem;
            margin-left: 0.1rem;
          }
        }
      }
      .interest {
        width: 1.2rem;
        height: 0.56rem;
        background: #ffffff;
        border-radius: 0.28rem;
        background: url("../../images/interest.png") no-repeat;
        background-size: 100% 100%;
      }
      .isinterest {
        width: 1.2rem;
        height: 0.56rem;
        background: #ffffff;
        border-radius: 0.28rem;
        background: url("../../images/isinterest.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .reportNull {
      height: 0.64rem;
      margin-top: 0.25rem;
      margin-bottom: 0.54rem;
    }
    .report {
      display: flex;
      font-size: 0.24rem;
      height: 0.64rem;
      line-height: 0.64rem;
      background: rgba(241, 248, 254, 0.1);
      border-radius: 0.1rem;
      margin-top: 0.25rem;
      margin-bottom: 0.54rem;
      padding: 0 0.3rem;
      .diagnosis {
        margin-right: 0.4rem;
      }
      .van-icon {
        top: 0.2rem;
        margin-left: auto;
      }
    }
    .overall {
      box-sizing: border-box;
      height: 4.2rem;
      border-radius: 0.2rem 0.2rem 0 0;
      padding: 0 0.2rem;
      margin-top: -1.16rem;
      background: linear-gradient(180deg, #ffffff, #f8faff);
      opacity: 0.95;
      .fivedimensionalgraph {
        height: 4rem;
        width: 100%;
      }
      .updateTime {
        text-align: center;
        height: 0.3rem;
        line-height: 0.3rem;
        font-size: 0.22rem;
        color: #8dbce4;
        margin-top: -0.35rem;
      }
    }
    .headertab {
      color: #666666;
    }
  }
  .footbutton {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.1rem;
    display: flex;
    padding: 0.15rem 0.4rem;
    padding-bottom: 0.4rem;
    font-size: 0.32rem;
    background: #fff;
    box-shadow: 0px -1px 0px 0px #ebebeb;
    padding-bottom: env(safe-area-inset-bottom);
    div {
      width: 3.25rem;
      height: 0.8rem;
      border-radius: 0.46rem;
      text-align: center;
      line-height: 0.8rem;
      // border: 0.01rem solid #007bf6;
      color: #007bf6;
    }
  }
  .marright20 {
    margin-right: 0.2rem;
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
  .footbuttonactive {
    background: linear-gradient(90deg, #00aff6, #007bf6);
    color: #fff !important;
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
      border-radius: 46px;
    }
  }
  /deep/ .van-tabs__line {
    width: 0.4rem;
  }
}
</style>
