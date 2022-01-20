<template>
  <div class="estimate">
    <div class="verticalLine"></div>
    <span class="title1">{{ title }}</span>
    <img class="img" src="images/explain.png" @click="showDialog" />
  </div>
</template>

<script>
export default {
  props: ["title"],
  methods: {
    showDialog() {
      this.$EventBus.$emit("appraise", this.title);
    },
  },
};
</script>

<style lang="less" scoped>
.estimate {
  display: flex;
  align-items: center;
  .verticalLine {
    width: 0.06rem;
    height: 0.24rem;
    background: #007bf6;
    margin-right: 0.1rem;
  }
  .title1 {
    font-size: 0.28rem;
    height: 0.4rem;
    line-height: 0.4rem;
    font-weight: 500;
    color: #333;
    margin-right: 0.1rem;
  }
  .img {
    width: 0.28rem;
    height: 0.28rem;
  }
}
</style>
