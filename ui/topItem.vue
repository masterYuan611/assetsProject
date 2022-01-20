<template>
  <div class="topItem">
    <div class="left">
      <p
        class="name"
        style="
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        "
      >
        {{ item.name }}
      </p>
      <p class="code">{{ item.code }}</p>
    </div>
    <div class="progress-box" :style="{ color: isloss ? '#EFFCEF' : '#fff5f4' }">
      <div class="progress">
        <div class="proportion" :class="{ loss: isloss }" :style="{ width: item.width }"></div>
      </div>
    </div>
    <div class="right">
      <p class="number" :style="{ color: isloss ? '#16A043' : '#e72b2b' }">
        {{ item.number | dealSumMoney }}
      </p>
      <p class="code">{{ item.percent }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item", "isloss"],
};
</script>

<style lang="less" scoped>
.topItem {
  margin-top: 0.43rem;
  display: flex;
  align-items: center;
  .code {
    color: #999;
    font-size: 0.24rem;
    font-weight: 400;
    height: 0.29rem;
    line-height: 0.29rem;
  }
  .left {
    flex: 1;
  }
  .name {
    color: #333;
    font-size: 0.28rem;
    font-weight: 400;
    max-height: 0.8rem;
    min-height: 0.4rem;
    line-height: 0.4rem;
    margin-bottom: 0.05rem;
  }

  .number {
    color: #e72b2b;
    font-size: 0.28rem;
    font-weight: 500;
    height: 0.34rem;
    line-height: 0.34rem;
    margin-bottom: 0.08rem;
  }
  .progress-box {
    flex: 2;
    margin-right: 0.33rem;
    margin-left: 0.41rem;
    width: 2.8rem;
    color: #fff5f4;
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
        height: 0.1rem;
        border-radius: 0.05rem;
        background: linear-gradient(270deg, #ffb9b9, #ff6666);
      }
      .loss {
        background: linear-gradient(270deg, #baf3ba, #40cc6e);
      }
    }
  }
  .right {
    margin-left: auto;
    flex: 1;
  }
}
</style>
