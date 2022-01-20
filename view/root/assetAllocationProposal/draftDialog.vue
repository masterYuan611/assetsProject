<template>
  <div class="draft-dialog" v-if="value" @click="handleOverlayClick">
    <div class="dialog-main" :style="dialogStyle" ref="dialog-main">
      <div class="dialog-content">
        <slot></slot>
      </div>
      <div class="dialog-footer">
        <span class="left-btn" @click="handleLeftClick">{{ leftBtnName }}</span>
        <span class="right-btn" @click="handleRightClick">{{ rightBtnName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示
    value: {
      type: Boolean,
      default: false,
    },
    // 左侧按钮文案
    leftBtnName: {
      type: String,
      default: "",
    },
    // 右侧按钮文案
    rightBtnName: {
      type: String,
      default: "",
    },
    // 弹框自定义样式
    dialogStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    // 左侧按钮点击
    handleLeftClick() {
      this.$emit("left-click");
    },
    // 右侧按钮点击
    handleRightClick() {
      this.$emit("right-click");
    },
    // 隐藏遮罩层
    handleOverlayClick({ path }) {
      if (path.includes(this.$refs["dialog-main"])) return;
      this.$emit("hide");
    },
  },
};
</script>

<style lang="less" scoped>
.draft-dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC-Regular, PingFang SC;
  .dialog-main {
    background: #fff;
    border-radius: 0.1rem;
  }
  .dialog-content {
    padding: 0.4rem;
  }
  .dialog-footer {
    display: flex;
    height: 1rem;
    border-top: 1px solid #e9ebf0;
    font-size: 0.34rem;
    font-weight: 400;
    color: #333333;
    .left-btn,
    .right-btn {
      flex: 1;
      line-height: 1rem;
      text-align: center;
    }
    .right-btn {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      color: #007bf6;
      font-weight: 500;
      font-size: 0.3rem;
    }
  }
}
</style>
