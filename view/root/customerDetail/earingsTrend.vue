<template>
  <div class="earningsTrend">
    <p class="title1">收益走势</p>
    <div class="period">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="{ PeriodTabactive: period === item.name }"
        @click="changePeriod(item.name)"
      >
        {{ item.text }}
      </div>
    </div>
    <div v-if="showFlag" class="earingsTab" id="earingsTrendChart"></div>
    <TipInfo :tip="script" />
    <Estimate title="收益评估" />
    <EstimateTab :tab="earningEstamateTab" class="martop30" />
    <Estimate title="风险评估" class="martop70" />
    <EstimateTab :tab="riskEstamateTab" class="martop30" />
  </div>
</template>

<script>
import TipInfo from "ui/tipInfo.vue";
import Estimate from "ui/estimate.vue";
import EstimateTab from "ui/estimateTab.vue";
export default {
  components: { TipInfo, Estimate, EstimateTab },
  data() {
    return {
      tabList: [
        { name: "thisWeek", text: "本周" },
        { name: "thisMonth", text: "本月" },
        { name: "threeMonth", text: "近三月" },
        { name: "thisYear", text: "今年以来" },
      ],
      earningEstamateTab: { head: ["指标", "客户", "评价"], body: [] }, // 收益评估
      riskEstamateTab: { head: ["指标", "客户", "基准", "评价"], body: [] }, // 风险评估
      acitve: "assetAnalysis",
      period: "thisWeek",
      trendData: { datax: [], datauser: [], datahs: [] },
      script: "", // 话术
      showFlag: true,
    };
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  created() {
    this.earingsTrend(this.custNo, 1);
  },
  methods: {
    earingsTrend(cus, flag) {
      this.$apiFwgx.earingsTrend({ custNo: cus, ljFlag: flag }).then(({ data }) => {
        const res = data.data;
        this.script = res.script;
        if (res.earningsTrendRateList && res.earningsTrendRateList.length > 0) {
          this.trendData.datax = [];
          this.trendData.datauser = [0];
          this.trendData.datahs = [0];
          res.earningsTrendRateList.forEach((item) => {
            this.trendData.datax.push(item.date);
            this.trendData.datauser.push(item.userRate);
            this.trendData.datahs.push(item.hs300Rate);
          });
          let firstTradeDate = this.trendData.datax[0];
          let begin = +new Date(firstTradeDate) - 1000 * 60 * 60 * 24; // 取交易日前一天
          begin = new Date(begin);
          this.trendData.datax.unshift(
            begin.getFullYear() + "-" + (begin.getMonth() + 1) + "-" + begin.getDate(),
          );
          this.showFlag = true;
          setTimeout(() => {
            this.drawearingsTrendChart();
          }, 200);
        }
        if (res.incomeAssessList && res.incomeAssessList.length > 0) {
          this.earningEstamateTab.body = [];
          res.incomeAssessList.forEach((item) => {
            this.earningEstamateTab.body.push([
              { content: item.target },
              { content: item.userTarget.toFixed(2) },
              { content: item.assess },
            ]);
          });
        }
        if (res.riskAssessList && res.riskAssessList.length > 0) {
          this.riskEstamateTab.body = [];
          res.riskAssessList.forEach((item, index) => {
            let ele = [
              { content: item.target },
              { content: item.userTarget.toFixed(2) },
              { content: item.base.toFixed(2) },
            ];
            if (index === 0) {
              ele.push({ content: item.assess, rowspan: 3 });
            }
            this.riskEstamateTab.body.push(ele);
          });
        }
      });
    },
    changePeriod(tab) {
      this.period = tab;
      let flag = "1";
      switch (tab) {
        case "thisWeek":
          flag = 1;
          break;
        case "thisMonth":
          flag = 2;
          break;
        case "threeMonth":
          flag = 3;
          break;
        default:
          flag = 4;
      }
      this.showFlag = false;
      this.earingsTrend(this.custNo, flag);
    },
    drawearingsTrendChart() {
      let me = this;
      let min = Math.floor(Math.min(...this.trendData.datauser, ...this.trendData.datahs));
      let max = Math.ceil(Math.max(...this.trendData.datauser, ...this.trendData.datahs));
      let inter = (max - min) / 4;
      if (inter < 1) {
        inter = parseFloat(inter.toFixed(1));
      } else {
        inter = Math.ceil(inter);
      }
      let earingsTrendChart = this.$echarts.init(document.getElementById("earingsTrendChart"));
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let showHtml = "";
            params.forEach((item, index) => {
              if (item.name === me.trendData.datax[0]) {
                return "";
              }
              if (index === 0) {
                showHtml += item.name + "<br/>";
              }
              showHtml += `<p><span style="color:#333;margin-right:30px;">${item.seriesName}</span><span style="color:#000;float:right;font-weight:400;">${item.value}%</span></p>`;
            });
            return showHtml;
          },
        },
        grid: {
          left: 35,
          top: 35,
          bottom: 30,
        },
        color: ["#007bf6", "#ff8a1f"],
        legend: {
          itemGap: 20,
          data: [
            {
              name: "我的账户",
              icon: "rect",
              itemStyle: {
                color: "#007bf6",
              },
            },
            {
              name: "沪深300",
              icon: "rect",
              itemStyle: {
                color: "#ff8a1f",
              },
            },
          ],
          orient: "horizontal",
          itemHeight: 5,
          itemWidth: 5,
          x: "left",
          y: "top",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.trendData.datax,
          axisTick: {
            show: false,
          },
          axisLabel: {
            align: "center",
            textStyle: {
              color: "#999999",
            },
            fontSize: 10,
            interval: me.trendData.datax.length - 2,
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
              fontSize: 10,
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
            name: "我的账户",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.trendData.datauser,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
          {
            name: "沪深300",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.trendData.datahs,
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
.martop70 {
  margin-top: 0.7rem;
}
.martop30 {
  margin-top: 0.3rem;
}
.title1 {
  height: 0.45rem;
  line-height: 0.45rem;
  font-size: 0.32rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.44rem;
}
.earningsTrend {
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
  .period {
    padding: 0.04rem 0.04rem;
    height: 0.54rem;
    display: flex;
    align-items: center;
    background-color: #f2f3f5;
    border-radius: 0.06rem;
    font-size: 0.26rem;
    color: #666;
    div {
      width: 25%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .earingsTab {
    margin-top: 0.5rem;
    width: 100%;
    height: 4rem;
  }
}
</style>
