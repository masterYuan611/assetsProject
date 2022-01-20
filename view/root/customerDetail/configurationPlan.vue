<template>
  <div class="configura-plan">
    <!-- <div class="configuraSpan">
      <van-icon name="arrow-left" @click="onClickLeft" size="0.36rem" color="#000" />
      <span>资产配置</span>
    </div> -->
    <div class="plan-content">
      <h3 class="tit">对于想要投资的钱，您想要达到的收益水平是多少？</h3>
      <div class="plan-card">
        <h3 class="titel">1、未来一年，您的预期收益目标是？</h3>
        <div class="slider">
          <van-slider
            v-model="planValue"
            @change="onChangeplan"
            max="45"
            min="5"
            inactive-color="#F4F5F"
            active-color="#44A2FF"
            :data-attr="planValue"
          >
            <template #button>
              <div class="custom-button">
                <div class="target-num">{{ planValue }}%</div>
              </div>
            </template>
          </van-slider>
          <div class="flex slider-num">
            <span>5%</span>
            <span>15%</span>
            <span>25%</span>
            <span>35%</span>
            <span>45%</span>
          </div>
        </div>
        <!-- 总结部分 -->
        <div class="summarize">
          <p class="paragraph">
            <span class="icon"></span>
            <span>此数值会作为模型计算参考，不代表必然能够实现</span>
          </p>
        </div>
      </div>
      <div class="plan-card handle-bg">
        <h3 class="titel">2、当收益下跌多少时，您会有明显的焦虑？</h3>
        <!-- 单选 -->
        <van-radio-group v-model="lossRadio" @change="onChangeRadio">
          <van-radio name="1">
            下跌10%
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
          <van-radio name="2">
            下跌20%
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
          <van-radio name="3">
            下跌30%
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
          <van-radio name="4">
            下跌50%
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
          <van-radio name="5">
            其他
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
        </van-radio-group>
        <!-- 其他数值 -->
        <!-- 允许输入正整数，调起纯数字键盘 -->
        <van-field
          v-show="lossRadio == 5"
          placeholder="请输入大于0小于100的整数"
          v-model="otherValue"
          type="digit"
          input-align="left"
        >
          <template #extra>
            <span class="sign">%</span>
          </template>
        </van-field>
        <!-- 总结部分 -->
        <div class="summarize">
          <p class="paragraph">
            <span class="icon"></span>
            <span>此数值会转换为最大可承受风险，作为模型计算参考</span>
          </p>
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="plan-btn" @click="goAssetAlloction">试算资产配置方案</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      planValue: 15, // 年化收益目标
      lossRadio: "2", // 单选默认值
      lossValue: 20, // 最大可承受风险
      activeIcon: require("images/icon-radio-active.png"), //单选未选中状态
      inactiveIcon: require("images/icon-radio-no.png"), //单选中状态
      otherValue: "", //最大可承受风险 其他数值
      custNo: this.$route.query.custNo, //客户号
      flag: false, //判断是否是首页直接进入
    };
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next((vm) => {
      if (from.path == "/root/home") {
        vm.flag = true;
      } else {
        vm.flag = false;
      }
    });
  },
  methods: {
    // 返回按钮
    onClickLeft() {
      this.$router.go(-1);
    },
    // 点击试算按钮
    goAssetAlloction() {
      this.radioValue(); // 下跌单选值
      if (this.lossValue > 100 || this.lossValue < 1) {
        this.$toast("最大可承受风险应该介于1%~100%之间");
        this.otherValue = null;
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        return;
      }
      if (!this.flag && this.$route.query.custNo) {
        this.$apiFwgx
          .postAllocationRevise({
            annualizedRateOfReturnPer: this.planValue, //年化收益目标
            custNo: this.custNo, //客户号
            maximumRiskTolerancePer: this.lossValue, //最大可承受风险
          })
          .then((data) => {
            console.log("goAssetAlloction-数据", data);
            // 跳转资产配置页
            this.$light.navigate(`/root/assetAllocation/assetAllocation?id=${this.custNo}&type=2`);
          })
          .catch((error) => {
            console.log("error", error);
            this.$toast.fail("请求失败，请稍后重试");
          });
      } else {
        this.$light.navigate(
          `/root/assetAllocation/assetAllocation?annualizedRateOfReturnPer=${this.planValue}&maximumRiskTolerancePer=${this.lossValue}&type=1`,
        );
      }
    },
    onChangeplan(planValue) {
      console.log(planValue);
    },
    onChangeRadio() {
      console.log(this.lossRadio);
    },
    // 最大可承受风险
    radioValue() {
      switch (this.lossRadio) {
        case "1":
          this.lossValue = 10;
          break;
        case "2":
          this.lossValue = 20;
          break;
        case "3":
          this.lossValue = 30;
          break;
        case "4":
          this.lossValue = 50;
          break;
        case "5":
          this.lossValue = this.otherValue;
          break;
      }
    },
  },
};
</script>

<style lang="less" scope>
// html,
// body {
//   height: 100%;
//   overflow: hidden;
// }
.configura-plan {
  // position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  // background: linear-gradient(#e6f4ff, #fafcff);
  background: linear-gradient(180deg, #e6f4ff, #f5faff 19%, #f7f9fc 51%, #fafcff);
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  // 头部标题
  .configuraSpan {
    padding: 0.2rem 0.3rem 0;
    line-height: 0.5rem;
    height: 0.5rem;
    display: flex;
    flex-direction: row;
    .van-icon {
      top: 0.07rem;
    }
    span {
      margin: 0 auto;
      font-size: 0.36rem;
      color: #383838;
    }
  }
  .plan-content {
    padding: 0.86rem 0.3rem 1.4rem;
    overflow-y: auto;
    flex-shrink: 1;
    flex-grow: 1;
    .tit {
      font-size: 0.36rem;
      font-weight: 500;
      color: #333;
      line-height: 1.7;
      padding-left: 0.1rem;
    }
    .plan-card {
      position: relative;
      margin-top: 0.2rem;
      padding: 0 0.3rem 0.4rem;
      background: #fff;
      border-radius: 0.1rem;
      line-height: 1.5;

      .titel {
        font-size: 0.32rem;
        padding-top: 0.5rem;
        font-weight: 500;
      }
    }
    .handle-bg::before {
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
    // 滑块
    .slider {
      padding: 0 0.2rem;
      margin-top: 0.4rem;
      padding-top: 0.68rem;
      .slider-num {
        color: #333;
        font-size: 0.28rem;
        margin-top: 0.3rem;
      }
      .van-slider {
        height: 0.1rem;
      }
      .van-slider__bar {
        background: linear-gradient(to right, #00aff6, #007bf6) !important;
      }
      .custom-button {
        position: relative;
        width: 0.4rem;
        height: 0.4rem;
        background: #ffffff;
        border: 1px solid rgba(0, 123, 246, 0.2);
        border-radius: 50%;
        box-shadow: 0px 2px 10px 0px rgba(23, 60, 97, 0.2);

        .target-num {
          position: absolute;
          top: -0.68rem;
          left: 50%;
          margin-left: -0.6rem;
          border: 0.01rem solid #7fbdfa;
          border-radius: 0.3rem;
          width: 1.2rem;
          height: 0.46rem;
          background: #fff;
          font-size: 0.28rem;
          font-weight: 500;
          text-align: center;
          line-height: 0.48rem;
          color: #007bf6;
          &::after {
            position: absolute;
            bottom: -0.12rem;
            left: 0.44rem;
            display: inline-block;
            content: "";
            width: 0;
            height: 0;
            border-left: 0.15rem solid transparent;
            border-right: 0.15rem solid transparent;
            border-top: 0.15rem solid #7fbdfa;
            z-index: -1;
          }
          &::before {
            position: absolute;
            bottom: -0.1rem;
            left: 0.44rem;
            display: inline-block;
            content: "";
            width: 0;
            height: 0;
            border-left: 0.15rem solid transparent;
            border-right: 0.15rem solid transparent;
            border-top: 0.15rem solid #fff;
          }
        }
      }
    }
    // 单选
    .van-radio {
      margin-top: 0.4rem;
      font-size: 0.28rem;
      color: #333;
      .img-icon {
        width: 0.35rem;
        height: 0.35rem;
        position: relative;
        top: -0.04rem;
      }
      .van-radio__label {
        margin-left: 0.2rem;
      }
    }
    // 其他
    .van-field {
      border: 0.01rem solid #ebebeb;
      padding: 0.18rem 0.3rem 0.19rem;
      font-size: 0.28rem;
      margin-top: 0.4rem;
      .van-field__label {
        color: #999;
      }
      .van-field__value {
        color: #333;
      }
      .sign {
        margin-left: 0.1rem;
      }
    }

    // 总结片段
    .summarize {
      position: relative;
      margin-top: 0.4rem;
      padding: 0.19rem 0.2rem 0.15rem;
      background: #f7f8fa;
      font-size: 0.22rem;
      color: #999;
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
    }
  }
  .footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0.2rem 0.4rem 0.3rem;
    background: #fff;
    height: 1.1rem;
    box-shadow: 0px -1px 0px 0px #ebebeb;
    padding-bottom: env(safe-area-inset-bottom);
    .plan-btn {
      width: 100%;
      line-height: 0.8rem;
      border-radius: 0.46rem;
      background: linear-gradient(to right, #00aff6, #007bf6);
      font-weight: 500;
      text-align: center;
      color: #fff;
      font-size: 0.36rem;
    }
  }
}
</style>
