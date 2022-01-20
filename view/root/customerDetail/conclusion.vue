<template>
  <div class="conclusion">
    <div class="model-card style">
      <h3 class="titel">大类配置</h3>
      <!-- 按行业 -->
      <div class="mt-20">
        <div class="pie-configuration" id="pieConfiguration"></div>
      </div>
    </div>
    <!-- 投资风格 -->
    <div class="model-card style">
      <h3 class="titel">投资风格</h3>
      <!-- 按行业 -->
      <div class="mt-40">
        <h4 class="subtitle">按行业</h4>
        <div v-if="investIndusList.length > 0" class="pie-industry" id="pieIndustry"></div>
        <!-- 空状态样式 -->
        <div v-else class="no-data">
          <img class="no-data-img" src="images/no-data.png" />
          <p class="no-data-txt">无股票持仓</p>
        </div>
      </div>
      <!-- 按风格 -->
      <div class="mt-40">
        <h4 class="subtitle">按风格</h4>
        <div v-if="investStyleData" class="echart-box">
          <div class="chartimages">
            <DrawChart :rowindex="rowindex" :colindex="colindex" :isDot="isDot" />
          </div>
          <div>
            <div class="echart-value" v-for="(ele, num) in styleValueList" :key="num">
              <div>
                <span>{{ ele.title }}：</span>
              </div>
              <div class="echart-num">{{ ele.money }}{{ isUnitTenThousand ? "万元" : "元" }}</div>
            </div>
          </div>
        </div>
        <!-- 空状态样式 -->
        <div v-else-if="investStyleDataNull" class="no-data">
          <img class="no-data-img" src="images/no-data.png" />
          <p class="no-data-txt">{{ styleScript }}</p>
        </div>
        <!-- 空状态样式 -->
        <div v-else class="no-data">
          <img class="no-data-img" src="images/no-data.png" />
          <p class="no-data-txt">无股票交易记录</p>
        </div>
      </div>
    </div>
    <div class="model-card conclusion-txt">
      <h3 class="titel">账户诊断结论</h3>
      <p class="detail" v-if="diagnosisConclusionList.str1Script">
        {{ diagnosisConclusionList.str1Script }}
      </p>
      <p class="detail" v-if="diagnosisConclusionList.str2Script">
        {{ diagnosisConclusionList.str2Script }}
      </p>
      <p class="detail" v-if="diagnosisConclusionList.str3Script">
        {{ diagnosisConclusionList.str3Script }}
      </p>
      <p class="detail" v-if="diagnosisConclusionList.str4Script">
        {{ diagnosisConclusionList.str4Script }}
      </p>
      <p class="detail" v-if="diagnosisConclusionList.str5Script">
        {{ diagnosisConclusionList.str5Script }}
      </p>
      <p class="detail" v-if="diagnosisConclusionList.str6Script">
        {{ diagnosisConclusionList.str6Script }}
      </p>
    </div>
    <div class="tips">
      <h3 class="tipInfo">重要提示</h3>
      <div :class="btnUp ? 'info-content2' : 'info-content'">
        <div class="steps" v-for="(item, index) in stepsArr" :key="index">
          <div class="numbg">{{ index + 1 }}</div>
          {{ item.txt }}
        </div>
      </div>
      <button class="btn" @click="onclickMore">
        <!-- {{ butTxt }} -->
        {{ btnUp ? "收起" : "展开更多" }}
        <img class="btn-icon" :src="btnUp ? 'images/icon-up.png' : 'images/icon-down.png'" />
      </button>
    </div>
  </div>
</template>

<script>
import DrawChart from "ui/drawChart.vue";
export default {
  components: {
    DrawChart,
  },
  data() {
    return {
      active: "baseMessage",
      btnUp: false, // 默认展开收起
      stepsArr: [
        {
          txt: "国海证券出具的账户诊断报告基于客户在我司系统过往交易数据分析得出，仅供客户参考，不对客户构成投资交易要约投资建议。客户在决定投资交易前，应充分了解投资交易的条款、细则、限制与风险等因素，评估投资交易是否切合自身的条件与目标，国海证券不会因所提供报告中表述的观点与实施结果存在差异而承担任何法律或经济上的责任。",
        },
        {
          txt: "国海证券出具的账户诊断报告中的数据和观点截止到报告生成日期，具有时效性。",
        },
        {
          txt: "客户个人信息提供不完全、客观环境变化、客户个人财务状况变化等因素均可能导致本账户诊断报告的实施诊断结果与预期目标服务预期之间出现差异，国海证券对此不承担任何法律或经济上的责任。",
        },
        {
          txt: "客户所提供的一切个人信息国海证券依法严格保密。",
        },
        {
          txt: "市场有风险，投资需谨慎。",
        },
      ],
      diagnosisConclusionList: {}, // 账户诊断结论
      // 大类配置
      assetConfigurtion: [
        { value: 0, name: "权益类" },
        { value: 0, name: "固收类" },
        { value: 0, name: "现金类" },
        { value: 0, name: "其他" },
      ],
      // 按行业
      investIndusList: [],
      // 按风格
      styleValueList: [
        { title: "y轴", money: "0元" },
        { title: "x轴", money: "0元" },
      ],
      rowindex: 1, // 0 大盘股; 1 中盘; 2 小盘
      colindex: 0, // 0 价值型; 1 平衡型; 2 成长型
      isDot: false, // 是否展示交叉点
      investStyleData: null,
      investStyleDataNull: false, //风格2个都为其他为true
      xTitle: false, // 按风格-x轴
      yTitle: false, // 按风格-y轴
      styleScript: "", // 空状态话术-风格2个都为其他为true
      isUnitTenThousand: false, //风格单位是否万元
    };
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  created() {
    //大类配置
    this.getAssetData();
    // 投资风格-按行业
    this.getInvestIndus();
    // 投资风格-按风格
    this.getInvestStyle();
    // 诊断总结话术
    this.getDiagnosisConclusion();
  },
  methods: {
    onclickMore() {
      this.btnUp = !this.btnUp;
    },
    // 当前大类配置
    getAssetData() {
      this.$apiFwgx.getAssetData({ custNo: this.custNo }).then((res) => {
        const assetLIst = JSON.parse(JSON.stringify(res.data.data));
        this.assetConfigurtion.map((item) => {
          switch (item.name) {
            case "权益类":
              item.value = parseFloat(assetLIst.rightsMktValPer); // str -->number
              item.name = `权益类：${assetLIst.rightsMktValPer}`;
              break;
            case "固收类":
              item.value = parseFloat(assetLIst.fixedMktValPer); // str -->number
              item.name = `固收类：${assetLIst.fixedMktValPer}`;
              break;
            case "现金类":
              item.value = parseFloat(assetLIst.cashMktValPer); // str -->number
              item.name = `现金类：${assetLIst.cashMktValPer}`;
              break;
            case "其他":
              item.value = parseFloat(assetLIst.otherMktValPer); // str -->number
              item.name = `其他：${assetLIst.otherMktValPer}`;
              break;
            default:
              break;
          }
        });
        // 图表
        this.drawPieConfiguration();
      });
    },
    // 投资风格-按行业
    getInvestIndus() {
      this.$apiFwgx
        .getInvestIndus({
          custNo: this.custNo, //客户号
        })
        .then((res) => {
          const investIndusData = JSON.parse(JSON.stringify(res.data.data.industryListVoList));
          let unitJudge = investIndusData.some((item) => item.sumSecMktVal < 10000);
          investIndusData.forEach((item) => {
            let numberMoney = 0;
            if (!unitJudge) {
              numberMoney = (item.sumSecMktVal / 10000).toFixed(0);
              console.log("numberMoney", numberMoney);
            } else {
              numberMoney = item.sumSecMktVal.toFixed(0);
            }
            this.investIndusList.push({
              value: item.sumSecMktVal,
              name: `${item.industry} : ${numberMoney} ${unitJudge ? "元" : "万元"}`,
            });
          });
          if (this.investIndusList.length > 0) {
            // 图表
            setTimeout(() => {
              this.drawPieIndustry();
            }, 200);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 投资风格-按风格
    getInvestStyle() {
      this.$apiFwgx
        .getInvestStyle({
          custNo: this.custNo, //客户号
        })
        .then((res) => {
          console.log("getInvestStyle-res", res);
          const investStyleData = JSON.parse(JSON.stringify(res.data.data));
          this.investStyleData = investStyleData;
          // 2个都返回为其他，则显示空状态--持仓无风格偏好
          if (
            investStyleData.x.investStyle.indexOf("其他") != -1 &&
            investStyleData.y.investStyle.indexOf("其他") != -1
          ) {
            this.investStyleDataNull = true;
            this.investStyleData = null;
            this.styleScript = investStyleData.styleScript;
          }
          if (investStyleData.x.investStyle.indexOf("大盘") != -1) {
            this.rowindex = 0;
          } else if (investStyleData.x.investStyle.indexOf("中盘") != -1) {
            this.rowindex = 1;
          } else if (investStyleData.x.investStyle.indexOf("小盘") != -1) {
            this.rowindex = 2;
          } else {
            this.rowindex = 0;
            this.yTitle = true;
            // this.isDot = true;
          }
          if (investStyleData.y.investStyle.indexOf("价值") != -1) {
            this.colindex = 0;
          } else if (investStyleData.y.investStyle.indexOf("平衡") != -1) {
            this.colindex = 1;
          } else if (investStyleData.y.investStyle.indexOf("成长") != -1) {
            this.colindex = 2;
          } else if (investStyleData.y.investStyle.indexOf("其他") != -1) {
            this.colindex = 0;
            this.xTitle = true;
          }
          let moneyX = 0;
          let moneyY = 0;
          if (investStyleData.x.secMktVal > 10000 && investStyleData.y.secMktVal > 10000) {
            this.isUnitTenThousand = true;
            moneyX = Math.round(investStyleData.x.secMktVal / 10000).toLocaleString();
            moneyY = Math.round(investStyleData.y.secMktVal / 10000).toLocaleString();
          } else {
            this.isUnitTenThousand = false;
            moneyX = Math.round(investStyleData.x.secMktVal).toLocaleString();
            moneyY = Math.round(investStyleData.y.secMktVal).toLocaleString();
          }
          this.styleValueList.map((item) => {
            switch (item.title) {
              case "x轴":
                if (this.xTitle) {
                  item.title = "价值型";
                  item.money = 0;
                } else {
                  item.title = investStyleData.x.investStyle;
                  item.money = moneyX;
                }
                break;
              case "y轴":
                if (this.yTitle) {
                  item.title = "大盘股";
                  item.money = 0;
                } else {
                  item.title = investStyleData.y.investStyle;
                  item.money = moneyY;
                }
                break;
            }
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 诊断总结话术
    getDiagnosisConclusion() {
      this.$apiFwgx
        .getDiagnosisConclusion({
          custNo: this.custNo, //客户号
        })
        .then((res) => {
          console.log("getDiagnosisConclusion", res);
          this.diagnosisConclusionList = JSON.parse(JSON.stringify(res.data.data));
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 大类配置-图表
    drawPieConfiguration() {
      let pieConfiguration = this.$echarts.init(document.getElementById("pieConfiguration"));
      let option = {
        tooltip: {
          trigger: "item",
          confine: true, // 悬停倍遮挡问题
        },
        legend: {
          orient: "vertical", // 方向
          icon: "circle",
          itemWidth: 5,
          left: "40%", //图例距离左的距离
          top: "center",
          itemGap: 18, //间距
        },
        color: ["#007BF6", "#F7B501", "#34C2FC", "#4FDEB2"],
        series: [
          {
            name: "大类配置",
            type: "pie",
            // radius: ["40px", "50px"],
            radius: ["40%", "57%"],
            // center: ["40px", "50%"],
            center: ["15%", "50%"], //图的位置，距离左跟上的位置
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {},
            labelLine: {
              show: false,
            },
            itemStyle: {
              // 色块间隙
              // normal: {
              //   borderWidth: 1,
              //   borderColor: "#ffffff",
              // },
            },
            data: this.assetConfigurtion,
          },
        ],
      };
      pieConfiguration.setOption(option);
    },
    // 按行业-图表
    drawPieIndustry() {
      let pieIndustry = this.$echarts.init(document.getElementById("pieIndustry"));
      let option = {
        tooltip: {
          trigger: "item",
          confine: true, // 悬停倍遮挡问题
        },
        legend: {
          orient: "vertical", // 方向
          icon: "circle",
          itemWidth: 5,
          left: "40%", //图例距离左的距离
          top: "center",
          itemGap: 18, //间距
        },
        color: ["#007BF6", "#F7B501", "#34C2FC", "#4FDEB2"],
        series: [
          {
            name: "按行业",
            type: "pie",
            // radius: ["40px", "50px"],
            radius: ["40%", "57%"],
            // center: ["40px", "50%"],
            center: ["15%", "50%"], //图的位置，距离左跟上的位置
            avoidLabelOverlap: false,
            hoverAnimation: false, // hover尺寸改变问题
            label: {
              show: false,
              position: "center",
            },
            emphasis: {},
            labelLine: {
              show: false,
            },
            itemStyle: {
              // 色块间隙
              // normal: {
              //   borderWidth: 1,
              //   borderColor: "#ffffff",
              // },
            },
            data: this.investIndusList,
          },
        ],
      };
      pieIndustry.setOption(option);
    },
  },
};
</script>

<style lang="less" scope>
.conclusion {
  .mt-40 {
    margin-top: 0.4rem;
  }
  .mt-20 {
    margin-top: 0.2rem;
  }
  .color-blod {
    color: #333;
    font-weight: 500;
  }
  .color-red {
    color: #e72b2b;
    font-weight: 500;
  }
  padding: 0rem 0.3rem 0.5rem;
  background: #f2f3f5;
  .conclusion-txt {
    padding: 0.5rem 0.3rem;
    background: #fff;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    .conclu-title {
      font-size: 0.32rem;
      font-weight: 600;
      color: #333;
      line-height: 1;
      text-align: left;
    }
    .detail {
      margin-top: 0.2rem;
      line-height: 1.7;
      color: #666;
      &::before {
        position: relative;
        top: -0.1rem;
        left: 0;
        display: inline-block;
        content: "";
        width: 0.04rem;
        height: 0.04rem;
        border-radius: 50%;
        background: #666;
        margin-right: 0.08rem;
      }
    }
  }
  .tips {
    padding: 0 0.05rem;
    margin-top: 0.4rem;
    color: #999;
    font-size: 0.26rem;

    .btn {
      display: block;
      width: 100%;
      margin-top: 0.2rem;
      padding: 0.1rem;
      text-align: center;
      .btn-icon {
        width: 0.28rem;
        height: 0.28rem;
        margin-left: 0.1rem;
        position: relative;
        top: -0.03rem;
      }
    }
  }
  .tipInfo {
    height: 0.4rem;
    font-size: 0.26rem;
    font-weight: 500;
    text-align: left;
    color: #666666;
    line-height: 0.4rem;
    margin-top: 0.4rem;
  }
  .info-content {
    max-height: 1.4rem;
    /*! autoprefixer: off */
    text-overflow: ellipsis;
    overflow-y: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    /*! autoprefixer: on */
  }
  .info-content2 {
    max-height: 8.88rem;
  }
  .info-content,
  .info-content2 {
    font-size: 0.26rem;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 0.4rem;
    .steps {
      margin-top: 0.2rem;
    }
    .numbg {
      display: inline-block;
      text-align: center;
      line-height: 0.32rem;
      width: 0.32rem;
      height: 0.32rem;
      background: url("../../../images/numBg.png");
      background-size: 100% 100%;
    }
  }
  .over-hide {
    margin-top: 0.2rem;
    line-height: 1.6;
    max-height: 1.2rem;
    /*! autoprefixer: off */
    text-overflow: ellipsis;
    overflow-y: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    /*! autoprefixer: on */
  }
  .model-card {
    position: relative;
    margin-top: 0.2rem;
    padding: 0 0.3rem 0.5rem;
    background: #fff;
    border-radius: 0.1rem;
    line-height: 1.5;
    &::before {
      content: "";
      display: block;
      background: url("../../../images/icon-handle.png") no-repeat;
      background-size: 100%;
      height: 0.63rem;
      position: absolute;
      top: -0.4rem;
      left: 0.3rem;
      right: 0.3rem;
    }
    &:first-child::before {
      display: none;
    }
    .titel {
      font-size: 0.32rem;
      padding-top: 0.5rem;
      font-weight: 600;
      line-height: 1.2;
      padding-bottom: 0.2rem;
    }
  }
  // 投资风格
  .style {
    .subtitle {
      font-size: 0.28rem;
      font-weight: 500;
      color: #333;
      &::before {
        content: "";
        display: inline-block;
        width: 0.06rem;
        height: 0.24rem;
        background: #007bf6;
        margin-right: 0.1rem;
      }
    }
  }
  // 大类配置
  .pie-configuration {
    width: 100%;
    height: 2.8rem;
    margin-top: 0.2rem;
  }
  // 按行业图表
  .pie-industry {
    width: 100%;
    height: 2.8rem;
    margin-top: 0.25rem;
  }
  // 按风格图表
  .pie-style {
    width: 5.3rem;
    height: 2.3rem;
    margin-top: 0.2rem;
  }
  .echart-box {
    margin-top: 0.2rem;
    background: #ffffff;
    display: flex;
    align-items: center;
    .chartimages {
      width: 3.6rem;
      height: 2.35rem;
      padding: 0.3rem 0.2rem 0.25rem;
      background: #f7f8fa;
      margin-right: 0.5rem;
      box-sizing: border-box;
    }
    .echart-value {
      width: 100%;
      // height: 0.24rem;
      // display: flex;
      // justify-content: left;
      // align-items: center;
      font-size: 0.24rem;
      // font-family: SourceHanSansCN, SourceHanSansSC-Normal;
      font-weight: Normal;
      text-align: left;
      color: #666;
      line-height: 0.36rem;
      margin-bottom: 0.25rem;
      & > div {
        display: flex;
        align-items: center;
      }
      .echart-num {
        color: #333;
        line-height: 0.4rem;
        font-size: 0.28rem;
        font-weight: 600;
      }
    }
  }
  .no-data {
    padding: 0.2rem 0.2rem 0.16rem;
    text-align: center;
    .no-data-img {
      width: 2.64rem;
      height: 1.69rem;
      background-size: 100%;
    }
    .no-data-txt {
      font-size: 0.28rem;
      color: #666;
      line-height: 1.5;
    }
  }
}
</style>
