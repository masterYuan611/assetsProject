<template>
  <transition name="confirm-fade">
    <div v-if="isShowConfirm" class="my-confirm" @click.stop="clickFun()">
      <div class="confirm-content-wrap" @click.stop>
        <div class="header-content">
          <p class="title1">{{ type === "reject" ? "驳回观点" : "下架观点" }}</p>
          <p class="note">
            {{
              type === "reject"
                ? "请输入驳回理由，被驳回的观点可以由创建者编辑后再次提交"
                : "观点下架后，将不再对外展示，是否确认下架？"
            }}
          </p>
          <van-field
            class="reason"
            v-model="message"
            autosize
            type="textarea"
            rows="5"
            maxlength="50"
            :placeholder="type === 'reject' ? '请输入驳回观点' : '请输入下架理由'"
            show-word-limit
          />
        </div>
        <div class="my-operation">
          <div class="cancel" @click="clickFun">取消</div>
          <div class="define" :style="{ opacity: message.trim() ? 1 : 0.5 }" @click="define">
            保存
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      isShowConfirm: false, // 用于控制整个窗口的显示/隐藏
      type: "reject",
      message: "",
      viewId: "",
    };
  },
  methods: {
    show(type, viewId) {
      this.type = type;
      this.viewId = viewId;
      this.isShowConfirm = true;
      document.querySelector("body").setAttribute("style", "overflow:hidden;");
    },
    clickFun() {
      console.log(this.message);
      this.message = "";
      this.isShowConfirm = false;
      document.body.removeAttribute("style");
    },
    define() {
      if (!this.message.trim()) {
        return Toast({
          message: "请输入理由",
          position: "top",
          duration: 2000,
        });
      }
      if (this.type === "reject") {
        // 驳回观点
        this.$apiFwgx
          .viewReject({ auditFeedback: this.message.replace(/\n|\r/gi, ""), viewId: this.viewId })
          .then(({ data }) => {
            if (data.success) {
              this.$EventBus.$emit("define", "reject");
              this.clickFun();
              this.isShowConfirm = false;
            }
          });
      } else {
        // 下架观点
        this.$apiFwgx
          .viewRemove({ auditFeedback: this.message, viewId: this.viewId })
          .then(({ data }) => {
            if (data.success) {
              this.$EventBus.$emit("define", "remove");
              this.clickFun();
              this.isShowConfirm = false;
              this.$router.push("/root/view/search"); // 审核完观点，自动跳转到观点列表中
            }
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.title1 {
  height: 0.54rem;
  font-size: 0.36rem;
  font-weight: 500;
  color: #333333;
  line-height: 0.54rem;
  text-align: center;
  margin-bottom: 0.2rem;
}
.note {
  font-size: 0.28rem;
  font-weight: 400;
  color: #666666;
  line-height: 0.42rem;
  padding: 0 0.1rem;
  margin-bottom: 0.3rem;
}
.reason {
  font-size: 0.3rem;
  font-weight: 400;
  color: #999999;
  height: 3.6rem;
  background: #f4f5f7;
  border-radius: 0.09rem;
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
  width: 5.8rem;
  height: 7.15rem;
  box-sizing: border-box;
  margin: auto;
  background-color: #fff;
  border-radius: 0.1rem;
  z-index: 999;
  user-select: none;
}
.header-content {
  padding: 0.4rem 0.3rem 0.3rem 0.3rem;
}

/* 底部按钮样式 */
.my-operation {
  display: flex;
  border-top: 0.01rem solid rgba(233, 235, 240, 0.6);
  height: 0.98rem;
  .cancel,
  .define {
    flex: 1;
    height: 0.97rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.34rem;
    font-weight: 400;
    color: #333333;
  }
  .cancel {
    border-right: 1px solid rgba(233, 235, 240, 0.6);
  }
  .define {
    color: #007bf6;
  }
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
