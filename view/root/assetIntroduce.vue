<template>
  <div class="inde">
    <div class="one">
      <img src="images/intoduce1.png" alt="" />
    </div>
    <div class="one">
      <img src="images/intoduce2.png" alt="" />
    </div>
    <div class="one">
      <img src="images/intoduce3.png" alt="" />
    </div>
    <div class="four">
      <img src="images/intoduce4.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.inde {
  width: 7.5rem;
}

.one {
  width: 100%;
  height: 8.7rem;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.four {
  width: 100%;
  height: 8.63rem;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
