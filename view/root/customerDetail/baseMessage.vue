<template>
  <div class="basic-infor">
    <!-- 个人信息 -->
    <div class="model-card personal-info">
      <!-- 男：icon-male.png -->
      <h3 class="titel-box">
        <span class="titel">{{ userInfo.custNm }}</span>
        <span
          :class="[userInfo.custGndr === '男' ? 'gender-icon-male' : 'gender-icon-female']"
        ></span>
      </h3>
      <div class="tab-info flex">
        <div class="single">
          <span class="tab-header">客户编号</span>
          <span class="tab-msg">{{ userInfo.custNo }}</span>
        </div>
        <div class="single">
          <span class="tab-header">出生日期</span>
          <span class="tab-msg">{{ userInfo.custBirthDate ? userInfo.custBirthDate : "-" }}</span>
        </div>
        <div class="single">
          <span class="tab-header">客户级别</span>
          <span class="tab-msg">{{ userInfo.custLvl }}</span>
        </div>
        <div class="single">
          <span class="tab-header">风险级别</span>
          <span class="tab-msg">{{ userInfo.riskLvl2 }}</span>
        </div>
      </div>
    </div>
    <!-- 账户信息 -->
    <div v-if="accountInfo" class="model-card account-info">
      <div class="flex titel-box">
        <h3 class="titel">账户信息</h3>
        <span class="new-time"> 数据更新于：{{ accountInfo.updateDate }}</span>
      </div>
      <div class="tab-info">
        <div>
          <div class="single">
            <span class="tab-header">总资产</span>
            <div class="total-assets">{{ accountInfo.totAst | dealSumMoney }}</div>
          </div>
          <div class="flex total">
            <div class="single">
              <div class="tab-header">资金余额</div>
              <span class="tab-msg">{{ accountInfo.cash | dealSumMoney }}</span>
            </div>
            <div class="single">
              <div class="tab-header">持仓市值</div>
              <span class="tab-msg">{{ accountInfo.secMktVal | dealSumMoney }}</span>
            </div>
          </div>
        </div>
        <div class="account-profit-loss">
          <div class="single">
            <span class="tab-header">近三月累计盈亏</span>
            <div
              :class="[
                accountInfo.prftBal > 0
                  ? 'total-assets , color-red'
                  : accountInfo.prftBal < 0
                  ? 'total-assets , color-green'
                  : 'total-assets',
              ]"
            >
              {{ accountInfo.prftBal | dealSumMoney }}
            </div>
          </div>
          <div class="tab-info flex">
            <div class="single">
              <div class="tab-header">股票盈亏</div>
              <span
                :class="[
                  accountInfo.stkPrftBal > 0
                    ? 'color-red'
                    : accountInfo.stkPrftBal < 0
                    ? 'color-green'
                    : 'tab-msg',
                ]"
                >{{ accountInfo.stkPrftBal | dealSumMoney }}</span
              >
            </div>
            <div class="single">
              <div class="tab-header">债券盈亏</div>
              <span
                :class="[
                  accountInfo.bondPrftBal > 0
                    ? 'color-red'
                    : accountInfo.bondPrftBal < 0
                    ? 'color-green'
                    : 'tab-msg',
                ]"
                >{{ accountInfo.bondPrftBal | dealSumMoney }}</span
              >
            </div>
            <div class="single">
              <div class="tab-header">理财盈亏</div>
              <span
                :class="[
                  accountInfo.prodPrftBal > 0
                    ? 'color-red'
                    : accountInfo.prodPrftBal < 0
                    ? 'color-green'
                    : 'tab-msg',
                ]"
                >{{ accountInfo.prodPrftBal | dealSumMoney }}</span
              >
            </div>
            <div class="single">
              <div class="tab-header">其他盈亏</div>
              <span
                :class="[
                  accountInfo.othPrftBal > 0
                    ? 'color-red'
                    : accountInfo.othPrftBal < 0
                    ? 'color-green'
                    : 'tab-msg',
                ]"
                >{{ accountInfo.othPrftBal | dealSumMoney }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 当前持仓 -->
    <div class="model-card account-position">
      <div class="flex titel-box">
        <h3 class="titel">当前持仓</h3>
        <span v-if="currentList.updateDate" class="new-time">
          数据更新于：{{ currentList.updateDate }}</span
        >
      </div>
      <!-- 当前持仓内容 -->
      <div v-if="currentListStock || currentListBond || currentListFinancial">
        <!-- 分类 -->
        <div v-if="tradingBehaviorNum >= 2" class="tab-box">
          <van-tabs
            type="card"
            v-model="activeName"
            background="#f2f3f5"
            title-inactive-color="#666"
            title-active-color="#007BF6"
            color="#fff"
            @click="onClickPosition"
          >
            <van-tab v-if="currentListStock" title="股票" name="stock"> </van-tab>
            <van-tab v-if="currentListBond" title="债券" name="bond"></van-tab>
            <van-tab v-if="currentListFinancial" title="理财" name="manage"></van-tab>
          </van-tabs>
        </div>
        <div class="account-position-info">
          <div class="position-title flex-nowrap">
            <span class="name">名称</span>
            <span class="yesday-earn">市值/昨日收益</span>
            <span class="hold-income">持有收益/率</span>
          </div>
          <div class="position-body">
            <div
              v-for="(item, index) in currentList.currentPositionList"
              :key="index"
              class="strip"
            >
              <div class="strip-top flex-nowrap">
                <div class="name">
                  <span>{{ item.secNm }}</span>
                </div>
                <div class="yesday-earn">
                  <div
                    :style="[
                      { fontSize: item.secMktVal.toString().length > 9 ? '0.24rem' : '0.28rem' },
                    ]"
                  >
                    {{ item.secMktVal | dealSumMoney }}
                  </div>
                </div>
                <div class="hold-income">
                  <div
                    :style="[
                      { fontSize: item.prftBal.toString().length > 8 ? '0.24rem' : '0.28rem' },
                      { letterSpacing: item.prftBal.toString().length > 12 ? '-0.01rem' : '0' },
                    ]"
                    :class="[
                      item.prftBal > 0
                        ? 'color-red'
                        : item.prftBal < 0
                        ? 'color-green'
                        : 'color-back',
                    ]"
                  >
                    {{ item.prftBal | dealSumMoney }}
                  </div>
                </div>
              </div>
              <div class="strip-bot flex-nowrap">
                <div class="small-box">
                  <span>{{ item.secCd }}</span>
                  <span v-if="item.originalType" class="small-tip">{{ item.originalType }}</span>
                </div>
                <div
                  :class="[
                    item.lastPrftBal > 0
                      ? 'yesday-earn color-red'
                      : item.lastPrftBal < 0
                      ? 'yesday-earn color-green'
                      : 'yesday-earn color-back',
                  ]"
                >
                  {{ item.lastPrftBal | dealSumMoney }}
                </div>
                <div
                  :class="[
                    parseFloat(item.yldRate) > 0
                      ? 'hold-income color-red'
                      : parseFloat(item.yldRate) < 0
                      ? 'hold-income color-green'
                      : 'hold-income color-back',
                  ]"
                >
                  {{ item.yldRate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 空状态样式 -->
      <div v-else class="no-data">
        <img class="no-data-img" src="images/no-data.png" />
        <p class="no-data-txt">当前无持仓</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "baseMessage",
      activeName: "stock",
      loading: false,
      finished: true,
      userInfo: {}, //用户基本信息
      accountInfo: {}, // 账户信息
      currentList: {}, // 当前持仓渲染数据源
      currentListStock: null, //股票obj
      currentListBond: null, //债券obj
      currentListFinancial: null, //理财obj
      tradingBehaviorNum: 0, // tab个数
      fontSize: 28, // 当前持仓数据字号
    };
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  created() {
    // 用户信息
    this.getUseBasicInfo();
    // 当前持仓
    this.getAllCurrentPosition();
  },
  methods: {
    handleDataLoad() {},
    // 用户基本信息
    getUseBasicInfo() {
      this.$apiFwgx
        .getUseBasicInfo({
          custNo: this.custNo, //客户号
        })
        .then((res) => {
          console.log("数据", res);
          const userInfoList = JSON.parse(JSON.stringify(res.data.data));
          this.userInfo = userInfoList.userInfo;
          this.accountInfo = userInfoList.accountInfo;
          if (!this.userInfo.riskLvl2 || this.userInfo.riskLvl2.indexOf("默认") != -1) {
            this.userInfo.riskLvl2 = "-";
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 当前持仓tab
    onClickPosition(name) {
      switch (name) {
        case "stock":
          this.currentList = this.currentListStock;
          break;
        case "bond":
          this.currentList = this.currentListBond;
          break;
        case "manage":
          this.currentList = this.currentListFinancial;
          break;
      }
    },
    // 当前持仓
    getAllCurrentPosition() {
      this.$apiFwgx
        .getAllCurrentPosition({
          custNo: this.custNo, //客户号
        })
        .then((res) => {
          console.log("getAllCurrentPosition数据-all", res);
          const allCurrentList = JSON.parse(JSON.stringify(res.data.data));
          allCurrentList.forEach((item) => {
            console.log("allCurrentList.item", item);

            switch (item.secType) {
              case "0":
                this.currentListStock = item;
                break;
              case "1":
                this.currentListBond = item;
                break;
              case "2":
                this.currentListFinancial = item;
                break;
            }
            if (this.currentListStock) {
              this.currentList = this.currentListStock;
            } else if (this.currentListBond) {
              this.currentList = this.currentListBond;
            } else {
              this.currentList = this.currentListFinancial;
            }
          });
          // tab是否展示
          let num = 0;
          if (this.currentListStock) {
            num += 1;
          }
          if (this.currentListBond) {
            num += 1;
          }
          if (this.currentListFinancial) {
            num += 1;
          }
          this.tradingBehaviorNum = num;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>

<style lang="less" scope>
.basic-infor {
  padding: 0.001rem 0.3rem 0.4rem;
  background: #f2f3f5;
  font-weight: 400;
  line-height: 1;
  // 公共样式
  .flex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .flex-nowrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    word-break: break-all;
  }
  .model-card {
    position: relative;
    margin-top: 0.2rem;
    padding: 0 0.3rem 0.4rem;
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
    .new-time {
      font-size: 0.24rem;
      color: #999;
    }
  }
  .titel-box {
    padding-top: 0.5rem;
    font-size: 0.24rem;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #999;
  }
  .titel {
    font-size: 0.32rem;
    font-weight: 600;
    font-family: PingFangSC, PingFangSC-Semibold;
    color: #333;
  }
  .tab-info {
    margin-top: 0.1rem;
    .single {
      margin-top: 0.3rem;
      width: 50%;
      text-align: left;
      font-size: 0.28rem;
      font-family: PingFangSC, PingFangSC-Medium;
    }
    .total-assets {
      font-size: 0.36rem;
      margin-top: 0.05rem;
      font-weight: 500;
    }
  }
  .tab-header {
    color: #999;
    margin-right: 0.2rem;
    margin-bottom: 0.06rem;
    font-family: PingFangSC, PingFangSC-Regular;
  }
  .tab-msg {
    color: #333;
    font-weight: 500;
  }
  .color-red {
    color: #e72b2b;
    font-weight: 500;
  }
  .color-green {
    color: #16a043;
    font-weight: 500;
  }
  .color-back {
    color: #666;
    font-weight: 500;
  }
  // 个人信息
  .personal-info {
    .gender-icon-male {
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      margin-left: 0.1rem;
      position: relative;
      top: 0.02rem;
      background: url("../../../images/icon-male.png") no-repeat;
      background-size: 100%;
    }
    .gender-icon-female {
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      margin-left: 0.1rem;
      position: relative;
      top: 0.02rem;
      background: url("../../../images/icon-female.png") no-repeat;
      background-size: 100%;
    }
  }
  // 账户信息
  .account-info {
    .total {
      margin-top: 0.25rem;
      text-align: left;
      font-size: 0.28rem;
      .single {
        margin-top: 0;
      }
    }
    .account-profit-loss {
      border-top: 0.01rem solid #e6e6e6;
      margin-top: 0.4rem;
      padding-top: 0.1rem;
    }
  }
  // 当前持仓
  .account-position {
    padding-bottom: 0.2rem;
    // tab样式调整
    .tab-box {
      margin-top: 0.4rem;
      text-align: center;
      line-height: 0 !important;
      .van-tabs.van-tabs--card {
        display: inline-block !important;
      }
      .van-tabs__nav {
        margin: 0;
        border: 0.02rem solid #f2f3f5 !important;
      }
      .van-tab {
        font-size: 0.26rem;
        color: #666;
        border: 0.01rem solid transparent !important;
        margin: none !important ;
        width: 1.56rem;
        text-align: center;
        display: inline-block !important;
        flex: none;
        line-height: 0.56rem;
      }
      .van-tab--active {
        border: 0.01rem solid rgba(0, 123, 246, 0.3) !important;
        border-radius: 0.04rem;
        box-shadow: 0px 0.02rem 0.1rem 0px rgba(65, 93, 148, 0.15);
        font-weight: 500;
      }
      .van-tabs--card > .van-tabs__wrap {
        // height: 0.6rem !important;
        background: #f2f3f5;
        border-radius: 0.06rem;
        padding: 0.01rem;
        padding-left: 0.02rem;
        padding-right: 0.02rem;
        height: 100%;
      }
      .van-tabs__nav--card {
        height: 100%;
      }
    }
    // tab下面的内容
    .account-position-info {
      margin-top: 0.5rem;
      .name {
        width: 34%;
        white-space: wrap;
        font-family: PingFangSC, PingFangSC-Medium;
      }
      .yesday-earn {
        width: 34%;
        text-align: right;
        // word-break: break-all;
      }
      .hold-income {
        width: 31%;
        text-align: right;
        // word-break: break-all;
      }
      .position-title {
        font-size: 0.24rem;
        color: #999;
      }
      .position-body {
        margin-top: 0.2rem;
        .strip {
          padding: 0.33rem 0;
          border-top: 0.01rem solid #e6e6e6;
          &:first-child {
            border-top: none;
          }
          .strip-top {
            font-size: 0.28rem;
            color: #333;
            font-weight: 500;
            font-family: PingFangSC, PingFangSC-Medium;
          }
          .strip-bot {
            font-size: 0.24rem;
            color: #999;
            font-family: PingFangSC, PingFangSC-Medium;
          }
          .small-box {
            width: 34%;
            color: #999;
            font-size: 0.24rem;
            text-align: left;
          }
          .small-tip {
            display: inline-block;
            background: #e5f1fe;
            border-radius: 2px;
            color: #007bf6;
            font-size: 0.2rem;
            padding: 0.06rem 0.1rem;
            align-items: center;
            transform: scale(0.9);
          }
        }
      }
    }
  }
  // 空状态样式
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
