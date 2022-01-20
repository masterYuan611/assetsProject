<template>
  <div class="assetAnalysis">
    <!--近期动态-->
    <RecentDevelop />
    <!--收益走势-->
    <EarningsTrend />
    <!--本年盈亏情况-->
    <ProfitLossYear />
    <!--资产走势-->
    <AssetTrend />
    <!--历史仓位-->
    <HistoricalPosition />
  </div>
</template>

<script>
import RecentDevelop from "./recentDevelop.vue";
import EarningsTrend from "./earingsTrend.vue";
import ProfitLossYear from "./profitLossYear.vue";
import AssetTrend from "./assetTrend.vue";
import HistoricalPosition from "./historicalPosition.vue";

export default {
  components: {
    ProfitLossYear,
    EarningsTrend,
    AssetTrend,
    HistoricalPosition,
    RecentDevelop,
  },
};
</script>

<style lang="less" scoped>
.assetAnalysis {
  overflow-y: hidden;
  width: 100%;
  box-sizing: border-box;
  background-color: #f2f3f5;
  padding: 0.2rem 0.3rem 0.4rem 0.3rem;
}
</style>
