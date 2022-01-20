<template>
  <div class="recentDevelop">
    <p class="title1">近期动态</p>
    <div class="assets">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="information">
          <div class="num">
            <p class="top">近一月资产均值（元）</p>
            <p class="line1">{{ avgAsset.avgTotAst30 | dealSumMoney }}</p>
            <p class="line2">
              比历史峰值
              <span
                class="percent"
                :style="{ color: avgAsset.astTotRate.indexOf('-') >= 0 ? '#16a043' : '#e72b2b' }"
                >{{ avgAsset.astTotRate }}</span
              >
            </p>
          </div>
          <div class="chart" id="assetsChart"></div>
        </div>
        <TipInfo :tip="avgAsset.script" />
      </div>
    </div>
    <div class="earing">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="information">
          <div class="num">
            <p class="top">近一月收益率（%）</p>
            <p
              class="line1"
              :style="{ color: earingRate.realYldRate30 < 0 ? '#16a043' : '#e72b2b' }"
            >
              {{ earingRate.yldRate30 }}
            </p>
            <p class="line2">
              跑{{ earingRate.opYldRate.indexOf("-") >= 0 ? "输" : "赢" }}沪深300
              <span
                class="percent than"
                :style="{ color: earingRate.opYldRate.indexOf('-') >= 0 ? '#16a043' : '#e72b2b' }"
                >{{
                  earingRate.opYldRate.indexOf("-") >= 0
                    ? earingRate.opYldRate.slice(1)
                    : earingRate.opYldRate
                }}</span
              >
            </p>
          </div>
          <div class="chart" id="earingChart"></div>
        </div>
        <TipInfo :tip="earingRate.script" />
      </div>
    </div>
    <div class="change">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <p class="top">近一月日均换手率（%）</p>
        <div class="information">
          <div class="num">
            <p class="line1">{{ turnRate.turnRate30 }}</p>
            <p class="line2">
              比近一年日均
              <span
                class="percent than"
                :style="{ color: turnRate.conTurnRate.indexOf('-') >= 0 ? '#16a043' : '#e72b2b' }"
                >{{ turnRate.conTurnRate }}</span
              >
            </p>
          </div>
        </div>
        <TipInfo :tip="turnRate.script" :ischange="true" />
      </div>
    </div>
  </div>
</template>

<script>
import TipInfo from "ui/tipInfo.vue";
export default {
  components: { TipInfo },
  data() {
    return {
      avgAsset: {
        astTotRate: "", // 比历史锋值
        avgTotAst30: "", // 近一个月资产均值（元）
        script: "", // 话术
      },
      assetData: { datax: [], datay: [] },
      earingRate: {
        realYldRate30: "", // 近一月收益率（没有保留小数的）
        yldRate30: "", // 近一月收益率
        opYldRate: "", // 跑赢沪深300
        script: "", // 话术
      },
      earingRateData: {
        datax: [],
        datay: [],
      },
      turnRate: {
        turnRate30: "", // 近一个月日均换手率
        conTurnRate: "", // 比近一年日均
        script: "", // 话术
      },
    };
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  created() {
    this.oneMonthAvgAsset();
    this.oneMonthEarningRate();
    this.oneMonthTurnRate();
  },
  methods: {
    oneMonthTurnRate() {
      this.$apiFwgx.oneMonthTurnRate({ custNo: this.custNo }).then(({ data }) => {
        const res = data.data;
        Object.keys(this.turnRate).forEach((key) => (this.turnRate[key] = res[key]));
      });
    },
    oneMonthEarningRate() {
      this.$apiFwgx.oneMonthEarningRate({ custNo: this.custNo }).then(({ data }) => {
        const res = data.data;
        Object.keys(this.earingRate).forEach((key) => {
          this.earingRate[key] = res[key];
        });
        if (res.earningsTrendRateList && res.earningsTrendRateList.length > 0) {
          res.earningsTrendRateList.forEach((item) => {
            this.earingRateData.datax.push(item.date);
            this.earingRateData.datay.push(item.userRate);
          });
          this.drawEaringChart();
        }
      });
    },
    oneMonthAvgAsset() {
      this.$apiFwgx
        .oneMonthAvgAsset({
          custNo: this.custNo,
        })
        .then(({ data }) => {
          const res = data.data;
          Object.keys(this.avgAsset).forEach((key) => {
            this.avgAsset[key] = res[key];
          });
          if (res.assetTrendList && res.assetTrendList.length > 0) {
            res.assetTrendList.forEach((item) => {
              this.assetData.datax.push(item.date); // 日期
              this.assetData.datay.push(item.totAst); // 资产
            });
            this.drawAssetsChart();
          }
        });
    },
    drawEaringChart() {
      let EaringChart = this.$echarts.init(document.getElementById("earingChart"));
      let option = {
        grid: {
          top: 10,
          bottom: 10,
        },
        color: ["#007BF6"],
        backgroundColor: "white",
        title: {
          text: "",
        },
        tooltip: {},
        legend: {
          data: [""],
        },
        xAxis: {
          data: this.earingRateData.datax,
          show: false,
          axisLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: "",
          },
        },
        yAxis: {
          show: false,
          min: "dataMin",
          max: "dataMax",
        },
        series: [
          {
            markLine: {
              //平均线设置
              silent: true, //true 去掉鼠标悬浮该线上的动画
              symbol: "none", //该线无样式
              label: {
                show: false, //该线上的值去掉
              },
              lineStyle: {
                //设置该线样式
                normal: {
                  type: "dashed",
                  color: "#D8D8DB",
                  width: 0.5,
                },
              },
              data: [
                {
                  type: "average", //线的值
                  name: "target",
                },
              ],
            },
            symbol: "none",
            type: "line",
            data: this.earingRateData.datay,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
        ],
      };
      EaringChart.setOption(option);
    },
    drawAssetsChart() {
      let assetsChart = this.$echarts.init(document.getElementById("assetsChart"));
      let option = {
        grid: {
          top: 10,
          bottom: 10,
        },
        color: ["#007BF6"],
        backgroundColor: "white",
        title: {
          text: "",
        },
        tooltip: {},
        legend: {
          data: [""],
        },
        xAxis: {
          data: this.assetData.datax,
          show: false,
          axisLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: "",
          },
        },
        yAxis: {
          show: false,
          min: "dataMin",
          max: "dataMax",
        },
        series: [
          {
            markLine: {
              //平均线设置
              silent: true, //true 去掉鼠标悬浮该线上的动画
              symbol: "none", //该线无样式
              label: {
                show: false, //该线上的值去掉
              },
              lineStyle: {
                //设置该线样式
                normal: {
                  type: "dashed",
                  color: "#D8D8DB",
                  width: 0.5,
                },
              },
              data: [
                {
                  type: "average", //线的值
                  name: "target",
                },
              ],
            },
            symbol: "none",
            type: "line",
            data: this.assetData.datay,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
        ],
      };
      assetsChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.less {
  color: #16a043;
}
.than {
  color: #e72b2b;
}
.title1 {
  height: 0.45rem;
  line-height: 0.45rem;
  font-size: 0.32rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.44rem;
}
.circle {
  width: 0.07rem;
  height: 0.07rem;
  background: #fff;
  border: 0.05rem solid #a1aac1;
  border-radius: 50%;
  margin-right: 0.26rem;
  position: relative;
  left: -0.09rem;
}
.recentDevelop {
  background-color: #fff;
  padding: 0.5rem 0.3rem 0.4rem 0.3rem;
  border-radius: 0.1rem;
  .assets,
  .earing,
  .change {
    display: flex;
    flex-direction: row;
    .left {
      display: flex;
      flex-direction: column;
      border-left: 0.02rem solid #e5e5e5;
    }
    .right {
      width: 100%;
      display: flex;
      flex-direction: column;
      .top {
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.28rem;
        color: #333;
        font-weight: bold;
        margin-top: -0.12rem;
        margin-bottom: 0.05rem;
      }
      .information {
        margin-top: 0.05rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .num {
          display: flex;
          flex-direction: column;
          .line1 {
            font-size: 0.4rem;
            height: 0.48rem;
            line-height: 0.48rem;
            color: #e72b2b;
          }
          .line2 {
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            height: 0.33rem;
            line-height: 0.33rem;
            color: #999;
            margin-top: 0.2rem;
            .percent {
              height: 0.34rem;
              line-height: 0.34rem;
              font-size: 0.28rem;
              margin-left: 0.2rem;
            }
          }
        }
        .chart {
          width: 2rem;
          height: 1.2rem;
        }
      }
    }
  }
  .change {
    .left {
      border-left: none;
    }
    .right {
      .tip {
        .tipInfo {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
