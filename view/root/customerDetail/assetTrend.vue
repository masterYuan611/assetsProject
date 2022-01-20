<template>
  <div class="assetTrend">
    <p class="title1">资产走势</p>
    <div class="period">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="{ PeriodTabactive: tab === item.name }"
        @click="changeTab(item.name)"
      >
        {{ item.text }}
      </div>
    </div>
    <div v-if="showFlag" class="assetChart" id="assetChart"></div>
    <div class="assetData">
      <div class="astBegin">
        <p class="des">期初资产</p>
        <p
          :style="[
            {
              letterSpacing:
                parseInt(assetInfo.astBegin).toString().length > 9 ? '-0.012rem' : '0.01rem',
            },
          ]"
          class="number"
        >
          {{ assetInfo.astBegin | dealSumMoney }}
        </p>
      </div>
      <div class="add">+</div>
      <div class="astInc">
        <div class="branch"></div>
        <div>
          <p class="des">资产净流入</p>
          <p
            :style="[
              {
                letterSpacing:
                  parseInt(assetInfo.astInc).toString().length > 9 ? '-0.012rem' : '0.01rem',
              },
            ]"
            class="number mb-20"
            :class="{ profit: assetInfo.astInc > 0, loss: assetInfo.astInc < 0 }"
          >
            {{ assetInfo.astInc | dealSumMoney }}
          </p>
          <p class="des mt-20">盈亏</p>
          <p
            :style="[
              {
                letterSpacing:
                  parseInt(assetInfo.prftBal).toString().length > 9 ? '-0.012rem' : '0.01rem',
              },
            ]"
            class="number"
            :class="{ profit: assetInfo.prftBal > 0, loss: assetInfo.prftBal < 0 }"
          >
            {{ assetInfo.prftBal | dealSumMoney }}
          </p>
        </div>
      </div>
      <div class="equ">=</div>
      <div class="astEnd">
        <p class="des">期末资产</p>
        <p
          class="number"
          :style="[
            {
              letterSpacing:
                parseInt(assetInfo.astEnd).toString().length > 9 ? '-0.012rem' : '0.01rem',
            },
          ]"
        >
          {{ assetInfo.astEnd | dealSumMoney }}
        </p>
      </div>
    </div>
    <TipInfo :tip="assetInfo.script" :ischange="true" />
    <p class="remarks">备注：期末资产=期初资产+资产净流入+盈亏额</p>
  </div>
</template>

<script>
import TipInfo from "ui/tipInfo.vue";
export default {
  components: { TipInfo },
  data() {
    return {
      tabList: [
        { name: "thisWeek", text: "本周" },
        { name: "thisMonth", text: "本月" },
        { name: "threeMonth", text: "近三月" },
        { name: "thisYear", text: "今年以来" },
      ],
      tab: "thisWeek",
      assetOut: {},
      assetInfo: {
        astBegin: "", // 期初资产
        astEnd: "", // 期末资产
        prftBal: "", // 盈亏
        script: "", // 话术
        astInc: 0, // 资产净流入
        cptlFlwOut: 0, // 银证转出
      },
      assetData: {
        datax: [],
        datay: [],
      },
      showFlag: true,
    };
  },
  created() {
    this.assetTrend(1);
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  methods: {
    changeTab(tab) {
      this.tab = tab;
      let flag = 1;
      switch (tab) {
        case "thisMonth":
          flag = 2;
          break;
        case "threeMonth":
          flag = 3;
          break;
        case "thisYear":
          flag = 4;
          break;
        default:
          flag = 1;
      }
      this.showFlag = false;
      this.assetTrend(flag);
    },
    assetTrend(flag) {
      this.$apiFwgx.assetTrend({ custNo: this.custNo, ljFlag: flag }).then(({ data }) => {
        const res = data.data;
        Object.keys(this.assetInfo).forEach((key) => {
          this.assetInfo[key] = res[key];
        });
        this.assetData.datax = [];
        this.assetData.datay = [];
        this.assetOut = {};
        if (res.assetTrendList && res.assetTrendList.length > 0) {
          res.assetTrendList.forEach((item) => {
            this.assetData.datax.push(item.date);
            this.assetData.datay.push(item.totAst);
          });
        }
        this.showFlag = true;
        setTimeout(() => {
          this.drawAssetTrendChart();
        }, 200);
      });
    },
    drawAssetTrendChart() {
      let me = this;
      let min = Math.floor(Math.min(...this.assetData.datay));
      let max = Math.ceil(Math.max(...this.assetData.datay));
      let differ = max - min;
      let unit = Math.abs(max) > 10000 ? "万元" : "元";
      let inter = 0;
      if (Math.abs(max) < 10000) {
        inter = Math.floor(differ / 4);
      } else {
        this.assetData.datay.forEach((item, index) => {
          this.assetData.datay[index] = item / 10000;
        });
        min = Math.floor(Math.min(...this.assetData.datay));
        max = Math.ceil(Math.max(...this.assetData.datay));
        differ = max - min;
        inter = differ / 4;
        if (differ < 4) {
          inter = parseFloat(inter.toFixed(1));
        } else {
          inter = Math.floor(inter);
        }
      }
      let earingsTrendChart = this.$echarts.init(document.getElementById("assetChart"));
      let option = {
        color: ["#79BAFA"],
        grid: {
          left: "14%",
          top: 35,
          bottom: 30,
        },
        title: {
          text: `资产（${unit}）`,
          left: "left",
          top: "top",
          textStyle: {
            fontSize: 12,
            color: "#999",
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let showHtml = "";
            params.forEach((item) => {
              let value = unit === "万元" ? item.value * 10000 : item.value;
              showHtml = `${item.name}<br/><p>
              <span style="color:#333;margin-right:30px;">资产</span>
              <span style="color:#000;float:right;font-weight:400;">${value.toFixed(2)}元</span>
              </p>`;
            });
            return showHtml;
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.assetData.datax,
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 10,
            interval: me.assetData.datax.length - 2,
            textStyle: {
              color: "#999999",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#DBDBDB",
              width: 0.5,
            },
          },
        },
        yAxis: {
          splitNumber: 4,
          min: min,
          max: max,
          interval: inter,
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: "8",
              color: "#999",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#DBDBDB",
              width: 0.5,
            },
          },
        },
        series: [
          {
            type: "line",
            stack: "Total",
            smooth: true,
            symbol: "none",
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
      earingsTrendChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.PeriodTabactive {
  background-color: #fff;
  border: 0.01rem solid rgba(0, 123, 246, 0.3);
  box-shadow: 0 0.02rem 0.1rem 0 rgba(65, 93, 148, 0.15);
  color: #007bf6;
  border-radius: 0.04rem;
  font-weight: 500;
}
.mt-20 {
  margin-top: 0.2rem;
}
.mb-20 {
  margin-bottom: 0.2rem;
}
.profit {
  color: #e72b2b !important;
}
.loss {
  color: #16a043 !important;
}
.assetTrend {
  margin-top: 0.2rem;
  position: relative;
  background-color: #fff;
  padding: 0.5rem 0.3rem 0.4rem 0.3rem;
  border-radius: 0.1rem;
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
  .title1 {
    height: 0.45rem;
    line-height: 0.45rem;
    font-size: 0.32rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.44rem;
  }
  .period {
    margin: 0 auto;
    margin-bottom: 0.4rem;
    box-sizing: content-box;
    height: 0.54rem;
    display: flex;
    align-items: center;
    background-color: #f2f3f5;
    border-radius: 0.06rem;
    font-size: 0.26rem;
    color: #666;
    padding: 0.04rem 0.04rem;
    div {
      font-weight: 500;
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  }
  .assetChart {
    width: 6.31rem;
    height: 4rem;
  }
  .assetData {
    display: flex;
    width: 6.3rem;
    margin-bottom: 0.2rem;
    align-items: center;
    div {
      text-align: left;
    }
    .add {
      font-size: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0.05rem solid #fff;
      height: 0.3rem;
      width: 0.3rem;
      box-sizing: border-box;
      border-radius: 50%;
      background: #f7f8fa;
      margin-left: -0.1rem;
    }
    .branch {
      width: 0.2rem;
      border-top: 0.01rem solid #dfe2e6;
      border-bottom: 0.01rem solid #dfe2e6;
      border-left: 0.01rem solid #dfe2e6;
      border-top-left-radius: 0.04rem;
      border-bottom-left-radius: 0.04rem;
      position: relative;
    }
    .branch::before {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -0.09rem;
      border-right: 0.09rem solid #dfe2e6;
      border-top: 0.07rem solid transparent;
      border-bottom: 0.07rem solid transparent;
    }
    .branch:after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -0.07rem;
      border-right: 0.09rem solid #fff;
      border-top: 0.05rem solid transparent;
      border-bottom: 0.05rem solid transparent;
    }
    .equ {
      font-size: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 0.3rem;
      width: 0.3rem;
      border-radius: 50%;
      background: #f7f8fa;
      border: 0.05rem solid #fff;
      margin-right: -0.1rem;
      z-index: 9;
    }
    .astBegin {
      box-sizing: border-box;
      width: 2.2rem;
      padding: 0.09rem 0.14rem 0.12rem;
      background: #f7f8fa;
      border-radius: 0.04rem;
      height: 0.89rem;
    }
    .astInc {
      width: 2rem;
      display: flex;
      flex-direction: row;
      margin-left: 0.05rem;
    }
    .astEnd {
      width: 2.2rem;
      box-sizing: border-box;
      padding: 0.09rem 0.14rem 0.14rem;
      background: #f7f8fa;
      border-radius: 0.04rem;
      height: 0.89rem;
    }

    .des {
      font-size: 0.24rem;
      height: 0.33rem;
      line-height: 0.33rem;
      font-weight: 400;
      color: #666;
      // margin-bottom: 0.04rem;
    }
    .number {
      font-size: 0.24rem;
      height: 0.29rem;
      line-height: 0.29rem;
      font-weight: 500;
      color: #333;
    }
  }
  .remarks {
    margin-top: 0.3rem;
    font-size: 0.24rem;
    height: 0.33rem;
    line-height: 0.33rem;
    color: #999;
    font-weight: 400;
  }
}
</style>
