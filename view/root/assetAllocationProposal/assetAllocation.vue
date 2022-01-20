<template>
  <proposal-wrapper title="资产配置" describe="根据客户需求制定资产配置方案" page="3">
    <template>
      <!-- 客户当前持仓信息 -->
      <div class="current-config">
        <div class="config-title">
          <span class="name">客户当前配置</span>
          <div class="detail" @click="handleDetailView">
            诊断报告<img src="images/more-right.png" />
          </div>
        </div>
        <div class="config-main">
          <div id="config-chart" style="height: 100%"></div>
        </div>
      </div>
      <div class="customize-config">
        <span class="name">资产配置方案</span>
        <div class="menu-wrapper">
          <div class="customize" v-if="isInvestmentAdvisor" @click="handleCustomLoad">
            <img src="images/customer-holdings.png" />
            <span>加载客户持仓</span>
            <img src="images/right.png" />
          </div>
          <div class="AI" @click="handleAILoad" v-if="isInvestmentAdvisor || !showLoadAI">
            <img src="images/AI-advice.png" />
            <span>加载AI建议</span>
            <img src="images/right.png" />
          </div>
        </div>
        <!-- 有投顾资格实时显示未分配权重 -->
        <van-sticky v-if="isInvestmentAdvisor">
          <div class="un-distribute">
            <div class="warning" v-if="unWeight < 0">
              <img src="images/warning.png" />
              <span>未分配权重只能为0</span>
            </div>
            未分配权重：<span :class="[unWeight < 0 ? 'un-weight' : '']">{{ unWeight }}%</span>
          </div>
        </van-sticky>
        <div class="load-ai" @click="handleAILoad" v-if="showLoadAI">
          <van-icon name="plus" color="#007BF6" size="0.34rem" />
          <span class="text">加载AI配置建议</span>
        </div>
        <template v-if="showCombination">
          <product-combination
            title="权益类"
            type="equity"
            v-model="equity.weight"
            :products.sync="equity.weightList"
            :readonly="!isInvestmentAdvisor"
            @add="handleProductAdd"
            @change="handleCombinationChange"
          />
          <product-combination
            title="固收类"
            type="fixed"
            v-model="fixed.weight"
            :products.sync="fixed.weightList"
            :readonly="!isInvestmentAdvisor"
            @add="handleProductAdd"
            @change="handleCombinationChange"
          />
          <product-combination
            style="margin-bottom: 0"
            title="现金类"
            type="cash"
            v-model="cash.weight"
            :products.sync="cash.weightList"
            :readonly="!isInvestmentAdvisor"
            @add="handleProductAdd"
            @change="handleCombinationChange"
          />
        </template>
      </div>
      <!-- 产品搜索 -->
      <van-popup v-model="showSearch" position="top" :style="{ width: '100%', height: '100%' }">
        <product-search
          :type="searchType"
          @select="handleProductSelect"
          @cancel="handleSearchCancel"
        ></product-search>
      </van-popup>
    </template>
    <template #footer>
      <div class="draft" @click="handleDraftSaveClick">
        <img src="images/draft-save.png" />
        <span>保存草稿</span>
      </div>
      <span class="btn last" @click="handleLastStep">上一步</span>
      <span class="btn" :class="[disabled ? 'disabled' : '']" @click="handlePreview">
        生成报告
        <van-loading v-if="loading" size="0.34rem" style="margin-left: 0.1rem" />
      </span>
    </template>
  </proposal-wrapper>
</template>

<script>
import ProposalWrapper from "./proposalWrapper.vue";
import ProductCombination from "./productCombination.vue";
import ProductSearch from "./productSearch.vue";
import { mapGetters, mapMutations } from "vuex";
import * as echarts from "echarts";

export default {
  components: {
    ProposalWrapper,
    ProductCombination,
    ProductSearch,
  },
  data() {
    return {
      showSearch: false, // 显示搜索弹窗
      searchType: "", // 当前搜索产品类型
      equity: {
        weight: "0",
        weightIds: [],
        weightList: [],
      }, // 权益类
      fixed: {
        weight: "0",
        weightIds: [],
        weightList: [],
      }, // 固收类
      cash: {
        weight: "0",
        weightIds: [],
        weightList: [],
      }, // 现金类
      loading: false, // 生成报告按钮状态
      sensorsInfo: {}, // 埋点信息
    };
  },
  computed: {
    ...mapGetters(["draft", "custNo", "isInvestmentAdvisor", "custTel", "custNm"]),
    // 未分配权重
    unWeight() {
      return (
        100 -
        parseFloat(this.equity.weight || 0) -
        parseFloat(this.fixed.weight || 0) -
        parseFloat(this.cash.weight || 0)
      );
    },
    // 生成报告按钮是否禁用
    disabled() {
      return (
        this.unWeight !== 0 ||
        [...this.equity.weightList, ...this.fixed.weightList, ...this.cash.weightList].length ===
          0 ||
        (this.equity.weight == 0 && this.equity.weightList.length > 0) ||
        (this.fixed.weight == 0 && this.fixed.weightList.length > 0) ||
        (this.cash.weight == 0 && this.cash.weightList.length > 0)
      );
    },
    // 是否显示加载AI主入口(非投顾且产品列表为空时显示)
    showLoadAI() {
      return (
        !this.isInvestmentAdvisor &&
        [...this.equity.weightList, ...this.fixed.weightList, ...this.cash.weightList].length === 0
      );
    },
    // 是否显示产品列表
    showCombination() {
      if (this.isInvestmentAdvisor) {
        return true;
      } else {
        return !this.showLoadAI;
      }
    },
  },
  created() {
    this.backfill();
  },
  mounted() {
    setTimeout(() => {
      this.handleConfigChart();
    }, 0);
  },
  methods: {
    ...mapMutations("proposal", ["setDraft"]),
    // 数据回显
    backfill() {
      const {
        equityWeight = 0,
        equityWeightIds = [],
        equityWeightList = [],
        fixedWeight = 0,
        fixedWeightIds = [],
        fixedWeightList = [],
        cashWeight = 0,
        cashWeightIds = [],
        cashWeightList = [],
      } = this.draft;
      this.equity = {
        weight: `${equityWeight || 0}`,
        weightIds: equityWeightIds,
        weightList: equityWeightList || [],
      };
      this.fixed = {
        weight: `${fixedWeight || 0}`,
        weightIds: fixedWeightIds,
        weightList: fixedWeightList || [],
      };
      this.cash = {
        weight: `${cashWeight || 0}`,
        weightIds: cashWeightIds,
        weightList: cashWeightList || [],
      };
    },
    // 当前持仓图例
    getFormattedLegend(name, configData) {
      const { value } = configData.find((item) => item.name === name);
      switch (name) {
        case "rightsMktValPer":
          return `权益类:  ${value}%`;
        case "fixedMktValPer":
          return `固收类:  ${value}%`;
        case "cashMktValPer":
          return `现金类:  ${value}%`;
        case "otherMktValPer":
          return `其他:  ${value}%`;
      }
    },
    // 当前持仓环形图
    async handleConfigChart() {
      const data = await this.getAssetData();
      if (!data) return;
      const { rightsMktValPer, fixedMktValPer, cashMktValPer, otherMktValPer } = data;
      // 环形图各模块数据
      let configData = [
        {
          value: parseFloat(rightsMktValPer.slice(0, -1)).toFixed(2),
          name: "rightsMktValPer",
          title: "权益类",
        },
        {
          value: parseFloat(fixedMktValPer.slice(0, -1)).toFixed(2),
          name: "fixedMktValPer",
          title: "固收类",
        },
        {
          value: parseFloat(cashMktValPer.slice(0, -1)).toFixed(2),
          name: "cashMktValPer",
          title: "现金类",
        },
        {
          value: parseFloat(otherMktValPer.slice(0, -1)).toFixed(2),
          name: "otherMktValPer",
          title: "其他",
        },
      ];
      let option = {
        tooltip: {
          trigger: "item",
          formatter: ({ data }) => {
            const { title, value } = data;
            return `${title}: ${value}%`;
          },
        },
        legend: {
          icon: "circle",
          orient: "vertical",
          top: "center",
          right: "27%",
          itemWidth: 6,
          itemHeight: 6,
          formatter: (name) => {
            return this.getFormattedLegend(name, configData);
          },
        },
        color: ["#007BF6", "#F7B501", "#34C2FC", "#4FDEB2"],
        series: [
          {
            name: "客户当前配置",
            type: "pie",
            center: ["17%", "50%"],
            radius: ["40%", "67%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: [...configData],
          },
        ],
      };
      const chartDom = document.getElementById("config-chart");
      let configChart = echarts.init(chartDom);
      configChart.setOption(option);
    },
    // 上一步
    handleLastStep() {
      this.$router.push("/root/assetAllocationProposal/investmentNeeds");
    },
    // 取消搜索
    handleSearchCancel() {
      this.showSearch = false;
    },
    // 添加产品到相应类型
    async handleProductSelect(item, type) {
      let product = JSON.parse(JSON.stringify(item));
      await this.handleHoldCheck(product);
      this[type].weightList.push(product);
      this.handleCache();
    },
    // 产品组合变化
    handleCombinationChange() {
      this.handleCache();
    },
    // 缓存页面操作
    handleCache() {
      this.setDraft({
        ...this.draft,
        ...this.getPageData(),
      });
    },
    // 添加各类型产品
    handleProductAdd(type) {
      this.showSearch = true;
      this.searchType = type;
    },
    // 查看诊断报告
    handleDetailView() {
      this.$router.push(`/root/customerDetail`);
    },
    // 加载AI方案
    handleAILoad() {
      const { expectedIncome, riskTolerance } = this.draft;
      this.$router.push(
        `/root/assetAllocation/assetAllocation?id=${this.custNo}&annualizedRateOfReturnPer=${expectedIncome}&maximumRiskTolerancePer=${riskTolerance}&type=3`,
      );
    },
    // 检查是否包含盈享利组合
    checkIsContainCombination() {
      const { weightList: equityWeightList } = this.equity;
      const { weightList: fixedWeightList } = this.fixed;
      const { weightList: cashWeightList } = this.cash;
      const combination = [...equityWeightList, ...fixedWeightList, ...cashWeightList].filter(
        (item) => item.prodCate === "1",
      );
      return !!combination.length;
    },
    // 生成报告并拿到相应地址后跳到报告预览页面
    async handlePreview() {
      if (this.disabled) return;
      if (!this.checkIsContainCombination()) {
        this.$toast.fail({
          message: "资产配置方案，一定要包含盈享利组合",
          duration: 2000,
        });
        return;
      }
      this.loading = true;
      const reportCode = await this.getReportCode();
      const saveDraftSuccess = await this.handleDraftSave(reportCode);
      if (!saveDraftSuccess) return;
      const { filePath, staffId, brhNo } = await this.getReportPath(reportCode);
      if (!filePath) return;
      this.sensorsInfo = { reportCode, staffId, brhNo };
      this.handleProposalSensors();
      localStorage.setItem("filePath", filePath);
      this.loading = false;
      this.$router.push(
        `/root/createPDFreport/reportPreview?id=${reportCode}&custNo=${this.custNo}&type=200&custNm=${this.custNm}&custTel=${this.custTel}&staffId=${staffId}&brhNo=${brhNo}`,
      );
    },
    // 生成报告按钮埋点
    handleProposalSensors() {
      const { reportCode, staffId, brhNo } = this.sensorsInfo;
      this.sensors.track("PageClick", {
        first_module: "企微手机端", //一级模块
        second_module: "资配建议书", //二级模块
        third_module: "资配建议书", //三级模块
        page_name: "资产配置页面", //页面名称
        button_area: "底部", //按钮区域
        button_name: "生成报告", //按钮名称
        content_id: staffId, // 员工id
        content_id2: this.custNo, // 客户号
        content_title: "资配配置建议书", //客户报告标题
        content_title2: reportCode, // 客户报告id(报告编号)
        content_type: "201", // 报告类型
        content_id3: this.custNm, //客户姓名
        content_title3: brhNo, // 部门号
        content_type2: this.custTel, // 手机号
        content: " ", // 流水号
      });
    },
    // 直接保存草稿
    handleDraftSaveClick() {
      this.handleDraftSave();
    },
    // 获取页面配置数据
    getPageData() {
      const { weight: equityWeight, weightList: equityWeightList } = this.equity;
      const { weight: fixedWeight, weightList: fixedWeightList } = this.fixed;
      const { weight: cashWeight, weightList: cashWeightList } = this.cash;
      const equityWeightIds = equityWeightList.map(({ prodCate, prodCode, prodCodeDesc }) => ({
        secType: prodCate,
        secCd: prodCode,
        prodCodeDesc,
      }));
      const fixedWeightIds = fixedWeightList.map(({ prodCate, prodCode, prodCodeDesc }) => ({
        secType: prodCate,
        secCd: prodCode,
        prodCodeDesc,
      }));
      const cashWeightIds = cashWeightList.map(({ prodCate, prodCode, prodCodeDesc }) => ({
        secType: prodCate,
        secCd: prodCode,
        prodCodeDesc,
      }));
      return {
        equityWeight,
        fixedWeight,
        cashWeight,
        equityWeightIds,
        fixedWeightIds,
        cashWeightIds,
        equityWeightList,
        fixedWeightList,
        cashWeightList,
      };
    },
    // 保存草稿(有reportCode时是生成报告，否则是保存草稿)
    async handleDraftSave(reportCode) {
      const params = {
        ...this.draft,
        ...this.getPageData(),
        pageCode: 3,
        assetType: reportCode ? "1" : "0",
        reportCode,
      };
      const flag = await this.handleDraftUpdate(params);
      if (!flag) return;
      this.setDraft(params);
      if (reportCode) {
        return true;
      } else {
        this.$router.push("/root/home");
      }
    },
    // 更新草稿
    handleDraftUpdate(params) {
      return this.$apiFwgx.updateDraft(params).then(({ data }) => {
        if (data.success) {
          return true;
        }
        this.$toast.fail({
          message: data.retMsg,
          duration: 2000,
        });
      });
    },
    // 加载客户持仓
    handleCustomLoad() {
      this.$apiFwgx
        .getCustomRaisedfunds({
          custNo: this.custNo,
        })
        .then(({ data }) => {
          if (data.success) {
            if (!data.data) {
              this.$toast.fail({
                message: "无持仓信息",
                duration: 2000,
              });
              return;
            }
            const { bondProductPortfolioVO, cashProductPortfolioVO, equityProductPortfolioVO } =
              data.data;
            this.equity.weightList = equityProductPortfolioVO ? [...equityProductPortfolioVO] : [];
            this.fixed.weightList = bondProductPortfolioVO ? [...bondProductPortfolioVO] : [];
            this.cahs.weightList = cashProductPortfolioVO ? [...cashProductPortfolioVO] : [];
          }
        });
    },
    // 获取报告编码
    getReportCode() {
      return this.$apiFwgx
        .getCode({
          custNo: this.custNo,
          reportMode: "1", //1：员工端 2：客户端
          reportType: "2", //1：《个人账户诊断报告》2：《资产配置建议书》
        })
        .then(({ data }) => {
          if (data.success) {
            return data.data;
          }
        });
    },
    // 获取报告地址
    getReportPath(reportCode) {
      return this.$apiFwgx
        .Previewreport({
          custNo: this.custNo,
          reportCode,
          fileType: "201", // 100：pdf理财报告,101：h5理财报告,200:资产配置建议书PDF,201:资产配置建议书H5
        })
        .then(({ data }) => {
          if (data.success) {
            return data.data;
          }
        });
    },
    // 判断持有or新增
    handleHoldCheck(item) {
      const { prodCode, prodCate } = item;
      return this.$apiFwgx
        .getcheckHold({
          custNo: this.custNo,
          secCd: prodCode, // 代码
          secType: prodCate, // 类别：0-股票 1债券 2.理财
        })
        .then(({ data }) => {
          if (data.success) {
            item.hold = data.data;
          }
        });
    },
    // 客户当前持仓
    getAssetData() {
      return this.$apiFwgx.getAssetData({ custNo: this.custNo }).then(({ data }) => {
        if (data.success) {
          return data.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.current-config {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0.3rem;
  padding: 0.5rem 0.3rem;
  height: 4.2rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    #ffffff 9%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border-radius: 0.1rem;
  border: 2px solid #ffffff;
  .config-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.3rem;
    .name {
      height: 0.5rem;
      font-size: 0.36rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.5rem;
    }
    .detail {
      display: flex;
      align-items: center;
      height: 0.4rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #007bf6;
      line-height: 0.4rem;
      img {
        width: 0.28rem;
        height: 0.28rem;
        margin-left: 0.1rem;
      }
    }
  }
  .config-main {
    flex: 1;
  }
}
.customize-config {
  display: flex;
  flex-direction: column;
  margin: 0.2rem 0.3rem 0;
  padding: 0.5rem 0.3rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    #ffffff 9%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border-radius: 0.1rem;
  border: 2px solid #ffffff;
  .name {
    font-size: 0.36rem;
    font-weight: 500;
    color: #333333;
    line-height: 0.5rem;
  }
  .menu-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 0.3rem 0 0.6rem;
    .customize,
    .AI {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 3rem;
      height: 0.7rem;
      padding: 0 0.2rem 0 0.16rem;
      background: #f7f8fa;
      border-radius: 0.04rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #333333;
      img:first-child {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.1rem;
      }
      img:last-child {
        width: 0.2rem;
        height: 0.2rem;
        margin-left: auto;
      }
    }
  }
  /deep/ .van-sticky--fixed {
    .un-distribute {
      padding-right: 0.6rem;
      box-shadow: 0px 1px 0px 0px #ebebeb;
      line-height: 1rem;
    }
  }
  .warning {
    display: flex;
    align-items: center;
    margin-right: 0.2rem;
    img {
      width: 0.28rem;
      height: 0.28rem;
      margin-right: 0.1rem;
    }
    span {
      font-size: 0.28rem;
      font-weight: 400;
      color: #e72b2b;
    }
  }
  .un-weight {
    color: #e72b2b;
  }
  .un-distribute {
    display: flex;
    justify-content: flex-end;
    font-size: 0.32rem;
    font-weight: 400;
    color: #333333;
    line-height: 0.45rem;
    text-align: right;
    margin-bottom: 0.3rem;
    background: #fefefe;
  }
  .load-ai {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    margin: 0.84rem auto 1.05rem;
    border: 1px dashed rgba(0, 123, 246, 0.3);
    color: #007bf6;
    .text {
      margin-top: 0.3rem;
      font-size: 0.28rem;
    }
  }
}
.draft {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.4rem;
  img {
    width: 0.4rem;
    height: 0.4rem;
    margin-bottom: 0.1rem;
  }
  span {
    font-size: 0.2rem;
    font-weight: 400;
    color: #666666;
    line-height: 0.2rem;
  }
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.7rem;
  height: 0.8rem;
  border-radius: 0.46rem;
  font-size: 0.34rem;
  font-weight: 500;
  line-height: 0.8rem;
  text-align: center;
  &.disabled {
    opacity: 0.3;
  }
}
.btn.last {
  border: 1px solid #007bf6;
  color: #007bf6;
}
.btn:last-child {
  background: linear-gradient(90deg, #00aff6 0%, #007bf6 100%);
  color: #ffffff;
}
</style>
