<template>
  <div class="product-list">
    <van-nav-bar title="产品列表" left-arrow @click-left="onClickLeft" :border="false">
      <template #left>
        <img src="images/back.png" />
      </template>
    </van-nav-bar>
    <div class="product-tab">
      <van-tabs v-model="active">
        <van-tab title="产品组合池" name="productCombination"></van-tab>
        <van-tab title="基金池" name="fundPool"></van-tab>
      </van-tabs>
    </div>
    <div class="product-main">
      <sub-view></sub-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: "productCombination",
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
  watch: {
    active: {
      immediate: true,
      handler(val) {
        this.$router.replace(`/root/productsList/productsTab/${val}`);
      },
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .van-nav-bar {
  .van-nav-bar__content {
    height: 0.88rem;
  }
  .van-nav-bar__title {
    font-size: 0.36rem;
    font-weight: 400;
    color: #383838;
  }
  img {
    width: 0.4rem;
  }
}
/deep/ .van-tabs {
  font-size: 0.28rem;
  font-weight: 400;
  color: #666666;
  .van-tabs__wrap {
    height: 0.9rem;
  }
  .van-tab--active {
    font-weight: 500;
    color: #007bf6;
  }
  .van-tabs__line {
    width: 0.4rem;
    height: 0.06rem;
    border-radius: 0.03rem;
    background-color: #007bf6;
  }
}
.product-tab {
  background: #ffffff;
  border-radius: 0px 2px 2px 2px 0px 0px 0px;
  box-shadow: 0px 1px 0px 0px #bcbfc5;
}
</style>
