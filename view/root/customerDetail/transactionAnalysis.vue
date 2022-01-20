<template>
  <div class="transaction-analysis">
    <!-- 交易行为特征 -->
    <div class="model-card behavior">
      <h3 class="titel">交易行为特征</h3>
      <!-- 标签 -->
      <!-- <div class="label">
        <span>持股较多</span>
        <span>习惯重仓</span>
        <span>高频交易者</span>
        <span>持股偏好长线</span>
        <span>公告时间狂热者</span>
        <span>偏好中盘股</span>
      </div> -->
      <!-- 分类 -->
      <!-- 品类都没有则不展示tab -->
      <div
        v-if="
          tradingBehaviorList &&
          (tradingBehaviorList.shares || tradingBehaviorList.bond || tradingBehaviorList.conduct)
        "
      >
        <div v-if="getTradeBehaviorNum >= 2" class="tab-box">
          <van-tabs
            type="card"
            v-model="activeName"
            background="#f2f3f5"
            title-inactive-color="#666"
            title-active-color="#007BF6"
            color="#fff"
            @click="onClickBehavior"
          >
            <van-tab v-if="tradingBehaviorList.shares" title="股票" name="stock"> </van-tab>
            <van-tab v-if="tradingBehaviorList.bond" title="债券" name="bond"></van-tab>
            <van-tab v-if="tradingBehaviorList.conduct" title="理财" name="manage"></van-tab>
          </van-tabs>
        </div>
        <div class="behavior-mian">
          <!-- 平均仓位 -->
          <div class="content">
            <div class="data-box">
              <span class="data">{{ tradingBehaviorData.avgHoldRate }}</span>
              <p class="txt">{{ averagePosition }}</p>
            </div>
            <div class="summarize behavio-summarize">
              <p>
                <span class="icon"></span>
                {{ tradingBehaviorData.closeScript }}
              </p>
            </div>
          </div>
          <!-- 日交易次数 -->
          <div class="content">
            <div class="flex">
              <div class="data-box">
                <span class="data">{{ tradingBehaviorData.avgTrdTms }}</span>
                <p class="txt">日均交易次数</p>
              </div>
              <div class="progress-box">
                <div class="progress">
                  <div class="proportion" :style="{ width: propotionWidth }"></div>
                </div>
                <p class="txt">
                  <span :class="propActive === 1 ? 'active' : ''">低频</span>
                  <span :class="propActive === 2 ? 'active' : ''">中频</span>
                  <span :class="propActive === 3 ? 'active' : ''">高频</span>
                </p>
              </div>
            </div>
            <div class="summarize behavio-summarize">
              <p>
                <span class="icon"></span>
                {{ tradingBehaviorData.frequencyScript }}
              </p>
            </div>
          </div>
          <!-- 胜率 -->
          <div v-if="isWinRate" class="content">
            <div class="flex">
              <div class="data-box">
                <span class="data">{{ tradingBehaviorData.sucsRate }}</span>
                <p class="txt">{{ winRate }}胜率</p>
              </div>
              <div class="data-pk flex">
                <div>
                  <!-- 颜色不变 -->
                  <span class="color-victory">{{ tradingBehaviorData.sucsRate }}</span>
                  <p class="txt">客户</p>
                </div>
                <!-- 左右图标不一致，间距不一致，故用背景图 pk-img-right -->
                <!-- 确定返回类型之后要转换成number进行比较 -->
                <div
                  :class="[
                    parseFloat(tradingBehaviorData.sucsRate) >=
                    parseFloat(tradingBehaviorData.avgSucsRate)
                      ? 'pk-img-left'
                      : 'pk-img-right',
                  ]"
                ></div>
                <div>
                  <!-- 颜色不变 -->
                  <span class="color-fail">{{ tradingBehaviorData.avgSucsRate }}</span>
                  <p class="txt">股民平均</p>
                </div>
              </div>
            </div>
            <div v-if="tradingBehaviorData.rateofwinningScript" class="summarize behavio-summarize">
              <p>
                <span class="icon"></span>
                {{ tradingBehaviorData.rateofwinningScript }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 空状态样式 -->
      <div v-else class="no-data">
        <img class="no-data-img" src="images/no-data.png" />
        <p class="no-data-txt">无历史交易记录</p>
      </div>
    </div>
    <!-- 特征股票 -->
    <div class="model-card feature">
      <h3 class="titel">特征股票</h3>
      <div v-if="featuresStockList">
        <!-- 最长持有 -->
        <div>
          <h4 class="subtitle">最长持有</h4>
          <div class="feature-body">
            <div
              v-for="(item, index) in featuresStockList.longHoldingTimeList"
              :key="index"
              class="strip flex"
            >
              <div class="name-box">
                <span class="icon"></span>
                <span class="sec-name">{{ item.secNm }}</span>
              </div>
              <div>{{ item.holdCnt }}天</div>
            </div>
          </div>
        </div>
        <!-- 最常操作 -->
        <div class="mt-50">
          <h4 class="subtitle">最常操作</h4>
          <div
            v-if="
              featuresStockList.mostTransactionsList &&
              featuresStockList.mostTransactionsList.length > 0
            "
            class="feature-body"
          >
            <div
              v-for="(item, index) in featuresStockList.mostTransactionsList"
              :key="index"
              class="strip flex"
            >
              <div class="name-box">
                <span class="icon"></span>
                <span class="sec-name">{{ item.secNm }}</span>
              </div>
              <div>{{ item.holdCnt }}次</div>
            </div>
          </div>
          <!-- 空状态样式 -->
          <div v-else class="no-data">
            <img class="no-data-img" src="images/no-data.png" />
            <p class="no-data-txt">无股票交易记录</p>
          </div>
        </div>
        <!-- 总结部分 -->
        <div class="summarize">
          <p class="paragraph">
            <span class="icon"></span>
            <span>
              {{ featuresStockList.strScript }}
            </span>
          </p>
        </div>
      </div>
      <!-- 空状态样式 -->
      <div v-else class="no-data">
        <img class="no-data-img" src="images/no-data.png" />
        <p class="no-data-txt">无股票交易记录</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "transactionAnalysis", //账户诊断tab
      activeName: "stock", //交易行为tab
      secType: 0, //交易行为参数
      tradingBehaviorList: {}, // 交易行为总数据
      tradingBehaviorData: {}, // 交易行为渲染数据
      featuresStockList: null, //特征股票
      propotionWidth: "40%", // 频率进度条宽度
      propActive: 1, // 频率进度条文字高亮
      averagePosition: "股票平均仓位",
      winRate: "股票",
      getTradeBehaviorNum: 0,
      isWinRate: true, // 是否要展示胜率模块
    };
  },
  computed: {
    custNo() {
      return sessionStorage.getItem("custNo");
    },
  },
  created() {
    this.getTradeBehavior(); // 交易行为请求（聚合）
    this.getTradeFeatureso(); // 股票特征
  },
  methods: {
    // 点击tab切换
    onClickBehavior(name, title) {
      switch (title) {
        case "股票":
          this.tradingBehaviorData = this.tradingBehaviorList.shares;
          // 频率进度相关判断
          this.propotionDetail();
          this.averagePosition = "股票平均仓位";
          this.winRate = "股票";
          this.isWinRate = true;
          break;
        case "债券":
          this.tradingBehaviorData = this.tradingBehaviorList.bond;
          // 频率进度相关判断
          this.propotionDetail();
          this.averagePosition = "债券平均仓位";
          this.winRate = "债券";
          this.isWinRate = false;
          break;
        case "理财":
          this.tradingBehaviorData = this.tradingBehaviorList.conduct;
          // 频率进度相关判断
          this.propotionDetail();
          this.averagePosition = "理财产品平均仓位";
          this.winRate = "理财产品";
          this.isWinRate = false;
          break;
      }
    },
    // 交易行为
    getTradeBehavior() {
      this.$apiFwgx
        .getTradeBehavior({
          custNo: this.custNo, //客户号
          secType: this.secType, // 交易行为参数
        })
        .then((res) => {
          console.log("getTradeBehavior数据", res);
          this.tradingBehaviorList = JSON.parse(JSON.stringify(res.data.data));
          // tab是否展示
          let num = 0;
          if (this.tradingBehaviorList.shares) {
            num += 1;
          }
          if (this.tradingBehaviorList.bond) {
            num += 1;
          }
          if (this.tradingBehaviorList.conduct) {
            num += 1;
          }
          this.getTradeBehaviorNum = num;
          // 默认值渲染
          if (this.tradingBehaviorList.shares) {
            this.tradingBehaviorData = this.tradingBehaviorList.shares; // 默认渲染
            this.averagePosition = "股票平均仓位";
            this.winRate = "股票";
            this.isWinRate = true;
          } else if (this.tradingBehaviorList.bond) {
            this.tradingBehaviorData = this.tradingBehaviorList.bond; // 默认渲染
            this.averagePosition = "债券平均仓位";
            this.winRate = "债券";
            this.isWinRate = false;
          } else if (this.tradingBehaviorList.conduct) {
            this.tradingBehaviorData = this.tradingBehaviorList.conduct; // 默认渲染
            this.averagePosition = "理财产品平均仓位";
            this.winRate = "理财产品";
            this.isWinRate = false;
          }
          this.propotionDetail(); // 频率进度相关判断
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 频率进度相关判断
    propotionDetail() {
      if (this.tradingBehaviorData.avgTrdTmsNum >= 5) {
        this.propotionWidth = "100%";
        this.propActive = 3;
      } else if (
        this.tradingBehaviorData.avgTrdTmsNum > 1 &&
        this.tradingBehaviorData.avgTrdTmsNum < 5
      ) {
        this.propActive = 2;
        if (this.tradingBehaviorData.avgTrdTmsNum === 2) {
          this.propotionWidth = "40%";
        } else if (this.tradingBehaviorData.avgTrdTmsNum === 3) {
          this.propotionWidth = "60%";
        } else {
          this.propotionWidth = "80%";
        }
      } else {
        this.propActive = 1;
        this.propotionWidth = "20%";
      }
    },
    // 特征股票
    getTradeFeatureso() {
      this.$apiFwgx
        .getTradeFeatureso({
          custNo: this.custNo, //客户号
        })
        .then((res) => {
          this.featuresStockList = JSON.parse(JSON.stringify(res.data.data));
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>

<style lang="less" scope>
.transaction-analysis {
  // 公共样式
  .flex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .mt-50 {
    margin-top: 0.5rem;
  }

  .mt-20 {
    margin-top: 0.2rem;
  }
  padding: 0.001rem 0.3rem 0.4rem;
  background: #f2f3f5;
  font-weight: 400;
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
    }
  }
  // 总结片段
  .summarize {
    position: relative;
    margin-top: 0.3rem;
    padding: 0.3rem 0.3rem 0.2rem;
    background: #f7f8fa;
    font-size: 0.26rem;
    color: #666;
    line-height: 1.7;
    border-radius: 0.04rem;
    &::before {
      position: absolute;
      top: -0.14rem;
      left: 0.25rem;
      display: inline-block;
      content: "";
      width: 0;
      height: 0;
      border-left: 0.15rem solid transparent;
      border-right: 0.15rem solid transparent;
      border-bottom: 0.15rem solid #f7f8fa;
    }
    .icon {
      position: relative;
      top: -0.04rem;
      display: inline-block;
      width: 0.24rem;
      height: 0.22rem;
      background: url("../../../images/icom-comma.png");
      background-size: 100%;
      vertical-align: middle;
      margin-right: 0.06rem;
    }
    .tip-txt {
      color: #333;
    }
  }
  // 行为特征
  .behavior {
    // tab样式调整
    .tab-box {
      margin-top: 0.6rem;
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
    // tab下的内容
    .content {
      margin-top: 0.8rem;
      font-size: 0.28rem;
      color: #333;
      &:first-child {
        margin-top: 0.6rem;
      }
      .progress-box {
        width: 3.3rem;
        color: #999;
        font-size: 0.24rem;
        .progress {
          position: relative;
          height: 0.1rem;
          background: #f7f8fa;
          border-radius: 0.05rem;
          overflow: hidden;
          &::before,
          &::after {
            position: absolute;
            top: 0;
            display: block;
            content: "";
            border-right: 0.02rem solid #fff;
            height: 0.1rem;
            z-index: 99;
          }
          &::before {
            left: 0.83rem;
          }
          &::after {
            right: 1.22rem;
          }
          .proportion {
            width: 50%;
            height: 0.1rem;
            border-radius: 0.05rem;
            background: linear-gradient(315deg, #7cb8f1, #44a2ff 85%);
          }
        }
        .txt {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 0.1rem;
        }
        .active {
          color: #007bf6;
          font-weight: 500;
        }
      }
      .data-box {
        line-height: 1;
        .data {
          font-size: 0.36rem;
        }
        .txt {
          font-size: 0.24rem;
          color: #999;
          margin-top: 0.1rem;
        }
      }
      .data-pk {
        font-size: 0.28rem;
        font-weight: 500;
        text-align: center;
        .color-victory {
          color: #ff725b;
        }
        .color-fail {
          color: #007bf6;
        }
        .pk-img-left,
        .pk-img-right {
          width: 1.1rem;
          height: 0.96rem;
        }
        .pk-img-left {
          background: url("../../../images/icon-pk-left.png");
          background-size: 100%;
          margin-left: 0.22rem;
          margin-right: 0.4rem;
        }
        .pk-img-right {
          background: url("../../../images/icon-pk-right.png");
          background-size: 100%;
          margin-right: 0.22rem;
          margin-left: 0.4rem;
        }
        .txt {
          font-weight: 400;
          font-size: 0.24rem;
          color: #999;
        }
      }
    }
    .behavio-summarize {
      font-size: 0.28rem;
      padding: 0.24rem 0.3rem;
      color: #333;
    }
  }
  // 特征股票
  .feature {
    font-size: 0.28rem;
    color: #333;
    .subtitle {
      margin-top: 0.3rem;
      font-weight: 500;
      &::before {
        position: relative;
        top: 0.02rem;
        content: "";
        display: inline-block;
        width: 0.06rem;
        height: 0.24rem;
        background: #007bf6;
        margin-right: 0.1rem;
      }
    }
    .feature-body {
      margin-top: 0.2rem;
      padding: 0.26rem 0.3rem;
      border: 0.01rem solid #ebebeb;
      border-radius: 0.04rem;
      .strip {
        margin-top: 0.4rem;
        &:first-child {
          margin-top: 0;
        }
        .name-box {
          display: flex;
          align-items: center;
          .icon {
            display: inline-block;
            width: 0.44rem;
            height: 0.44rem;
            margin-right: 0.2rem;
            background: url("../../../images/gold-medal.png") no-repeat;
            background-size: 100%;
          }
          .sec-name {
            display: inline-block;
            max-width: 4rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        &:nth-child(2) .icon {
          background: url("../../../images/silver-medal.png") no-repeat;
          background-size: 100%;
        }
        &:nth-child(3) .icon {
          background: url("../../../images/bronze-medal.png") no-repeat;
          background-size: 100%;
        }
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
