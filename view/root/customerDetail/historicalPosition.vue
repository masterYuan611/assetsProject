<template>
  <div class="hostoricalPosition">
    <p class="title1">历史仓位</p>
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
    <div v-if="showFlag" class="historicalChart" id="historicalChart"></div>
    <TipInfo :tip="script" :ischange="true" />
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
      script: "", // 话术
      historicData: {
        datax: [], // 日期
        stkMtkPercent: [], // 股票
        bondMtkPercent: [], // 债券
        mnyProdPercent: [], // 理财
      },
      showFlag: true,
    };
  },
  created() {
    this.historyPosition(1);
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  methods: {
    historyPosition(flag) {
      this.$apiFwgx.historyPosition({ custNo: this.custNo, ljFlag: flag }).then(({ data }) => {
        const res = data.data;
        this.script = res.script;
        if (res.historyPositionList && res.historyPositionList.length > 0) {
          Object.keys(this.historicData).forEach((key) => {
            this.historicData[key] = [];
          });
          res.historyPositionList.forEach((item) => {
            this.historicData.datax.push(item.date);
            this.historicData.stkMtkPercent.push(item.stkMtkPercent);
            this.historicData.bondMtkPercent.push(item.bondMtkPercent);
            this.historicData.mnyProdPercent.push(item.mnyProdPercent);
          });
        }
        this.showFlag = true;
        setTimeout(() => {
          this.drawHistoricalChart();
        }, 200);
      });
    },
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
      this.historyPosition(flag);
    },
    drawHistoricalChart() {
      let me = this;
      let earingsTrendChart = this.$echarts.init(document.getElementById("historicalChart"));
      let max = Math.ceil(
        Math.max(
          ...this.historicData.stkMtkPercent,
          ...this.historicData.bondMtkPercent,
          ...this.historicData.mnyProdPercent,
        ),
      );
      let option = {
        grid: {
          top: 35,
          bottom: 30,
        },
        color: ["#007bf6", "#ff8a1f", "#ee3bf1", "#1ac7e9"],
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let showHtml = "";
            params.forEach((item, index) => {
              if (index === 0) {
                showHtml += `${item.name}<br/>`;
              }
              showHtml += `<p><span style="color:#333;margin-right:30px;">${item.seriesName}</span><span style="color:#000;float:right;font-weight:400;">${item.value}%</span></p>`;
            });
            return showHtml;
          },
        },
        legend: {
          data: [
            {
              name: "股票",
              icon: "rect",
              itemStyle: {
                color: "#007bf6",
              },
            },
            {
              name: "债券",
              icon: "rect",
              itemStyle: {
                color: "#ff8a1f",
              },
            },
            {
              name: "理财",
              icon: "rect",
              itemStyle: {
                color: "#ee3bf1",
              },
            },
          ],
          orient: "horizontal",
          itemHeight: 4,
          itemWidth: 4,
          x: "left",
          y: "top",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.historicData.datax,
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 10,
            textStyle: {
              color: "#999999",
            },
            interval: me.historicData.datax.length - 2,
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
          min: "dataMin",
          max: max,
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: "9",
              color: "#999",
            },
            formatter: function (value) {
              return value + "%";
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
            name: "股票",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.historicData.stkMtkPercent,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
          {
            name: "债券",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.historicData.bondMtkPercent,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
          {
            name: "理财",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.historicData.mnyProdPercent,
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
.hostoricalPosition {
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
  .historicalChart {
    width: 6.31rem;
    height: 4rem;
  }
  .assetData {
    display: flex;
    margin-bottom: 0.2rem;
    div {
      flex: 1;
      text-align: center;
    }
    .des {
      font-size: 0.24rem;
      height: 0.33rem;
      line-height: 0.33rem;
      font-weight: 400;
      color: #666;
      margin-bottom: 0.04rem;
    }
    .number {
      font-size: 0.28rem;
      height: 0.34rem;
      line-height: 0.34rem;
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
