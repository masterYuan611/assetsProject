<template>
  <transition name="confirm-fade">
    <div v-if="isShowConfirm" class="my-confirm" @click.stop="clickFun()">
      <div class="confirm-content-wrap" @click.stop>
        <div class="header-content">
          <p class="title1">账户诊断</p>
          <p class="note">
            五维分析针对客户账户近三个月的<span>收益、风险、交易特征</span>等维度进行评价。
          </p>
          <ul class="content">
            <li>收益能力：<span>体现账户的收益高低</span></li>
            <li>风险控制能力：<span>体现账户的回撤大小</span></li>
            <li>择时能力：<span>体现账户交易时点选择</span></li>
            <li>交易胜率：<span>体现账户交易的盈利次数占比</span></li>
            <li>持仓评分：<span>表示当前持仓的配置均衡性</span></li>
          </ul>
        </div>
        <div class="my-operation">
          <div class="confirm-btn" @click="clickFun()">
            <p class="my-btn-text">确定</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShowConfirm: false, // 用于控制整个窗口的显示/隐藏
    };
  },
  methods: {
    show() {
      this.isShowConfirm = true;
      document.querySelector("body").setAttribute("style", "overflow:hidden;");
    },
    clickFun() {
      this.isShowConfirm = false;
      document.body.removeAttribute("style");
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  line-height: 0.6rem;
  font-size: 0.28rem;
  font-weight: 400;
  margin-top: 0.3rem;
  li {
    span {
      color: #999;
    }
  }
  li:before {
    content: "";
    width: 0.04rem;
    height: 0.04rem;
    display: inline-block;
    border-radius: 50%;
    background: #666;
    vertical-align: middle;
    margin-right: 0.14rem;
  }
}
.title1 {
  font-size: 0.32rem;
  height: 0.45rem;
  line-height: 0.45rem;
  font-weight: 500;
}
.note {
  font-size: 0.28rem;
  height: 0.84rem;
  line-height: 0.42rem;
  color: #666;
  font-weight: 400;
  margin-top: 0.2rem;
  span {
    color: #000;
  }
}
.my-confirm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  /* 这里防止当用户长按屏幕，出现的黑色背景色块，以及 iPhone 横平时字体的缩放问题 */
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  overflow: hidden;
}

/* 进入和出去的动画 */
.confirm-fade-enter-active {
  animation: opacity 0.3s;
}
.confirm-fade-enter-active .confirm-content-wrap {
  animation: scale 0.3s;
}
.confirm-fade-leave-active {
  animation: outOpacity 0.2s;
}

/* 包裹层容器样式 */
.confirm-content-wrap {
  width: 6rem;
  box-sizing: border-box;
  margin: auto;
  background-color: #fff;
  border-radius: 0.08rem;
  height: auto;
  z-index: 999;
  user-select: none;
}
.header-content {
  padding: 0.4rem 0.3rem 0.4rem 0.3rem;
}

/* 中间内容部分 */
.my-confirm-content-title {
  font-size: 0.28rem;
  color: #333333;
  text-align: justify;
  line-height: 0.42rem;
  font-weight: 400;
}
.my-confirm-content {
  margin-top: 0.3rem;
  font-size: 0.28rem;
  color: #666666;
  text-align: justify;
  line-height: 0.42rem;
  font-weight: 400;
}

/* 底部按钮样式 */
.my-operation {
  display: flex;
  border-top: 0.01rem solid #e9ebf0;
  padding-top: 0.23rem;
  padding-bottom: 0.24rem;
}
.my-operation .confirm-btn {
  flex: 1;
}
.my-operation .confirm-btn {
  color: #007bf6;
}
.my-operation .my-btn-text {
  font-size: 0.34rem;
  font-weight: 600;
  color: #007bf6;
  letter-spacing: 0;
  text-align: center;
  line-height: 0.52rem;
}

/* 进来的动画 */
@keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes scale {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 出去的动画 */
@keyframes outOpacity {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
