<template>
  <div class="profitLossYear">
    <p class="title1">本年盈亏情况</p>
    <div class="period">
      <div
        v-for="item in tabList"
        :key="item.name"
        :class="{ PeriodTabactive: tab === item.name }"
        @click="changeTab(item.name)"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="type">
      <div @click="changeType('profit')" :class="{ activeClass: activeTab === 'profit' }">
        盈利TOP5
      </div>
      <div class="line2"></div>
      <div @click="changeType('loss')" :class="{ activeClass: activeTab === 'loss' }">亏损TOP5</div>
    </div>
    <div v-show="topItemList.length > 0">
      <TopItem
        v-for="item in topItemList"
        :key="item.code"
        :item="item"
        :isloss="activeTab === 'loss'"
      />
    </div>
    <div
      v-show="topItemList.length === 0 && tab === 'share' && activeTab === 'profit'"
      class="noData"
    >
      今年以来没有盈利的股票
    </div>
    <div
      v-show="topItemList.length === 0 && tab === 'share' && activeTab === 'loss'"
      class="noData"
    >
      今年以来没有亏损的股票
    </div>
    <div
      v-show="topItemList.length === 0 && tab === 'bond' && activeTab === 'profit'"
      class="noData"
    >
      今年以来没有盈利的债券
    </div>
    <div v-show="topItemList.length === 0 && tab === 'bond' && activeTab === 'loss'" class="noData">
      今年以来没有亏损的债券
    </div>
    <div
      v-show="topItemList.length === 0 && tab === 'financial' && activeTab === 'profit'"
      class="noData"
    >
      今年以来没有盈利的理财
    </div>
    <div
      v-show="topItemList.length === 0 && tab === 'financial' && activeTab === 'loss'"
      class="noData"
    >
      今年以来没有亏损的理财
    </div>
  </div>
</template>

<script>
import TopItem from "ui/topItem.vue";
export default {
  components: { TopItem },
  data() {
    return {
      tabList: [
        { name: "share", text: "股票" },
        { name: "bond", text: "债券" },
        { name: "financial", text: "理财" },
      ],
      tab: "share",
      activeTab: "profit",
      topItemList: [],
      bond: { profit: [], loss: [] }, // 债券
      share: { profit: [], loss: [] }, // 股票
      financial: { profit: [], loss: [] }, // 理财
    };
  },
  created() {
    this.profitAndLoss();
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  methods: {
    initTopItemList(tab, type) {
      switch (tab) {
        case "bond":
          this.topItemList = type === "profit" ? this.bond.profit : this.bond.loss;
          break;
        case "share":
          this.topItemList = type === "profit" ? this.share.profit : this.share.loss;
          break;
        default:
          this.topItemList = type === "profit" ? this.financial.profit : this.financial.loss;
      }
    },
    profitAndLoss() {
      this.$apiFwgx.profitAndLoss({ custNo: this.custNo, ljFlag: 4 }).then(({ data }) => {
        const res = data.data;
        if (res) {
          let bondInfo = res.bondProfitAndLoss; // 债券
          let share = res.shareProfitAndLoss; // 股票
          let financial = res.financingProfitAndLoss; // 理财
          this.handleData(bondInfo, this.bond);
          this.handleData(share, this.share);
          this.handleData(financial, this.financial);
          this.initTopItemList(this.tab, this.activeTab);
        }
      });
    },
    handleData(type, res) {
      if (type) {
        if (type.lossTop5List && type.lossTop5List.length > 0) {
          type.lossTop5List.forEach((item) => {
            res.loss.push({
              name: item.secNm, // 证券名称
              code: item.secCd, // 证券编码
              width: item.prftBalRate, // 收益占比
              number: item.prftBal, // 收益金额
              percent: item.prftBalRate, // 收益占比
            });
          });
        }
        if (type.profitTop5List && type.profitTop5List.length > 0) {
          type.profitTop5List.forEach((item) => {
            res.profit.push({
              name: item.secNm, // 证券名称
              code: item.secCd, // 证券编码
              width: item.prftBalRate, // 收益占比
              number: item.prftBal, // 收益金额
              percent: item.prftBalRate, // 收益占比
            });
          });
        }
      }
    },
    changeType(tab) {
      this.activeTab = tab;
      this.initTopItemList(this.tab, this.activeTab);
    },
    changeTab(tab) {
      this.tab = tab;
      this.initTopItemList(this.tab, this.activeTab);
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
.activeClass {
  color: #007bf6 !important;
  font-weight: 500 !important;
}
.profitLossYear {
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
    width: 4.74rem;
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
      width: 1.56rem;
      font-weight: 500;
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  }
  .type {
    height: 0.37rem;
    line-height: 0.37rem;
    font-size: 0.26rem;
    color: #666;
    margin-top: 0.4rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    font-weight: 400;
    align-items: center;
    .line2 {
      width: 0.01rem;
      height: 0.26rem;
      margin: 0 0.3rem;
      background-color: #ccc;
    }
  }
  .noData {
    font-size: 0.28rem;
    color: #333;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
