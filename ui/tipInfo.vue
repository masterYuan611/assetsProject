<template>
  <div class="tip">
    <div class="triangle-up"></div>
    <div class="tipInfo" :class="{ nomarginbottom: ischange }">
      <p><span class="icon"></span>{{ tip }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["tip", "ischange"],
};
</script>

<style lang="less" scoped>
.nomarginbottom {
  margin-bottom: 0 !important;
}
.triangle-up {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid #f7f8fa;
  position: relative;
  left: 0.2rem;
}
.tip {
  .tipInfo {
    background-color: #f7f8fa;
    padding: 0.24rem 0.3rem;
    font-size: 0.28rem;
    line-height: 0.46rem;
    color: #333;
    font-weight: 400;
    border-radius: 0.08rem;
    margin-bottom: 0.8rem;
  }
  .icon {
    position: relative;
    top: -0.04rem;
    display: inline-block;
    width: 0.24rem;
    height: 0.22rem;
    background: url("../images/icom-comma.png");
    background-size: 100%;
    vertical-align: middle;
    margin-right: 0.06rem;
  }
}
</style>
