<template>
  <div class="profitLossYear"></div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.profitLossYear {
  margin-top: 0.2rem;
  position: relative;
  background-color: #fff;
  padding: 0.5rem 0.3rem 0.4rem 0.3rem;
  border-radius: 0.1rem;
  &::before {
    content: "";
    display: block;
    background: url("/images/icon-handle.png") no-repeat;
    background-size: 100%;
    height: 0.63rem;
    position: absolute;
    top: -0.4rem;
    left: 0.3rem;
    right: 0.3rem;
  }
}
</style>
