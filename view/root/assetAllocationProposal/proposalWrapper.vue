<template>
  <div class="proposal-wrapper">
    <div class="proposal-main">
      <div class="page-title">
        <span class="title-name">{{ title }}</span>
        <div class="title-info">
          {{ describe }}
          <div class="page">
            <span class="current">{{ page }}</span
            >/3
          </div>
        </div>
      </div>
      <!-- 自定义内容 -->
      <slot></slot>
    </div>
    <div class="footer">
      <!-- 自定义底部按钮 -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 页面主标题
    title: {
      type: String,
      default: "投顾观点",
    },
    // 页面内容描述
    describe: {
      type: String,
      default: "每份报告只可选择其中一个观点",
    },
    // 当前页数
    page: {
      type: String,
      default: "1",
    },
  },
};
</script>

<style lang="less" scoped>
.proposal-wrapper {
  padding-bottom: 1.4rem;
  background: #f2f3f5;
  font-family: PingFangSC-Medium, PingFang SC;
  .proposal-main {
    // background: linear-gradient(180deg, #3975c6 0%, #3674d0 17%, #3f70d2 65%, #f2f3f5 100%);
    background-image: url("../../../images/proposal-bg.png");
    background-size: 100% 4.6rem;
    background-repeat: no-repeat;
    .page-title {
      padding: 0.25rem 0.5rem 0.4rem 0.5rem;
      font-size: 0.46rem;
      font-weight: 500;
      color: #fff;
      line-height: 0.65rem;
      .title-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 0.1rem;
        font-size: 0.28rem;
        font-weight: 400;
        line-height: 0.4rem;
        color: rgba(255, 255, 255, 0.65);
        .page {
          .current {
            font-size: 0.48rem;
            color: #fff;
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.1rem;
    background: #ffffff;
    // box-shadow: 0px -1px 0px 0px #e6e6e6;
    border-top: 0.01rem solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom);
    padding-right: 0.4rem;
  }
}
</style>
