<template>
  <transition name="confirm-fade">
    <div v-if="isShowConfirm" class="my-confirm" @click.stop="clickFun()">
      <div class="confirm-content-wrap" @click.stop>
        <div class="header-content">
          <p class="my-confirm-content-title">客户风险等级与资产配置建议服务要求不完全相符：</p>
          <p v-for="(item, index) in tipInforArr" :key="index" class="my-confirm-content">
            {{ item }}
          </p>
        </div>
        <div class="my-operation">
          <div class="confirm-btn" @click="clickFun()">
            <p class="my-btn-text">知道了</p>
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
      tipInforArr: [],
    };
  },
  methods: {
    show(data) {
      this.tipInforArr.push(...data);
      this.isShowConfirm = true;
      document.querySelector("body").setAttribute("style", "overflow:hidden;");
    },
    clickFun() {
      this.isShowConfirm = false;
      this.tipInforArr = [];
      document.body.removeAttribute("style");
    },
  },
};
</script>

<style scoped>
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
  padding: 0.4rem 0.4rem;
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
