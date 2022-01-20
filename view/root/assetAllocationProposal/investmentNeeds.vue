<template>
  <proposal-wrapper title="投资需求" describe="指定客户投资需求" page="2">
    <template>
      <!-- 基本信息 -->
      <div class="customer-info">
        <div class="info-title">
          <img src="images/customer-info.png" />
          <span>客户基本信息</span>
        </div>
        <div class="info-main">
          <div class="risk">
            <span>风险等级</span>
            <span>{{ riskLvl }}</span>
          </div>
          <div class="age">
            <span>年龄</span>
            <span>{{ custAge }}</span>
          </div>
          <div class="assets">
            <span>金融资产</span>
            <span>{{ totAst }}</span>
          </div>
        </div>
      </div>
      <!-- 投资需求 -->
      <div class="customer-needs">
        <div class="needs-title">
          <img src="images/investment-needs.png" />
          <span>客户投资需求</span>
        </div>
        <van-cell-group :border="false">
          <van-field
            v-model="tempNeeds.planningAsset"
            @input="
              (value) => {
                handleInputCache('planningAsset', value);
              }
            "
            label="规划资产"
            input-align="right"
            type="digit"
            placeholder="请输入"
          >
            <template #extra>
              <span class="extra">万</span>
            </template>
          </van-field>
          <van-field
            v-model="enInvestTermDesc"
            label="投资期限"
            input-align="right"
            disabled
            placeholder=""
          >
            <template #extra>
              <span class="extra">年</span>
            </template>
          </van-field>
          <van-field
            v-model="tempNeeds.mobility"
            @input="
              (value) => {
                handleInputCache('mobility', value);
              }
            "
            label="流动性"
            input-align="right"
            type="digit"
            placeholder="请输入"
          >
            <template #extra>
              <span class="extra">万</span>
            </template>
          </van-field>
          <van-field
            v-model="tempNeeds.expectedIncome"
            @input="
              (value) => {
                handleInputCache('expectedIncome', value);
              }
            "
            label="预期收益"
            input-align="right"
            type="digit"
            placeholder="请输入"
          >
            <template #extra>
              <span class="extra">%</span>
            </template>
          </van-field>
          <van-field
            v-model="tempNeeds.riskTolerance"
            label="最大可承受风险"
            input-align="right"
            disabled
            placeholder=""
          >
            <template #extra>
              <span class="extra">%</span>
            </template>
          </van-field>
        </van-cell-group>
      </div>
    </template>
    <template #footer>
      <div class="draft" @click="handleDraftSave">
        <img src="images/draft-save.png" />
        <span>保存草稿</span>
      </div>
      <span class="btn last" @click="handleLastStep">上一步</span>
      <span class="btn" @click="handleNextStep">下一步</span>
    </template>
  </proposal-wrapper>
</template>

<script>
import ProposalWrapper from "./proposalWrapper.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    ProposalWrapper,
  },
  data() {
    return {
      tempNeeds: {},
      enInvestTermDesc: "", // 投资期限描述
      totAst: "", // 总资产
      custAge: "", // 年龄
      riskLvl: "", // 风险等级
    };
  },
  computed: {
    ...mapGetters(["draft", "custNo"]),
  },
  created() {
    const { planningAsset, termAssets, mobility, expectedIncome, riskTolerance } = this.draft;
    this.tempNeeds = { planningAsset, termAssets, mobility, expectedIncome, riskTolerance };
    this.getUseBasicInfo();
    this.getCustomPreference();
  },
  methods: {
    ...mapMutations("proposal", ["setDraft"]),
    // 上一步
    handleLastStep() {
      this.$router.push("/root/assetAllocationProposal/investmentAdvice");
    },
    // 缓存页面操作
    handleInputCache(key, value) {
      // 预期收益最大100%
      if (key === "expectedIncome" && parseInt(value) > 100) {
        this.tempNeeds.expectedIncome = "100";
        value = "100";
      }
      this.setDraft({ ...this.draft, [key]: value });
    },
    // 输入值校验
    handleFormCheck() {
      const { planningAsset, mobility, expectedIncome } = this.tempNeeds;
      if (!planningAsset) {
        this.$toast.fail({
          message: "规划资产不能为空",
          duration: 2000,
        });
        return;
      }
      if (planningAsset === "0") {
        this.$toast.fail({
          message: "规划资产必须大于零",
          duration: 2000,
        });
        return;
      }
      if (!mobility) {
        this.$toast.fail({
          message: "流动性不能为空",
          duration: 2000,
        });
        return;
      }
      if (mobility === "0") {
        this.$toast.fail({
          message: "流动性必须大于零",
          duration: 2000,
        });
        return;
      }
      if (parseInt(mobility) > parseInt(planningAsset)) {
        this.$toast.fail({
          message: "流动性不应超过规划资产",
          duration: 2000,
        });
        return;
      }
      if (!expectedIncome) {
        this.$toast.fail({
          message: "预期收益不能为空",
          duration: 2000,
        });
        return;
      }
      return true;
    },
    // 保存草稿
    handleDraftSave() {
      this.handleNextStep("temp");
    },
    // 下一步
    async handleNextStep(type) {
      if (!this.handleFormCheck()) return;
      const { planningAsset, termAssets, mobility, expectedIncome, riskTolerance } = this.tempNeeds;
      const draft = {
        ...this.draft,
        planningAsset: parseInt(planningAsset),
        termAssets,
        mobility: parseInt(mobility),
        expectedIncome,
        riskTolerance,
        pageCode: 2,
        assetType: "0",
      };
      const flag = await this.handleDraftUpdate(draft);
      if (!flag) return;
      this.setDraft(draft);
      if (type === "temp") {
        this.$router.push("/root/home");
      } else {
        this.$router.push("/root/assetAllocationProposal/assetAllocation");
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
    // 获取客户偏好
    getCustomPreference() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.$apiFwgx
        .getCustomPreference({ custNo: this.custNo })
        .then(({ data }) => {
          if (data.success) {
            const { enInvestTerm, enMaxDeficitRate } = data.data;
            this.tempNeeds.termAssets = enInvestTerm.split(",");
            this.tempNeeds.riskTolerance = enMaxDeficitRate;
            if (enInvestTerm.includes("1")) {
              this.enInvestTermDesc = "0-1";
            } else if (enInvestTerm.includes("2")) {
              this.enInvestTermDesc = "1-5";
            } else if (enInvestTerm.includes("3")) {
              this.enInvestTermDesc = "5";
            } else {
              this.enInvestTermDesc = "";
            }
          }
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    // 获取用户基本信息、账户信息
    getUseBasicInfo() {
      return this.$apiFwgx.getUseBasicInfo({ custNo: this.custNo }).then(({ data }) => {
        if (data.success) {
          const { accountInfo, userInfo } = data.data;
          this.custAge = userInfo.custAge;
          let total = parseInt(accountInfo.totAst);
          // 千分位展示
          if (total >= 100000000) {
            total = parseInt(total / 100000000);
            this.totAst = total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + "亿";
          } else if (total >= 10000) {
            total = parseInt(total / 10000);
            this.totAst = total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + "万";
          } else {
            this.totAst = total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + "元";
          }
          // 取括号内的风险等级描述
          if (userInfo.riskLvl) {
            userInfo.riskLvl.match(/\((.+)\)/g);
            this.riskLvl = RegExp.$1;
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.customer-info {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0.3rem;
  padding: 0.5rem 0.3rem 0.4rem;
  height: 3.25rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    #ffffff 9%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border-radius: 0.1rem;
  border: 0.02rem solid #ffffff;
  .info-title {
    display: flex;
    align-items: center;
    height: 0.48rem;
    font-size: 0.34rem;
    font-weight: 500;
    color: #333333;
    line-height: 0.48rem;
    img {
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.1rem;
    }
  }
  .info-main {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 1.55rem;
    padding: 0.3rem 0.5rem;
    background: #f8f9fa;
    border-radius: 0.02rem;
    .risk,
    .age,
    .assets {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      span:first-child {
        height: 0.37rem;
        font-size: 0.26rem;
        font-weight: 400;
        color: #666666;
        line-height: 0.37rem;
      }
      span:last-child {
        height: 0.48rem;
        font-size: 0.34rem;
        font-weight: 500;
        color: #007bf6;
        line-height: 0.48rem;
      }
    }
  }
}
.customer-needs {
  box-sizing: border-box;
  height: 7.35rem;
  margin: 0.2rem 0.3rem 0;
  padding: 0.5rem 0.3rem 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    #ffffff 9%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border-radius: 0.1rem;
  border: 2px solid #ffffff;
  .needs-title {
    display: flex;
    align-items: center;
    height: 0.48rem;
    margin-bottom: 0.2rem;
    font-size: 0.34rem;
    font-weight: 500;
    color: #333333;
    line-height: 0.48rem;
    img {
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.1rem;
    }
  }
  /deep/ .van-cell-group {
    .van-cell {
      display: flex;
      align-items: center;
      padding: 0;
      height: 1.1rem;
      font-size: 0.3rem;
      .extra {
        color: #333333;
        margin-left: 0.2rem;
      }
      &.van-field--disabled {
        .extra {
          color: #666666;
        }
      }
      &::after {
        left: 0;
        right: 0;
      }
      .van-cell__title {
        font-size: 0.3rem;
        font-weight: 400;
        color: #333333;
      }

      .van-field__label {
        width: 8em;
      }
      .van-field__control {
        color: #333333;
      }
      .van-field__control:disabled {
        color: #666666;
        -webkit-text-fill-color: #666666;
      }
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
  width: 2.7rem;
  height: 0.8rem;
  border-radius: 0.46rem;
  font-size: 0.34rem;
  font-weight: 500;
  line-height: 0.8rem;
  text-align: center;
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
